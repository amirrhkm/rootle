'use client';

import { Button } from '@/components/ui/button';
import { 
  Database, 
  Calendar,
  ArrowRight,
  Upload,
  FileText
} from 'lucide-react';
import Link from 'next/link';

export default function CloudServicesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
          Available Services
        </h1>
        <p className="text-slate-600 mt-2">Choose available services and tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* GSAP/RSTS-EOD Service */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Database className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-800">GSAP/RSTS-EOD</h3>
              <p className="text-slate-600">End of Day & POS Sales Processing</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Generate EODSales or POSSales triggers</span>
            </div>
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Upload to s3://bucket/Import/EODSales/</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Support single date, date range, and bulk operations</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-emerald-900 mb-2">File Patterns:</h4>
            <div className="text-sm text-emerald-800 space-y-1">
              <div>• Generate_{'{Type}'}_{'{SiteID}'}_{'{Date}'}.txt</div>
              <div>• Generate_{'{Type}'}_{'{SiteID}'}_{'{StartDate}'}-{'{EndDate}'}.txt</div>
              <div>• Generate_{'{Type}'}_BULK_{'{Date}'}.txt</div>
            </div>
          </div>

          <Link href="/cloud-services/gsap-eod">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              Configure GSAP/RSTS-EOD
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>

        {/* GSAP Monthly Service */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-8 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
              <Calendar className="text-white w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-slate-800">GSAP Monthly</h3>
              <p className="text-slate-600">Fuel Month End Dips Processing</p>
            </div>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Generate monthly fuel dip reports</span>
            </div>
            <div className="flex items-center space-x-3">
              <Upload className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Upload to s3://bucket/Import/FuelMonthEndDips/</span>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="w-5 h-5 text-emerald-500" />
              <span className="text-sm text-slate-600">Monthly processing for specific sites</span>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-lg p-4 mb-6">
            <h4 className="font-medium text-emerald-900 mb-2">File Pattern:</h4>
            <div className="text-sm text-emerald-800">
              • Generate_FuelMonthEndDips_{'{SiteID}'}_{'{YYYYMM}'}.txt
            </div>
          </div>

          <Link href="/cloud-services/gsap-monthly">
            <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
              Configure GSAP Monthly
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 