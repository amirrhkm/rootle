'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  AWSProfile, 
  AWSProfileContextType, 
  CreateAWSProfileRequest, 
  UpdateAWSProfileRequest,
  AWSCredentialValidation 
} from '@/types/aws';

const AWSProfileContext = createContext<AWSProfileContextType | undefined>(undefined);

export function useAWSProfiles() {
  const context = useContext(AWSProfileContext);
  if (context === undefined) {
    throw new Error('useAWSProfiles must be used within an AWSProfileProvider');
  }
  return context;
}

interface AWSProfileProviderProps {
  children: React.ReactNode;
}

export function AWSProfileProvider({ children }: AWSProfileProviderProps) {
  const [profiles, setProfiles] = useState<AWSProfile[]>([]);
  const [activeProfile, setActiveProfileState] = useState<AWSProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

  // Load profiles from localStorage on mount
  useEffect(() => {
    loadProfilesFromStorage();
  }, []);

  const loadProfilesFromStorage = () => {
    try {
      const storedProfiles = localStorage.getItem('aws-profiles');
      const storedActiveProfileId = localStorage.getItem('aws-active-profile-id');
      
      if (storedProfiles) {
        const parsedProfiles: AWSProfile[] = JSON.parse(storedProfiles);
        setProfiles(parsedProfiles);
        
        if (storedActiveProfileId) {
          const activeProf = parsedProfiles.find(p => p.id === storedActiveProfileId);
          setActiveProfileState(activeProf || null);
        }
      }
    } catch (err) {
      console.error('Error loading profiles from storage:', err);
      setError('Failed to load saved profiles');
    }
  };

  const saveProfilesToStorage = (newProfiles: AWSProfile[]) => {
    try {
      localStorage.setItem('aws-profiles', JSON.stringify(newProfiles));
    } catch (err) {
      console.error('Error saving profiles to storage:', err);
    }
  };

  const createProfile = async (profileData: CreateAWSProfileRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const newProfile: AWSProfile = {
        id: crypto.randomUUID(),
        ...profileData,
        isActive: profiles.length === 0, // First profile becomes active
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const updatedProfiles = [...profiles, newProfile];
      
      // If this is the first profile, make it active
      if (profiles.length === 0) {
        setActiveProfileState(newProfile);
        localStorage.setItem('aws-active-profile-id', newProfile.id);
      }

      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);
    } catch (err) {
      setError('Failed to create profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData: UpdateAWSProfileRequest): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const updatedProfiles = profiles.map(profile => 
        profile.id === profileData.id 
          ? { ...profile, ...profileData, updatedAt: new Date() }
          : profile
      );

      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);

      // Update active profile if it was the one being updated
      if (activeProfile && activeProfile.id === profileData.id) {
        const updatedActiveProfile = updatedProfiles.find(p => p.id === profileData.id);
        setActiveProfileState(updatedActiveProfile || null);
      }
    } catch (err) {
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteProfile = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const updatedProfiles = profiles.filter(profile => profile.id !== id);
      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);

      // If the deleted profile was active, set a new active profile
      if (activeProfile && activeProfile.id === id) {
        const newActiveProfile = updatedProfiles.length > 0 ? updatedProfiles[0] : null;
        setActiveProfileState(newActiveProfile);
        
        if (newActiveProfile) {
          localStorage.setItem('aws-active-profile-id', newActiveProfile.id);
        } else {
          localStorage.removeItem('aws-active-profile-id');
        }
      }
    } catch (err) {
      setError('Failed to delete profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setActiveProfile = async (id: string): Promise<void> => {
    try {
      const profile = profiles.find(p => p.id === id);
      if (!profile) {
        throw new Error('Profile not found');
      }

      setActiveProfileState(profile);
      localStorage.setItem('aws-active-profile-id', id);
    } catch (err) {
      setError('Failed to set active profile');
      throw err;
    }
  };

  const validateProfile = async (id: string): Promise<AWSCredentialValidation> => {
    try {
      setLoading(true);
      setError(null);

      const profile = profiles.find(p => p.id === id);
      if (!profile) {
        throw new Error('Profile not found');
      }

      const response = await fetch(`${API_BASE_URL}/aws/validate-credentials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessKeyId: profile.accessKeyId,
          secretAccessKey: profile.secretAccessKey,
          region: profile.region,
          sessionToken: profile.sessionToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to validate credentials');
      }

      const validation: AWSCredentialValidation = await response.json();

      // Update profile with validation result
      const updatedProfiles = profiles.map(p => 
        p.id === id 
          ? { ...p, isValid: validation.isValid, lastValidated: validation.checkedAt }
          : p
      );

      setProfiles(updatedProfiles);
      saveProfilesToStorage(updatedProfiles);

      // Update active profile if it was validated
      if (activeProfile && activeProfile.id === id) {
        setActiveProfileState({ ...activeProfile, isValid: validation.isValid, lastValidated: validation.checkedAt });
      }

      return validation;
    } catch (err) {
      setError('Failed to validate profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const refreshProfiles = async (): Promise<void> => {
    loadProfilesFromStorage();
  };

  const value: AWSProfileContextType = {
    profiles,
    activeProfile,
    loading,
    error,
    createProfile,
    updateProfile,
    deleteProfile,
    setActiveProfile,
    validateProfile,
    refreshProfiles,
  };

  return (
    <AWSProfileContext.Provider value={value}>
      {children}
    </AWSProfileContext.Provider>
  );
} 