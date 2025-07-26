'use client';

import { useState } from 'react';
import { useAWSProfiles } from '@/contexts/AWSProfileContext';
import { Button } from '@/components/ui/button';
import { 
  Plus, 
  Settings, 
  Check, 
  X, 
  Shield, 
  Eye, 
  EyeOff,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock,
  FileText
} from 'lucide-react';
import { CreateAWSProfileRequest, UpdateAWSProfileRequest, AWS_REGIONS } from '@/types/aws';

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
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [validatingProfile, setValidatingProfile] = useState<string | null>(null);
  const [showCredentialParser, setShowCredentialParser] = useState<Record<string, boolean>>({});
  const [credentialText, setCredentialText] = useState('');
  const [editCredentialText, setEditCredentialText] = useState('');

  const [formData, setFormData] = useState<CreateAWSProfileRequest>({
    name: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    sessionToken: '',
  });

  const [editFormData, setEditFormData] = useState<UpdateAWSProfileRequest>({
    id: '',
    name: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    sessionToken: '',
  });

  const parseCredentials = (text: string) => {
    const lines = text.split('\n');
    const credentials: Partial<CreateAWSProfileRequest> = {};

    for (const line of lines) {
      const trimmedLine = line.trim();
      
      // Parse export statements
      if (trimmedLine.startsWith('export ')) {
        const exportMatch = trimmedLine.match(/export\s+([^=]+)=(.+)/);
        if (exportMatch) {
          const [, key, value] = exportMatch;
          let cleanValue = value.trim();
          
          // Remove quotes if present
          if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
              (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
            cleanValue = cleanValue.slice(1, -1);
          }

          switch (key.trim()) {
            case 'AWS_ACCESS_KEY_ID':
              credentials.accessKeyId = cleanValue;
              break;
            case 'AWS_SECRET_ACCESS_KEY':
              credentials.secretAccessKey = cleanValue;
              break;
            case 'AWS_SESSION_TOKEN':
              credentials.sessionToken = cleanValue;
              break;
            case 'AWS_REGION':
              credentials.region = cleanValue;
              break;
            case 'AWS_DEFAULT_REGION':
              if (!credentials.region) {
                credentials.region = cleanValue;
              }
              break;
          }
        }
      }
      
      // Also handle direct key=value format (without export)
      if (trimmedLine.includes('=') && !trimmedLine.startsWith('#')) {
        const directMatch = trimmedLine.match(/([^=]+)=(.+)/);
        if (directMatch) {
          const [, key, value] = directMatch;
          let cleanValue = value.trim();
          
          // Remove quotes if present
          if ((cleanValue.startsWith('"') && cleanValue.endsWith('"')) ||
              (cleanValue.startsWith("'") && cleanValue.endsWith("'"))) {
            cleanValue = cleanValue.slice(1, -1);
          }

          const cleanKey = key.trim();
          switch (cleanKey) {
            case 'AWS_ACCESS_KEY_ID':
              credentials.accessKeyId = cleanValue;
              break;
            case 'AWS_SECRET_ACCESS_KEY':
              credentials.secretAccessKey = cleanValue;
              break;
            case 'AWS_SESSION_TOKEN':
              credentials.sessionToken = cleanValue;
              break;
            case 'AWS_REGION':
              credentials.region = cleanValue;
              break;
            case 'AWS_DEFAULT_REGION':
              if (!credentials.region) {
                credentials.region = cleanValue;
              }
              break;
          }
        }
      }
    }

    return credentials;
  };

  const handleParseCredentials = () => {
    const parsed = parseCredentials(credentialText);
    setFormData(prev => ({
      ...prev,
      ...parsed,
      region: parsed.region || prev.region // Keep existing region if not found in paste
    }));
    setCredentialText('');
    setShowCredentialParser(prev => ({ ...prev, create: false }));
  };

  const handleParseEditCredentials = () => {
    const parsed = parseCredentials(editCredentialText);
    setEditFormData(prev => ({
      ...prev,
      ...parsed,
      region: parsed.region || prev.region // Keep existing region if not found in paste
    }));
    setEditCredentialText('');
    setShowCredentialParser(prev => ({ ...prev, edit: false }));
  };

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createProfile(formData);
      setFormData({
        name: '',
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-1',
        sessionToken: '',
      });
      setShowCreateForm(false);
    } catch (err) {
      console.error('Failed to create profile:', err);
    }
  };

  const handleEditProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(editFormData);
      setEditingProfile(null);
      setEditFormData({
        id: '',
        name: '',
        accessKeyId: '',
        secretAccessKey: '',
        region: 'us-east-1',
        sessionToken: '',
      });
    } catch (err) {
      console.error('Failed to update profile:', err);
    }
  };

  const startEditingProfile = (profile: any) => {
    setEditFormData({
      id: profile.id,
      name: profile.name,
      accessKeyId: profile.accessKeyId,
      secretAccessKey: profile.secretAccessKey,
      region: profile.region,
      sessionToken: profile.sessionToken || '',
    });
    setEditingProfile(profile.id);
  };

  const cancelEditing = () => {
    setEditingProfile(null);
    setEditFormData({
      id: '',
      name: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      sessionToken: '',
    });
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

  const toggleShowSecret = (profileId: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [profileId]: !prev[profileId]
    }));
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  const getValidationStatus = (profile: any) => {
    if (validatingProfile === profile.id) {
      return <Clock className="h-4 w-4 text-yellow-500 animate-spin" />;
    }
    if (profile.isValid === true) {
      return <CheckCircle className="h-4 w-4 text-emerald-500" />;
    }
    if (profile.isValid === false) {
      return <AlertCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-slate-400" />;
  };

  return (
    <div className="space-y-8">
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
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-slate-800">Create New AWS Profile</h2>
            <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Credential Parser for Create Form */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-slate-700">Quick Setup</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowCredentialParser(prev => ({ ...prev, create: !prev.create }))}
              >
                <FileText className="h-4 w-4 mr-1" />
                {showCredentialParser.create ? 'Hide Parser' : 'Paste Credentials'}
              </Button>
            </div>
            
            {showCredentialParser.create && (
              <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                <label className="block text-sm text-slate-600">
                  Paste your AWS credentials (export format or key=value):
                </label>
                <textarea
                  value={credentialText}
                  onChange={(e) => setCredentialText(e.target.value)}
                  className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
                  placeholder={`export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."
export AWS_REGION="us-east-1"`}
                />
                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCredentialText('');
                      setShowCredentialParser(prev => ({ ...prev, create: false }));
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleParseCredentials}
                    disabled={!credentialText.trim()}
                  >
                    Parse & Fill
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          <form onSubmit={handleCreateProfile} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Profile Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  placeholder="e.g., Production, Development"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Region
                </label>
                <select
                  value={formData.region}
                  onChange={(e) => setFormData({...formData, region: e.target.value})}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {AWS_REGIONS.map((region) => (
                    <option key={region.value} value={region.value}>
                      {region.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Access Key ID
              </label>
              <input
                type="text"
                required
                value={formData.accessKeyId}
                onChange={(e) => setFormData({...formData, accessKeyId: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="AKIA..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Secret Access Key
              </label>
              <input
                type="password"
                required
                value={formData.secretAccessKey}
                onChange={(e) => setFormData({...formData, secretAccessKey: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="Enter secret access key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Session Token (Optional)
              </label>
              <input
                type="password"
                value={formData.sessionToken}
                onChange={(e) => setFormData({...formData, sessionToken: e.target.value})}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                placeholder="For temporary credentials"
              />
            </div>

            <div className="flex justify-end space-x-3">
              <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Profile'}
              </Button>
            </div>
          </form>
        </div>
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
              /* Edit Form */
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-slate-800">Edit Profile</h3>
                  <Button type="button" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Credential Parser for Edit Form */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-slate-700">Quick Update</h4>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCredentialParser(prev => ({ ...prev, edit: !prev.edit }))}
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      {showCredentialParser.edit ? 'Hide Parser' : 'Paste Credentials'}
                    </Button>
                  </div>
                  
                  {showCredentialParser.edit && (
                    <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
                      <label className="block text-sm text-slate-600">
                        Paste your AWS credentials to update:
                      </label>
                      <textarea
                        value={editCredentialText}
                        onChange={(e) => setEditCredentialText(e.target.value)}
                        className="w-full h-32 px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 font-mono text-sm"
                        placeholder={`export AWS_ACCESS_KEY_ID="AKIA..."
export AWS_SECRET_ACCESS_KEY="..."
export AWS_SESSION_TOKEN="..."
export AWS_REGION="us-east-1"`}
                      />
                      <div className="flex justify-end space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setEditCredentialText('');
                            setShowCredentialParser(prev => ({ ...prev, edit: false }));
                          }}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          onClick={handleParseEditCredentials}
                          disabled={!editCredentialText.trim()}
                        >
                          Parse & Fill
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                <form onSubmit={handleEditProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Profile Name
                      </label>
                      <input
                        type="text"
                        required
                        value={editFormData.name}
                        onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Region
                      </label>
                      <select
                        value={editFormData.region}
                        onChange={(e) => setEditFormData({...editFormData, region: e.target.value})}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                      >
                        {AWS_REGIONS.map((region) => (
                          <option key={region.value} value={region.value}>
                            {region.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Access Key ID
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.accessKeyId}
                      onChange={(e) => setEditFormData({...editFormData, accessKeyId: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Secret Access Key
                    </label>
                    <input
                      type="password"
                      required
                      value={editFormData.secretAccessKey}
                      onChange={(e) => setEditFormData({...editFormData, secretAccessKey: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Session Token (Optional)
                    </label>
                    <input
                      type="password"
                      value={editFormData.sessionToken || ''}
                      onChange={(e) => setEditFormData({...editFormData, sessionToken: e.target.value})}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button type="button" variant="outline" onClick={cancelEditing}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </form>
              </div>
            ) : (
              /* Profile Display */
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getValidationStatus(profile)}
                      <h3 className="text-lg font-semibold text-slate-800">{profile.name}</h3>
                      {activeProfile?.id === profile.id && (
                        <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleValidateProfile(profile.id)}
                      disabled={validatingProfile === profile.id}
                    >
                      <Shield className="h-4 w-4 mr-1" />
                      {validatingProfile === profile.id ? 'Validating...' : 'Validate'}
                    </Button>
                    
                    {activeProfile?.id !== profile.id && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setActiveProfile(profile.id)}
                      >
                        Set Active
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleShowSecret(profile.id)}
                    >
                      {showSecrets[profile.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditingProfile(profile)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteProfile(profile.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-500">Region:</span>
                    <span className="ml-2 text-slate-700">{profile.region}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Access Key ID:</span>
                    <span className="ml-2 text-slate-700 font-mono">
                      {showSecrets[profile.id] ? profile.accessKeyId : '****' + profile.accessKeyId.slice(-4)}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500">Secret Key:</span>
                    <span className="ml-2 text-slate-700 font-mono">
                      {showSecrets[profile.id] ? profile.secretAccessKey : '********************************'}
                    </span>
                  </div>
                  {profile.sessionToken && (
                    <div>
                      <span className="text-slate-500">Session Token:</span>
                      <span className="ml-2 text-slate-700 font-mono">
                        {showSecrets[profile.id] ? profile.sessionToken.slice(0, 20) + '...' : '********************************'}
                      </span>
                    </div>
                  )}
                </div>

                {profile.lastValidated && (
                  <div className="mt-3 text-xs text-slate-500">
                    Last validated: {formatDate(profile.lastValidated)}
                  </div>
                )}
              </>
            )}
          </div>
        ))}

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