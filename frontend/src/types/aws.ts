export interface AWSProfile {
  id: string;
  name: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
  isActive: boolean;
  isValid?: boolean;
  lastValidated?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AWSCredentialValidation {
  isValid: boolean;
  accountId?: string;
  username?: string;
  arn?: string;
  error?: string;
  checkedAt: Date;
}

export interface CreateAWSProfileRequest {
  name: string;
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  sessionToken?: string;
}

export interface UpdateAWSProfileRequest {
  id: string;
  name?: string;
  accessKeyId?: string;
  secretAccessKey?: string;
  region?: string;
  sessionToken?: string;
}

export interface AWSProfileContextType {
  profiles: AWSProfile[];
  activeProfile: AWSProfile | null;
  loading: boolean;
  error: string | null;
  createProfile: (profile: CreateAWSProfileRequest) => Promise<void>;
  updateProfile: (profile: UpdateAWSProfileRequest) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setActiveProfile: (id: string) => Promise<void>;
  validateProfile: (id: string) => Promise<AWSCredentialValidation>;
  refreshProfiles: () => Promise<void>;
}

export const AWS_REGIONS = [
  { value: 'us-east-1', label: 'US East (N. Virginia)' },
  { value: 'us-east-2', label: 'US East (Ohio)' },
  { value: 'us-west-1', label: 'US West (N. California)' },
  { value: 'us-west-2', label: 'US West (Oregon)' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)' },
  { value: 'ap-northeast-1', label: 'Asia Pacific (Tokyo)' },
  { value: 'ap-northeast-2', label: 'Asia Pacific (Seoul)' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)' },
  { value: 'ap-southeast-2', label: 'Asia Pacific (Sydney)' },
  { value: 'ca-central-1', label: 'Canada (Central)' },
  { value: 'eu-central-1', label: 'Europe (Frankfurt)' },
  { value: 'eu-west-1', label: 'Europe (Ireland)' },
  { value: 'eu-west-2', label: 'Europe (London)' },
  { value: 'eu-west-3', label: 'Europe (Paris)' },
  { value: 'eu-north-1', label: 'Europe (Stockholm)' },
  { value: 'sa-east-1', label: 'South America (São Paulo)' },
] as const; 