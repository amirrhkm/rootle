import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { CreateAWSProfileRequest, AWS_REGIONS } from '@/types/aws';
import { CredentialParserSection } from './CredentialParserSection';
import { useCredentialParser } from '@/hooks/useCredentialParser';

interface CreateProfileFormProps {
  loading: boolean;
  onSubmit: (data: CreateAWSProfileRequest) => Promise<void>;
  onCancel: () => void;
}

export function CreateProfileForm({ loading, onSubmit, onCancel }: CreateProfileFormProps) {
  const [formData, setFormData] = useState<CreateAWSProfileRequest>({
    name: '',
    accessKeyId: '',
    secretAccessKey: '',
    region: 'us-east-1',
    sessionToken: '',
  });

  const [showParser, setShowParser] = useState(false);
  const { credentialText, setCredentialText, parseCredentials, reset } = useCredentialParser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
    setFormData({
      name: '',
      accessKeyId: '',
      secretAccessKey: '',
      region: 'us-east-1',
      sessionToken: '',
    });
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
    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-slate-800">Create New AWS Profile</h2>
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <CredentialParserSection
        title="Quick Setup"
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
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Creating...' : 'Create Profile'}
          </Button>
        </div>
      </form>
    </div>
  );
} 