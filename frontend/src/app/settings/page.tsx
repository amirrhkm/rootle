export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-teal-700 to-emerald-700 bg-clip-text text-transparent">Settings</h1>
        <p className="text-slate-600 mt-2">Manage your application settings</p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-teal-100/50">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">General Settings</h2>
        <p className="text-slate-600">Settings will be available here in future updates.</p>
      </div>
    </div>
  )
} 