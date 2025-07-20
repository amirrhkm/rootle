import { Button } from "@/components/ui/button"
import { 
  Users,
  Activity,
  FileText,
  AlertCircle
} from "lucide-react"

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Dashboard</h1>
        <p className="text-slate-600 mt-2">Welcome to Rootle Dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Users"
          value="0"
          icon={<Users className="text-teal-600" />}
          status="No users yet"
          gradientFrom="from-teal-600"
          gradientTo="to-cyan-600"
        />
        <DashboardCard
          title="Active Sessions"
          value="0"
          icon={<Activity className="text-emerald-600" />}
          status="No active sessions"
          gradientFrom="from-emerald-600"
          gradientTo="to-teal-600"
        />
        <DashboardCard
          title="Documents"
          value="0"
          icon={<FileText className="text-slate-600" />}
          status="No documents"
          gradientFrom="from-slate-600"
          gradientTo="to-teal-600"
        />
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">Recent Activity</h2>
          <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-teal-200">View All</Button>
        </div>
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-teal-400" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800">No recent activity</h3>
          <p className="mt-1 text-sm text-slate-600">Activity will appear here once you start using the system.</p>
        </div>
      </div>
    </div>
  )
}

interface DashboardCardProps {
  title: string
  value: string
  icon: React.ReactNode
  status: string
  gradientFrom: string
  gradientTo: string
}

function DashboardCard({ title, value, icon, status, gradientFrom, gradientTo }: DashboardCardProps) {
  return (
    <div className="group relative overflow-hidden bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientFrom} ${gradientTo} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}></div>
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-slate-600 text-sm font-medium">{title}</p>
          <h3 className="text-3xl font-bold mt-2 text-slate-800">{value}</h3>
          <p className="text-slate-500 text-xs mt-1">{status}</p>
        </div>
        <div className={`p-3 bg-gradient-to-br ${gradientFrom} ${gradientTo} rounded-lg shadow-lg`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
