import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Eye, 
  EyeOff,
  Trash2,
  Edit3,
  CheckCircle,
  AlertCircle,
  Clock
} from 'lucide-react';
import { AWSProfile } from '@/types/aws';

interface ProfileCardProps {
  profile: AWSProfile;
  isActive: boolean;
  isValidating: boolean;
  onValidate: () => void;
  onSetActive: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function ProfileCard({
  profile,
  isActive,
  isValidating,
  onValidate,
  onSetActive,
  onEdit,
  onDelete
}: ProfileCardProps) {
  const [showSecrets, setShowSecrets] = useState(false);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString() + ' ' + new Date(date).toLocaleTimeString();
  };

  const getValidationStatus = () => {
    if (isValidating) {
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
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            {getValidationStatus()}
            <h3 className="text-lg font-semibold text-slate-800">{profile.name}</h3>
            {isActive && (
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
            onClick={onValidate}
            disabled={isValidating}
          >
            <Shield className="h-4 w-4 mr-1" />
            {isValidating ? 'Validating...' : 'Validate'}
          </Button>
          
          {!isActive && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onSetActive}
            >
              Set Active
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSecrets(!showSecrets)}
          >
            {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onEdit}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
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
            {showSecrets ? profile.accessKeyId : '****' + profile.accessKeyId.slice(-4)}
          </span>
        </div>
        <div>
          <span className="text-slate-500">Secret Key:</span>
          <span className="ml-2 text-slate-700 font-mono">
            {showSecrets ? profile.secretAccessKey : '********************************'}
          </span>
        </div>
        {profile.sessionToken && (
          <div>
            <span className="text-slate-500">Session Token:</span>
            <span className="ml-2 text-slate-700 font-mono">
              {showSecrets ? profile.sessionToken.slice(0, 20) + '...' : '********************************'}
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
  );
} 