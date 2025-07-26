'use client';

import { useState } from 'react';
import { useAWSProfiles } from '@/contexts/AWSProfileContext';
import { Button } from '@/components/ui/button';
import { Plus, Settings, CheckCircle } from 'lucide-react';
import { 
  CreateProfileForm, 
  EditProfileForm, 
  ProfileCard 
} from '@/components/aws-profiles';
import { CreateAWSProfileRequest, UpdateAWSProfileRequest } from '@/types/aws';

export default function AWSProfilesPage() {
  const { 
    profiles, 
    activeProfile, 
    loading, 
    error, 
    createProfile, 
    updateProfile, 
    deleteProfile, 
    setActiveProfile, 
    validateProfile 
  } = useAWSProfiles();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [validatingProfile, setValidatingProfile] = useState<string | null>(null);

  const handleCreateProfile = async (data: CreateAWSProfileRequest) => {
    await createProfile(data);
    setShowCreateForm(false);
  };

  const handleEditProfile = async (data: UpdateAWSProfileRequest) => {
    await updateProfile(data);
    setEditingProfile(null);
  };

  const handleValidateProfile = async (profileId: string) => {
    try {
      setValidatingProfile(profileId);
      await validateProfile(profileId);
    } catch (err) {
      console.error('Failed to validate profile:', err);
    } finally {
      setValidatingProfile(null);
    }
  };

  const startEditingProfile = (profileId: string) => {
    setEditingProfile(profileId);
  };

  const cancelEditing = () => {
    setEditingProfile(null);
  };

  const getProfileToEdit = () => {
    return profiles.find(p => p.id === editingProfile);
  };

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
            AWS Profiles
          </h1>
          <p className="text-slate-600 mt-2">Manage your AWS access credentials and profiles</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Add Profile</span>
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Active Profile Indicator */}
      {activeProfile && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-medium text-emerald-800">Active Profile: {activeProfile.name}</p>
              <p className="text-sm text-emerald-600">Region: {activeProfile.region}</p>
            </div>
          </div>
        </div>
      )}

      {/* Create Profile Form */}
      {showCreateForm && (
        <CreateProfileForm
          loading={loading}
          onSubmit={handleCreateProfile}
          onCancel={() => setShowCreateForm(false)}
        />
      )}

      {/* Profiles List */}
      <div className="space-y-4">
        {profiles.map((profile) => (
          <div
            key={profile.id}
            className={`bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border transition-all duration-200 ${
              activeProfile?.id === profile.id 
                ? 'border-emerald-300 ring-2 ring-emerald-100' 
                : 'border-teal-100/50 hover:border-teal-200'
            }`}
          >
            {editingProfile === profile.id ? (
              <EditProfileForm
                profile={getProfileToEdit()!}
                loading={loading}
                onSubmit={handleEditProfile}
                onCancel={cancelEditing}
              />
            ) : (
              <ProfileCard
                profile={profile}
                isActive={activeProfile?.id === profile.id}
                isValidating={validatingProfile === profile.id}
                onValidate={() => handleValidateProfile(profile.id)}
                onSetActive={() => setActiveProfile(profile.id)}
                onEdit={() => startEditingProfile(profile.id)}
                onDelete={() => deleteProfile(profile.id)}
              />
            )}
          </div>
        ))}

        {/* Empty State */}
        {profiles.length === 0 && !showCreateForm && (
          <div className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-xl border border-teal-100/50">
            <Settings className="mx-auto h-12 w-12 text-slate-400" />
            <h3 className="mt-3 text-sm font-semibold text-slate-800">No AWS profiles</h3>
            <p className="mt-1 text-sm text-slate-600">Get started by creating your first AWS profile.</p>
            <Button className="mt-4" onClick={() => setShowCreateForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Profile
            </Button>
          </div>
        )}
      </div>
    </div>
  );
} 