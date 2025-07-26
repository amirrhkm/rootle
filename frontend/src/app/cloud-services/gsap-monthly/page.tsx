'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  Upload,
  Settings,
  ArrowLeft,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import Link from 'next/link';
import { useAWSProfiles } from '@/contexts/AWSProfileContext';
import { cloudServiceAPI, GSAPMonthlyRequest, FileUploadResponse } from '@/lib/cloudServiceApi';

type UploadResult = FileUploadResponse | { success: false; error: string };

export default function GSAPMonthlyPage() {
  const { activeProfile } = useAWSProfiles();
  const [siteId, setSiteId] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [sftpUser, setSftpUser] = useState('');
  const [bucketName, setBucketName] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);

  const generateFileName = () => {
    if (!siteId || !year || !month) return '';
    const paddedMonth = month.padStart(2, '0');
    return `Generate_FuelMonthEndDips_${siteId}_${year}${paddedMonth}.txt`;
  };

  const getS3Path = () => {
    return `s3://${bucketName || 'bucket-name'}/${sftpUser || 'sftp-user'}/Import/FuelMonthEndDips/`;
  };

  const getCurrentYear = () => new Date().getFullYear();
  const getCurrentMonth = () => new Date().getMonth() + 1;

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
      const request: GSAPMonthlyRequest = {
        siteId,
        year,
        month,
        sftpUser,
        bucketName
      };

      const credentials = {
        accessKeyId: activeProfile.accessKeyId,
        secretAccessKey: activeProfile.secretAccessKey,
        region: activeProfile.region,
        ...(activeProfile.sessionToken && { sessionToken: activeProfile.sessionToken })
      };

      const result = await cloudServiceAPI.generateGSAPMonthlyFile(request, credentials);
      setUploadResult(result);

      // Store upload history in localStorage
      if (result.success) {
        const historyItem = {
          id: Date.now().toString(),
          fileName: result.fileName,
          serviceType: 'GSAP-Monthly' as const,
          s3Path: result.s3Path,
          uploadedAt: result.uploadedAt,
          success: true,
          bucketName,
          sftpUser,
          generationType: 'monthly',
          siteId
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
        serviceType: 'GSAP-Monthly' as const,
        s3Path: getS3Path() + generateFileName(),
        uploadedAt: new Date().toISOString(),
        success: false,
        error: errorResult.error,
        bucketName,
        sftpUser,
        generationType: 'monthly',
        siteId
      };

      const existingHistory = JSON.parse(localStorage.getItem('cloudServiceUploadHistory') || '[]');
      existingHistory.unshift(historyItem);
      localStorage.setItem('cloudServiceUploadHistory', JSON.stringify(existingHistory.slice(0, 100)));
    } finally {
      setIsUploading(false);
    }
  };

  const isFormValid = () => {
    return !!(siteId && year && month && sftpUser && bucketName);
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
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Calendar className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              GSAP Monthly Service
            </h1>
            <p className="text-slate-600">Configure and trigger Fuel Month End Dips processing</p>
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
              <Settings className="w-5 h-5 text-emerald-500" />
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
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
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="username"
                />
              </div>
            </div>
            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Upload Path:</strong> {getS3Path()}
              </p>
            </div>
          </div>

          {/* Monthly Configuration */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <div className="flex items-center space-x-2 mb-4">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <h3 className="text-lg font-semibold text-slate-800">Monthly Report Configuration</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Site ID
                </label>
                <input
                  type="text"
                  value={siteId}
                  onChange={(e) => setSiteId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="0081"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder={getCurrentYear().toString()}
                  min="2020"
                  max="2030"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Month
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="">Select Month</option>
                  <option value="1">January</option>
                  <option value="2">February</option>
                  <option value="3">March</option>
                  <option value="4">April</option>
                  <option value="5">May</option>
                  <option value="6">June</option>
                  <option value="7">July</option>
                  <option value="8">August</option>
                  <option value="9">September</option>
                  <option value="10">October</option>
                  <option value="11">November</option>
                  <option value="12">December</option>
                </select>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-4">
              <h4 className="font-medium text-emerald-900 mb-2">About Fuel Month End Dips</h4>
              <p className="text-sm text-emerald-800 mb-2">
                This service generates monthly fuel inventory reports for the specified site and month.
              </p>
              <ul className="text-sm text-emerald-700 space-y-1">
                <li>• Reports include fuel level measurements at month end</li>
                <li>• Used for inventory reconciliation and reporting</li>
                <li>• Generated files are exported in XML format</li>
              </ul>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setYear(getCurrentYear().toString());
                  setMonth(getCurrentMonth().toString());
                }}
                className="w-full"
              >
                Current Month
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const lastMonth = getCurrentMonth() - 1;
                  const year = lastMonth === 0 ? getCurrentYear() - 1 : getCurrentYear();
                  const month = lastMonth === 0 ? 12 : lastMonth;
                  setYear(year.toString());
                  setMonth(month.toString());
                }}
                className="w-full"
              >
                Previous Month
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSiteId('');
                  setYear('');
                  setMonth('');
                }}
                className="w-full"
              >
                Clear Form
              </Button>
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

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Upload Destination:
                </label>
                <div className="p-3 bg-emerald-50 rounded-lg text-sm text-emerald-800 break-all">
                  {getS3Path()}
                </div>
              </div>

              {generateFileName() && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Expected Output:
                  </label>
                  <div className="p-3 bg-amber-50 rounded-lg text-sm text-amber-800">
                    s3://{bucketName || 'bucket-name'}/{sftpUser || 'sftp-user'}/Export/FuelMonthEndDips/
                    <br />
                    <span className="font-mono">FuelMonthEndDips_10000000_YYYYMMDD.xml</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
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

          {/* Information Panel */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">File Format</h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-1">Input File:</p>
                <p className="text-xs text-slate-600 font-mono">
                  Generate_FuelMonthEndDips_[SiteID]_[YYYYMM].txt
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <p className="text-sm font-medium text-slate-700 mb-1">Output File:</p>
                <p className="text-xs text-slate-600 font-mono">
                  FuelMonthEndDips_[ID]_[Date].xml
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 