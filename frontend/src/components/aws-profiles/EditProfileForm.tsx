import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { UpdateAWSProfileRequest, AWS_REGIONS, AWSProfile } from '@/types/aws';
import { CredentialParserSection } from './CredentialParserSection';
import { useCredentialParser } from '@/hooks/useCredentialParser';

interface EditProfileFormProps {
  profile: AWSProfile;
  loading: boolean;
  onSubmit: (data: UpdateAWSProfileRequest) => Promise<void>;
  onCancel: () => void;
}

export function EditProfileForm({ profile, loading, onSubmit, onCancel }: EditProfileFormProps) {
  const [formData, setFormData] = useState<UpdateAWSProfileRequest>({
    id: profile.id,
    name: profile.name,
    accessKeyId: profile.accessKeyId,
    secretAccessKey: profile.secretAccessKey,
    region: profile.region,
    sessionToken: profile.sessionToken || '',
  });

  const [showParser, setShowParser] = useState(false);
  const { credentialText, setCredentialText, parseCredentials, reset } = useCredentialParser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleParseCredentials = () => {
    const parsed = parseCredentials(credentialText);
    setFormData(prev => ({
      ...prev,
      ...parsed,
      region: parsed.region || prev.region
    }));
    reset();
    setShowParser(false);
  };

  const handleCancelParse = () => {
    reset();
    setShowParser(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-slate-800">Edit Profile</h3>
        <Button type="button" variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CredentialParserSection
        title="Quick Update"
        isVisible={showParser}
        credentialText={credentialText}
        onToggle={() => setShowParser(!showParser)}
        onTextChange={setCredentialText}
        onParse={handleParseCredentials}
        onCancel={handleCancelParse}
      />

      <form onSubmit={handleSubmit} className="space-y-4">
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
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Session Token (Optional)
          </label>
          <input
            type="password"
            value={formData.sessionToken || ''}
            onChange={(e) => setFormData({...formData, sessionToken: e.target.value})}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          />
        </div>

        <div className="flex justify-end space-x-3">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
} 