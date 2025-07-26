import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';

interface CredentialParserSectionProps {
  title: string;
  isVisible: boolean;
  credentialText: string;
  onToggle: () => void;
  onTextChange: (text: string) => void;
  onParse: () => void;
  onCancel: () => void;
}

export function CredentialParserSection({
  title,
  isVisible,
  credentialText,
  onToggle,
  onTextChange,
  onParse,
  onCancel
}: CredentialParserSectionProps) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-slate-700">{title}</h3>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggle}
        >
          <FileText className="h-4 w-4 mr-1" />
          {isVisible ? 'Hide Parser' : 'Paste Credentials'}
        </Button>
      </div>
      
      {isVisible && (
        <div className="space-y-3 p-4 bg-slate-50 rounded-lg">
          <label className="block text-sm text-slate-600">
            Paste your AWS credentials (export format or key=value):
          </label>
          <textarea
            value={credentialText}
            onChange={(e) => onTextChange(e.target.value)}
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
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onParse}
              disabled={!credentialText.trim()}
            >
              Parse & Fill
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 