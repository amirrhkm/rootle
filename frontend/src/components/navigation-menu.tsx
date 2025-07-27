'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  Database, 
  Settings, 
  Menu, 
  X,
  Cloud,
  Search,
  History,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

export default function NavigationMenu() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Auto-expand cloud services submenu if on any cloud services page
  const [isCloudExpanded, setIsCloudExpanded] = useState(pathname.startsWith('/cloud-services'));

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(path);
  };

  const toggleCloudServices = () => {
    setIsCloudExpanded(!isCloudExpanded);
  };

  return (
    <nav className={`bg-white/90 backdrop-blur-sm border-r border-teal-100/50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    } flex flex-col`}>
      {/* Header */}
      <div className="p-4 border-b border-teal-100/50">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-teal-600 to-teal-700 bg-clip-text text-transparent">
              Rootle
            </h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-teal-50 transition-colors"
          >
            {isCollapsed ? (
              <Menu className="w-5 h-5 text-teal-600" />
            ) : (
              <X className="w-5 h-5 text-teal-600" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 p-4 space-y-2">
        {/* Dashboard */}
        <Link href="/">
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/') && pathname === '/'
              ? 'bg-teal-100 text-teal-700 border border-teal-200'
              : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
          }`}>
            <Home className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Dashboard</span>}
          </div>
        </Link>

        {/* AWS Profiles */}
        <Link href="/aws-profiles">
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/aws-profiles')
              ? 'bg-teal-100 text-teal-700 border border-teal-200'
              : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
          }`}>
            <Database className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">AWS Profiles</span>}
          </div>
        </Link>

        {/* Cloud Services Section */}
        <div>
          <button
            onClick={toggleCloudServices}
            className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              isActive('/cloud-services')
                ? 'bg-teal-100 text-teal-700 border border-teal-200'
                : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
            }`}
          >
            <Cloud className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && (
              <>
                <span className="font-medium flex-1 text-left">Tools</span>
                {isCloudExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </>
            )}
          </button>

          {/* Cloud Services Submenu */}
          {!isCollapsed && isCloudExpanded && (
            <div className="mt-2 ml-4 space-y-1">
              <Link href="/cloud-services">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                  pathname === '/cloud-services'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                }`}>
                  <span>Overview</span>
                </div>
              </Link>

              <Link href="/cloud-services/gsap-eod">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                  pathname === '/cloud-services/gsap-eod'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                }`}>
                  <span>GSAP/RSTS-EOD</span>
                </div>
              </Link>

              <Link href="/cloud-services/gsap-monthly">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                  pathname === '/cloud-services/gsap-monthly'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                }`}>
                  <span>GSAP Monthly</span>
                </div>
              </Link>

              <Link href="/cloud-services/outputs">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                  pathname === '/cloud-services/outputs'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                }`}>
                  <span>Monitor Outputs</span>
                </div>
              </Link>

              <Link href="/cloud-services/history">
                <div className={`flex items-center space-x-3 p-2 rounded-lg transition-colors text-sm ${
                  pathname === '/cloud-services/history'
                    ? 'bg-teal-50 text-teal-600'
                    : 'text-slate-500 hover:bg-teal-50 hover:text-teal-600'
                }`}>
                  <span>Upload History</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Settings */}
        <Link href="/settings">
          <div className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
            isActive('/settings')
              ? 'bg-teal-100 text-teal-700 border border-teal-200'
              : 'text-slate-600 hover:bg-teal-50 hover:text-teal-600'
          }`}>
            <Settings className="w-5 h-5 flex-shrink-0" />
            {!isCollapsed && <span className="font-medium">Settings</span>}
          </div>
        </Link>
      </div>
    </nav>
  );
} 