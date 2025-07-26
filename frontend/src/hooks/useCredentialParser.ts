import { useState } from 'react';
import { CreateAWSProfileRequest } from '@/types/aws';

export function useCredentialParser() {
  const [credentialText, setCredentialText] = useState('');

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

  const reset = () => {
    setCredentialText('');
  };

  return {
    credentialText,
    setCredentialText,
    parseCredentials,
    reset
  };
} 