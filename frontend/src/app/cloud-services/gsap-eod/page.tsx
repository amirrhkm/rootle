'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Upload,
  FileText,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useAWSProfiles } from '@/contexts/AWSProfileContext';
import { cloudServiceAPI, GSAPEODRequest, FileUploadResponse } from '@/lib/cloudServiceApi';

type GenerationType = 'single' | 'range' | 'bulk';
type ServiceType = 'EODSales' | 'POSSales';

type UploadResult = FileUploadResponse | { success: false; error: string };

export default function GSAPEODPage() {
  const { activeProfile } = useAWSProfiles();
  const [generationType, setGenerationType] = useState<GenerationType>('single');
  const [serviceType, setServiceType] = useState<ServiceType>('EODSales');
  const [siteId, setSiteId] = useState('');
  const [date, setDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [bulkSites, setBulkSites] = useState('');
  const [sftpUser, setSftpUser] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const generateFileName = () => {
    const today = new Date().toISOString().split('T')[0].replace(/-/g, '');
    
    switch (generationType) {
      case 'single':
        return `Generate_${serviceType}_${siteId}_${date || today}.txt`;
      case 'range':
        return `Generate_${serviceType}_${siteId}_${startDate || today}-${endDate || today}.txt`;
      case 'bulk':
        return `Generate_${serviceType}_BULK_${date || today}.txt`;
      default:
        return '';
    }
  };

  const getS3Path = () => {
    return `s3://${bucketName || 'bucket-name'}/${sftpUser || 'sftp-user'}/Import/EODSales/`;
  };

  const handleGenerateAndUpload = async () => {
    if (!activeProfile) {
      setUploadResult({
        success: false,
        error: 'No active AWS profile selected. Please configure an AWS profile first.'
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    try {
      const request: GSAPEODRequest = {
        serviceType,
        generationType,
        sftpUser,
        bucketName,
        ...(generationType === 'single' && { siteId, date }),
        ...(generationType === 'range' && { siteId, startDate, endDate }),
        ...(generationType === 'bulk' && { 
          date, 
          bulkSites: bulkSites.split('\n').filter(site => site.trim()) 
        }),
      };

      const credentials = {
        accessKeyId: activeProfile.accessKeyId,
        secretAccessKey: activeProfile.secretAccessKey,
        region: activeProfile.region,
        ...(activeProfile.sessionToken && { sessionToken: activeProfile.sessionToken })
      };

      const result = await cloudServiceAPI.generateGSAPEODFile(request, credentials);
      setUploadResult(result);

      // Store upload history in localStorage
      if (result.success) {
        const historyItem = {
          id: Date.now().toString(),
          fileName: result.fileName,
          serviceType: serviceType as 'GSAP-EOD',
          s3Path: result.s3Path,
          uploadedAt: result.uploadedAt,
          success: true,
          bucketName,
          sftpUser,
          generationType,
          ...(siteId && { siteId })
        };

        const existingHistory = JSON.parse(localStorage.getItem('cloudServiceUploadHistory') || '[]');
        existingHistory.unshift(historyItem);
        localStorage.setItem('cloudServiceUploadHistory', JSON.stringify(existingHistory.slice(0, 100))); // Keep last 100 items
      }
    } catch (error: unknown) {
      const errorResult = {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to generate and upload file'
      } as const;
      setUploadResult(errorResult);

      // Store failed upload history
      const historyItem = {
        id: Date.now().toString(),
        fileName: generateFileName(),
        serviceType: serviceType,
        s3Path: getS3Path() + generateFileName(),
        uploadedAt: new Date().toISOString(),
        success: false,
        error: errorResult.error,
        bucketName,
        sftpUser,
        generationType,
        ...(siteId && { siteId })
      };

      const existingHistory = JSON.parse(localStorage.getItem('cloudServiceUploadHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('cloudServiceUploadHistory', JSON.stringify(existingHistory.slice(0, 100)));
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = () => {
    if (!sftpUser || !bucketName) return false;
    
    switch (generationType) {
      case 'single':
        return !!(siteId && date);
      case 'range':
        return !!(siteId && startDate && endDate);
      case 'bulk':
        return !!(date && bulkSites.trim());
      default:
        return false;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/cloud-services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Database className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
              GSAP/RSTS-EOD Service
            </h1>
            <p className="text-slate-600">Configure and trigger End of Day & POS Sales processing</p>
          </div>
        </div>
      </div>

      {/* Active Profile Warning */}
      {!activeProfile && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <p className="text-amber-800">
              No active AWS profile selected. Please go to{' '}
              <Link href="/aws-profiles" className="underline font-medium">AWS Profiles</Link>{' '}
              and set an active profile to use this service.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Configuration Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* S3 Configuration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <Settings className="w-5 h-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-slate-800">S3 Configuration</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={bucketName}
                  onChange={(e) => setBucketName(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="my-s3-bucket"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SFTP User
                </label>
                <input
                  type="text"
                  value={sftpUser}
                  onChange={(e) => setSftpUser(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="username"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Upload Path:</strong> {getS3Path()}
              </p>
            </div>
          </div>

          {/* Service Type Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Service Type</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setServiceType('EODSales')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  serviceType === 'EODSales'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-center">
                  <FileText className={`w-8 h-8 mx-auto mb-2 ${
                    serviceType === 'EODSales' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  <div className="font-medium">EOD Sales</div>
                  <div className="text-sm text-slate-600">End of Day Sales Data</div>
                </div>
              </button>
              <button
                onClick={() => setServiceType('POSSales')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  serviceType === 'POSSales'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-center">
                  <Database className={`w-8 h-8 mx-auto mb-2 ${
                    serviceType === 'POSSales' ? 'text-blue-500' : 'text-slate-400'
                  }`} />
                  <div className="font-medium">POS Sales</div>
                  <div className="text-sm text-slate-600">Point of Sale Data</div>
                </div>
              </button>
            </div>
          </div>

          {/* Generation Type Selection */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Generation Type</h3>
            <div className="space-y-4">
              {/* Single Date */}
              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                generationType === 'single'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`} onClick={() => setGenerationType('single')}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={generationType === 'single'}
                    onChange={() => setGenerationType('single')}
                    className="text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Single Date</div>
                    <div className="text-sm text-slate-600">Generate for a specific site and date</div>
                  </div>
                </div>
                {generationType === 'single' && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Site ID
                      </label>
                      <input
                        type="text"
                        value={siteId}
                        onChange={(e) => setSiteId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0084"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Business Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value.replace(/-/g, ''))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Date Range */}
              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                generationType === 'range'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`} onClick={() => setGenerationType('range')}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={generationType === 'range'}
                    onChange={() => setGenerationType('range')}
                    className="text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Date Range</div>
                    <div className="text-sm text-slate-600">Generate for a specific site and date range</div>
                  </div>
                </div>
                {generationType === 'range' && (
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Site ID
                      </label>
                      <input
                        type="text"
                        value={siteId}
                        onChange={(e) => setSiteId(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0084"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value.replace(/-/g, ''))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        End Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value.replace(/-/g, ''))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Bulk Operation */}
              <div className={`p-4 rounded-lg border-2 transition-all cursor-pointer ${
                generationType === 'bulk'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`} onClick={() => setGenerationType('bulk')}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    checked={generationType === 'bulk'}
                    onChange={() => setGenerationType('bulk')}
                    className="text-blue-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium">Bulk Operation</div>
                    <div className="text-sm text-slate-600">Generate for multiple sites on a specific date</div>
                  </div>
                </div>
                {generationType === 'bulk' && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Business Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value.replace(/-/g, ''))}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">
                        Site IDs (one per line)
                      </label>
                      <textarea
                        value={bulkSites}
                        onChange={(e) => setBulkSites(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0028&#10;0084&#10;0091"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Preview and Actions */}
        <div className="space-y-6">
          {/* File Preview */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50 sticky top-8">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">File Preview</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Generated Filename:
                </label>
                <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 break-all">
                  {generateFileName() || 'Configure parameters above'}
                </div>
              </div>
              
              {generationType === 'bulk' && bulkSites && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    File Content:
                  </label>
                  <div className="p-3 bg-slate-50 rounded-lg font-mono text-sm text-slate-700 max-h-32 overflow-y-auto">
                    {bulkSites || 'Add site IDs above'}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Destination:
                </label>
                <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800 break-all">
                  {getS3Path()}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                onClick={handleGenerateAndUpload}
                disabled={!isFormValid() || isUploading || !activeProfile}
              >
                <Upload className="mr-2 w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Generate & Upload File'}
              </Button>
            </div>

            {/* Upload Result */}
            {uploadResult && (
              <div className={`mt-4 p-4 rounded-lg ${
                uploadResult.success 
                  ? 'bg-emerald-50 border border-emerald-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center space-x-2 mb-2">
                  {uploadResult.success ? (
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                  <span className={`font-medium ${
                    uploadResult.success ? 'text-emerald-800' : 'text-red-800'
                  }`}>
                    {uploadResult.success ? 'Upload Successful' : 'Upload Failed'}
                  </span>
                </div>
                {uploadResult.success ? (
                  <div className="text-sm text-emerald-700">
                    <p><strong>File:</strong> {uploadResult.fileName}</p>
                    <p><strong>Uploaded to:</strong> {uploadResult.s3Path}</p>
                    <p><strong>Time:</strong> {new Date(uploadResult.uploadedAt).toLocaleString()}</p>
                  </div>
                ) : (
                  <p className="text-sm text-red-700">{uploadResult.error}</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 