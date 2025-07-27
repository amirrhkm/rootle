'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  Search,
  Calendar,
  Database,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Eye,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  X,
  Copy,
  Download
} from 'lucide-react';
import Link from 'next/link';
import { useAWSProfiles } from '@/contexts/AWSProfileContext';
import { cloudServiceAPI, OutputFileMatch } from '@/lib/cloudServiceApi';

interface FileInfo {
  key: string;
  lastModified: Date;
  size: number;
  etag: string;
}

interface MonitoringConfig {
  serviceType: 'GSAP-EOD' | 'GSAP-Monthly';
  bucketName: string;
  sftpUser: string;
  triggerFileName: string;
}

type SortOrder = 'none' | 'asc' | 'desc';

export default function OutputMonitorPage() {
  const { activeProfile } = useAWSProfiles();
  const [config, setConfig] = useState<MonitoringConfig>({
    serviceType: 'GSAP-EOD',
    bucketName: '',
    sftpUser: '',
    triggerFileName: ''
  });
  const [outputMatch, setOutputMatch] = useState<OutputFileMatch | null>(null);
  const [allFiles, setAllFiles] = useState<FileInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>('none');
  const [showModal, setShowModal] = useState(false);

  // Close modal when clicking escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!showModal) return;
      
      // Handle keyboard scrolling when modal is open
      const scrollContainer = document.querySelector('.modal-content-scroll');
      if (scrollContainer && (event.key === 'ArrowUp' || event.key === 'ArrowDown' || event.key === 'PageUp' || event.key === 'PageDown')) {
        event.preventDefault();
        const scrollAmount = event.key.includes('Page') ? 300 : 50;
        const direction = event.key === 'ArrowUp' || event.key === 'PageUp' ? -1 : 1;
        scrollContainer.scrollBy(0, scrollAmount * direction);
      }
    };

    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [showModal]);

  const monitorOutputFiles = async () => {
    if (!activeProfile || !config.bucketName || !config.sftpUser || !config.triggerFileName) {
      return;
    }

    setIsLoading(true);
    try {
      const credentials = {
        accessKeyId: activeProfile.accessKeyId,
        secretAccessKey: activeProfile.secretAccessKey,
        region: activeProfile.region,
        ...(activeProfile.sessionToken && { sessionToken: activeProfile.sessionToken })
      };

      const result = await cloudServiceAPI.monitorOutputFiles(
        config.serviceType,
        config.bucketName,
        config.sftpUser,
        config.triggerFileName,
        credentials
      );
      
      setOutputMatch(result);
    } catch (error: unknown) {
      console.error('Error monitoring output files:', error);
      setOutputMatch({
        triggerFileName: config.triggerFileName,
        outputFiles: [],
        serviceType: config.serviceType,
        generatedAt: undefined
      });
    } finally {
      setIsLoading(false);
    }
  };

  const listAllOutputFiles = async () => {
    if (!activeProfile || !config.bucketName || !config.sftpUser) {
      return;
    }

    setIsLoading(true);
    try {
      const credentials = {
        accessKeyId: activeProfile.accessKeyId,
        secretAccessKey: activeProfile.secretAccessKey,
        region: activeProfile.region,
        ...(activeProfile.sessionToken && { sessionToken: activeProfile.sessionToken })
      };

      const exportPath = config.serviceType === 'GSAP-EOD' 
        ? `${config.sftpUser}/Export/EODSales`
        : `${config.sftpUser}/Export/FuelMonthEndDips`;

      const result = await cloudServiceAPI.listOutputFiles(
        config.bucketName,
        exportPath,
        credentials
      );
      
      setAllFiles(result.files);
    } catch (error: unknown) {
      console.error('Error listing output files:', error);
      setAllFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const viewFileContent = async (filePath: string) => {
    if (!activeProfile || !config.bucketName) {
      return;
    }

    setIsLoadingContent(true);
    setSelectedFile(filePath);
    setShowModal(true);
    setFileContent(null); // Clear previous content
    
    try {
      const credentials = {
        accessKeyId: activeProfile.accessKeyId,
        secretAccessKey: activeProfile.secretAccessKey,
        region: activeProfile.region,
        ...(activeProfile.sessionToken && { sessionToken: activeProfile.sessionToken })
      };

      const result = await cloudServiceAPI.getFileContent(
        config.bucketName,
        filePath,
        credentials
      );
      
      setFileContent(result.content);
    } catch (error: unknown) {
      console.error('Error getting file content:', error);
      setFileContent(`Error loading file content: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoadingContent(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getServiceIcon = (serviceType: string) => {
    return serviceType === 'GSAP-EOD' ? Database : Calendar;
  };

  const getServiceColor = (serviceType: string) => {
    return serviceType === 'GSAP-EOD' ? 'blue' : 'emerald';
  };

  const handleSort = () => {
    const newSortOrder: SortOrder = sortOrder === 'none' ? 'desc' : sortOrder === 'desc' ? 'asc' : 'none';
    setSortOrder(newSortOrder);
  };

  const getSortedFiles = (files: FileInfo[]): FileInfo[] => {
    if (sortOrder === 'none') {
      return files;
    }
    
    return [...files].sort((a, b) => {
      const dateA = new Date(a.lastModified).getTime();
      const dateB = new Date(b.lastModified).getTime();
      
      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else {
        return dateB - dateA;
      }
    });
  };

  const getSortIcon = () => {
    switch (sortOrder) {
      case 'asc':
        return <ArrowUp className="w-4 h-4" />;
      case 'desc':
        return <ArrowDown className="w-4 h-4" />;
      default:
        return <ArrowUpDown className="w-4 h-4" />;
    }
  };

  const getSortLabel = () => {
    switch (sortOrder) {
      case 'asc':
        return 'Oldest First';
      case 'desc':
        return 'Newest First';
      default:
        return 'Sort by Date';
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedFile(null);
    setFileContent(null);
    setIsLoadingContent(false);
  };

  const copyToClipboard = async () => {
    if (fileContent) {
      try {
        await navigator.clipboard.writeText(fileContent);
        // You could add a toast notification here
      } catch (error) {
        console.error('Failed to copy content:', error);
      }
    }
  };

  const downloadFile = () => {
    if (fileContent && selectedFile) {
      const fileName = selectedFile.split('/').pop() || 'file.txt';
      const blob = new Blob([fileContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <Search className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Monitor Output Files
            </h1>
            <p className="text-slate-600">View and manage generated output files from cloud services</p>
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
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
            <h3 className="text-lg font-semibold text-slate-800 mb-4">Monitoring Configuration</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Service Type
                </label>
                <select
                  value={config.serviceType}
                  onChange={(e) => setConfig(prev => ({ ...prev, serviceType: e.target.value as 'GSAP-EOD' | 'GSAP-Monthly' }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="GSAP-EOD">GSAP/RSTS-EOD</option>
                  <option value="GSAP-Monthly">GSAP Monthly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Bucket Name
                </label>
                <input
                  type="text"
                  value={config.bucketName}
                  onChange={(e) => setConfig(prev => ({ ...prev, bucketName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="biztalk-bucket"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  SFTP User
                </label>
                <input
                  type="text"
                  value={config.sftpUser}
                  onChange={(e) => setConfig(prev => ({ ...prev, sftpUser: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="username"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Trigger File Name (Optional)
                </label>
                <input
                  type="text"
                  value={config.triggerFileName}
                  onChange={(e) => setConfig(prev => ({ ...prev, triggerFileName: e.target.value }))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="Generate_EODSales_0084_20250121.txt"
                />
                <p className="text-xs text-slate-500 mt-1">
                  Leave empty to view all files in the export directory
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Button 
                onClick={config.triggerFileName ? monitorOutputFiles : listAllOutputFiles}
                disabled={!config.bucketName || !config.sftpUser || isLoading || !activeProfile}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700"
              >
                <RefreshCw className={`mr-2 w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Loading...' : config.triggerFileName ? 'Monitor Outputs' : 'List All Files'}
              </Button>
            </div>

            <div className="mt-4 p-3 bg-emerald-50 rounded-lg">
              <p className="text-sm text-emerald-800">
                <strong>Export Path:</strong> s3://{config.bucketName || 'bucket-name'}/{config.sftpUser || 'sftp-user'}/Export/{config.serviceType === 'GSAP-EOD' ? 'EODSales' : 'FuelMonthEndDips'}/
              </p>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trigger Match Results */}
          {config.triggerFileName && outputMatch && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  {React.createElement(getServiceIcon(config.serviceType), { 
                    className: `w-5 h-5 text-${getServiceColor(config.serviceType)}-500` 
                  })}
                  <h3 className="text-lg font-semibold text-slate-800">
                    Trigger Match Results
                  </h3>
                </div>
                
                {outputMatch.outputFiles.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSort}
                    className="flex items-center space-x-2"
                  >
                    {getSortIcon()}
                    <span>{getSortLabel()}</span>
                  </Button>
                )}
              </div>

              <div className="mb-4 p-3 bg-slate-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong>Trigger File:</strong> {outputMatch.triggerFileName}
                </p>
                <p className="text-sm text-slate-700">
                  <strong>Service Type:</strong> {outputMatch.serviceType}
                </p>
                {outputMatch.generatedAt && (
                  <p className="text-sm text-slate-700">
                    <strong>Generated At:</strong> {new Date(outputMatch.generatedAt).toLocaleString()}
                  </p>
                )}
              </div>

              {outputMatch.outputFiles.length > 0 ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-emerald-500" />
                    <span className="font-medium text-emerald-800">
                      {outputMatch.outputFiles.length} matching output file(s) found
                    </span>
                  </div>
                  
                  {getSortedFiles(outputMatch.outputFiles).map((file, index) => (
                    <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">{file.key.split('/').pop()}</p>
                          <p className="text-sm text-slate-600">
                            {formatFileSize(file.size)} • Modified: {new Date(file.lastModified).toLocaleString()}
                          </p>
                          <p className="text-xs text-slate-500 font-mono">{file.key}</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewFileContent(file.key)}
                          disabled={isLoadingContent}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center space-x-2 p-4 bg-amber-50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  <span className="text-amber-800">
                    No matching output files found for the specified trigger file
                  </span>
                </div>
              )}
            </div>
          )}

          {/* All Files Results */}
          {!config.triggerFileName && allFiles.length > 0 && (
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-lg font-semibold text-slate-800">
                    All Output Files ({allFiles.length})
                  </h3>
                </div>
                
                {allFiles.length > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSort}
                    className="flex items-center space-x-2"
                  >
                    {getSortIcon()}
                    <span>{getSortLabel()}</span>
                  </Button>
                )}
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {getSortedFiles(allFiles).map((file, index) => (
                  <div key={index} className="p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="font-medium text-slate-800">{file.key.split('/').pop()}</p>
                        <p className="text-sm text-slate-600">
                          {formatFileSize(file.size)} • Modified: {new Date(file.lastModified).toLocaleString()}
                        </p>
                        <p className="text-xs text-slate-500 font-mono">{file.key}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewFileContent(file.key)}
                        disabled={isLoadingContent}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* File Content Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-200/50 bg-white/90 backdrop-blur-sm rounded-t-xl">
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-slate-800">File Content</h3>
              </div>
              <div className="flex items-center space-x-2">
                {fileContent && !isLoadingContent && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyToClipboard}
                      className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border-slate-300/50 hover:bg-white/90"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={downloadFile}
                      className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border-slate-300/50 hover:bg-white/90"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </Button>
                  </>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={closeModal}
                  className="flex items-center space-x-1 bg-white/80 backdrop-blur-sm border-slate-300/50 hover:bg-white/90"
                >
                  <X className="w-4 h-4" />
                  <span>Close</span>
                </Button>
              </div>
            </div>

            {/* File Path */}
            <div className="px-6 py-3 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200/50">
              <p className="text-sm text-slate-700 font-mono break-all">{selectedFile}</p>
            </div>

            {/* Modal Content - Enhanced Scrolling */}
            <div className="flex-1 overflow-hidden relative">
              {isLoadingContent ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" />
                  <span className="ml-3 text-slate-600">Loading file content...</span>
                </div>
              ) : fileContent !== null ? (
                <div className="h-full overflow-y-auto overflow-x-auto modal-content-scroll" style={{
                  scrollbarWidth: 'thin',
                  scrollbarColor: '#cbd5e1 #f1f5f9'
                }}>
                  <pre className="p-6 text-sm font-mono text-slate-800 whitespace-pre-wrap leading-relaxed min-h-full bg-gradient-to-br from-slate-50/50 to-white/50">
                    {fileContent}
                  </pre>
                </div>
              ) : null}
              
              {/* Scroll Indicators */}
              {fileContent && !isLoadingContent && fileContent.length > 1000 && (
                <div className="absolute top-2 right-2 bg-slate-800/80 text-white text-xs px-2 py-1 rounded-md backdrop-blur-sm">
                  Scroll to view more
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-200/50 bg-slate-50/80 backdrop-blur-sm rounded-b-xl">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <div className="flex items-center space-x-4">
                  <span>Press Esc to close</span>
                  <span>•</span>
                  <span>Scroll with mouse wheel or arrow keys</span>
                </div>
                {fileContent && !isLoadingContent && (
                  <span className="font-medium">{fileContent.length.toLocaleString()} characters</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 