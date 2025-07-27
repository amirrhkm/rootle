'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { 
  History,
  Upload,
  Calendar,
  Database,
  ArrowLeft,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  Search
} from 'lucide-react';
import Link from 'next/link';

interface UploadHistoryItem {
  id: string;
  fileName: string;
  serviceType: 'GSAP-EOD' | 'GSAP-Monthly';
  s3Path: string;
  uploadedAt: string;
  success: boolean;
  error?: string;
  bucketName: string;
  sftpUser: string;
  generationType?: string;
  siteId?: string;
}

export default function UploadHistoryPage() {
  const [historyItems, setHistoryItems] = useState<UploadHistoryItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<UploadHistoryItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [serviceFilter, setServiceFilter] = useState<'all' | 'GSAP-EOD' | 'GSAP-Monthly'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'success' | 'failed'>('all');

  // For now, we'll use localStorage to store upload history
  // In a real application, this would come from a backend API
  useEffect(() => {
    loadUploadHistory();
  }, []);

  const filterHistory = useCallback(() => {
    let filtered = historyItems;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.bucketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.sftpUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.siteId && item.siteId.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by service type
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(item => item.serviceType === serviceFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(item => 
        statusFilter === 'success' ? item.success : !item.success
      );
    }

    setFilteredItems(filtered);
  }, [historyItems, searchTerm, serviceFilter, statusFilter]);

  useEffect(() => {
    filterHistory();
  }, [filterHistory]);

  const loadUploadHistory = () => {
    try {
      const stored = localStorage.getItem('cloudServiceUploadHistory');
      if (stored) {
        const history = JSON.parse(stored);
        setHistoryItems(history.sort((a: UploadHistoryItem, b: UploadHistoryItem) => 
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
        ));
      }
    } catch (error) {
      console.error('Error loading upload history:', error);
    }
  };

  const clearHistory = () => {
    if (confirm('Are you sure you want to clear all upload history? This action cannot be undone.')) {
      localStorage.removeItem('cloudServiceUploadHistory');
      setHistoryItems([]);
      setFilteredItems([]);
    }
  };

  const getServiceIcon = (serviceType: string) => {
    return serviceType === 'GSAP-EOD' ? Database : Calendar;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <History className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">
              Upload History
            </h1>
            <p className="text-slate-600">View and manage your cloud service upload history</p>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Search
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search files, buckets, users..."
                className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Service Type
            </label>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value as typeof serviceFilter)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Services</option>
              <option value="GSAP-EOD">GSAP/RSTS-EOD</option>
              <option value="GSAP-Monthly">GSAP Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="all">All Status</option>
              <option value="success">Successful</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={clearHistory}
              disabled={historyItems.length === 0}
              className="w-full"
            >
              Clear History
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Upload className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Total Uploads</p>
              <p className="text-2xl font-bold text-slate-800">{historyItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Successful</p>
              <p className="text-2xl font-bold text-slate-800">
                {historyItems.filter(item => item.success).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">Failed</p>
              <p className="text-2xl font-bold text-slate-800">
                {historyItems.filter(item => !item.success).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Database className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-slate-600">GSAP-EOD</p>
              <p className="text-2xl font-bold text-slate-800">
                {historyItems.filter(item => item.serviceType === 'GSAP-EOD').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* History List */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg border border-teal-100/50">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-800">
              Upload History ({filteredItems.length})
            </h3>
            <Button
              variant="outline"
              size="sm"
              onClick={loadUploadHistory}
            >
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        <div className="divide-y divide-slate-200">
          {filteredItems.length > 0 ? (
            filteredItems.map((item) => (
              <div key={item.id} className="p-6 hover:bg-slate-50">
                <div className="flex items-start space-x-4">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    item.success 
                      ? 'bg-emerald-100 text-emerald-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {item.success ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      <XCircle className="w-5 h-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-md text-xs font-medium ${
                        item.serviceType === 'GSAP-EOD' 
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {React.createElement(getServiceIcon(item.serviceType), { className: 'w-3 h-3' })}
                        <span>{item.serviceType}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1 text-xs text-slate-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(item.uploadedAt).toLocaleString()}</span>
                      </div>
                    </div>

                    <p className="font-medium text-slate-800 mb-1">{item.fileName}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600">
                      <p><strong>Bucket:</strong> {item.bucketName}</p>
                      <p><strong>SFTP User:</strong> {item.sftpUser}</p>
                      {item.siteId && <p><strong>Site ID:</strong> {item.siteId}</p>}
                      {item.generationType && <p><strong>Type:</strong> {item.generationType}</p>}
                    </div>

                    <p className="text-xs text-slate-500 font-mono mt-2 break-all">
                      {item.s3Path}
                    </p>

                    {!item.success && item.error && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm text-red-800">
                          <strong>Error:</strong> {item.error}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              {historyItems.length === 0 ? (
                <div>
                  <History className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No upload history</h3>
                  <p className="text-slate-600 mb-4">
                    Start uploading files to see your history here.
                  </p>
                  <Link href="/cloud-services">
                    <Button>
                      Start Uploading
                    </Button>
                  </Link>
                </div>
              ) : (
                <div>
                  <Search className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-slate-800 mb-2">No matching uploads</h3>
                  <p className="text-slate-600">
                    Try adjusting your search or filter criteria.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 