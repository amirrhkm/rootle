import { Button } from "@/components/ui/button"
import { 
  Database,
  Calendar,
  Upload
} from 'lucide-react';
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">
          Cloud Service Dashboard
        </h1>
        <p className="text-slate-600 mt-2">Manage and trigger cloud services via S3 file uploads</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GSAP/RSTS-EOD Service */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Database className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">GSAP/RSTS-EOD</h3>
              <p className="text-sm text-slate-600">End of Day & POS Sales processing</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Generate EODSales or POSSales trigger files for single sites, date ranges, or bulk operations.
          </p>
          <div className="flex space-x-2">
            <Link href="/cloud-services/gsap-eod" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">
                <Upload className="mr-2 w-4 h-4" />
                Generate Files
              </Button>
            </Link>
          </div>
        </div>

        {/* GSAP Monthly Service */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <Calendar className="text-white w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800">GSAP Monthly</h3>
              <p className="text-sm text-slate-600">Fuel Month End Dips processing</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Generate monthly fuel dip reports for specific sites and time periods.
          </p>
          <div className="flex space-x-2">
            <Link href="/cloud-services/gsap-monthly" className="flex-1">
              <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700">
                <Upload className="mr-2 w-4 h-4" />
                Generate Files
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
        <h3 className="text-xl font-semibold text-slate-800 mb-4">Quick Access</h3>
        <div className="grid grid-cols-2 gap-4">
          <Link href="/cloud-services">
            <div className="p-4 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg text-white hover:from-purple-600 hover:to-purple-700 transition-all">
              <h4 className="font-medium">All Services</h4>
              <p className="text-sm text-purple-100">Configure triggers</p>
            </div>
          </Link>
          <Link href="/aws-profiles">
            <div className="p-4 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg text-white hover:from-teal-600 hover:to-teal-700 transition-all">
              <h4 className="font-medium">AWS Profiles</h4>
              <p className="text-sm text-teal-100">Manage credentials</p>
            </div>
          </Link>
          <Link href="/cloud-services/outputs">
            <div className="p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg text-white hover:from-indigo-600 hover:to-indigo-700 transition-all">
              <h4 className="font-medium">Monitor Outputs</h4>
              <p className="text-sm text-indigo-100">View generated files</p>
            </div>
          </Link>
          <Link href="/cloud-services/history">
            <div className="p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg text-white hover:from-amber-600 hover:to-amber-700 transition-all">
              <h4 className="font-medium">Upload History</h4>
              <p className="text-sm text-amber-100">Track uploads</p>
            </div>
          </Link>
        </div>
      </div>

      {/* Service Status Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Service Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">0</div>
            <div className="text-sm text-slate-600">Active Triggers</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">0</div>
            <div className="text-sm text-slate-600">Pending Outputs</div>
          </div>
          <div className="text-center p-4 bg-slate-50 rounded-lg">
            <div className="text-2xl font-bold text-slate-700">0</div>
            <div className="text-sm text-slate-600">Completed Today</div>
          </div>
        </div>
      </div>
    </div>
  );
}
