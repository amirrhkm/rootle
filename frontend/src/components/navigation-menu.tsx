'use client';

import * as React from "react"
import Link from "next/link"
import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu"
import { cn } from "@/lib/utils"
import { useAWSProfiles } from "@/contexts/AWSProfileContext"
import { 
  Home,
  Settings,
  Cloud,
  CheckCircle,
  AlertCircle
} from "lucide-react"

const NavigationMenu = () => {
  const { activeProfile } = useAWSProfiles();

  return (
    <NavigationMenuPrimitive.Root className="h-screen w-64 bg-gradient-to-br from-slate-900 via-teal-900 to-emerald-900 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Rootle</h1>
        <p className="text-teal-200 text-sm mt-1">Dashboard</p>
      </div>
      
      {/* Active Profile Indicator */}
      {activeProfile && (
        <div className="mb-6 p-3 bg-teal-800/30 rounded-lg border border-teal-700/50">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-4 w-4 text-emerald-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-teal-200">Active Profile</p>
              <p className="text-sm font-medium text-white truncate">{activeProfile.name}</p>
              <p className="text-xs text-teal-300">{activeProfile.region}</p>
            </div>
          </div>
        </div>
      )}

      {!activeProfile && (
        <div className="mb-6 p-3 bg-orange-800/30 rounded-lg border border-orange-700/50">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-400" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-orange-200">No Active Profile</p>
              <p className="text-sm text-orange-100">Configure AWS access</p>
            </div>
          </div>
        </div>
      )}
      
      <NavigationMenuPrimitive.List className="space-y-2">
        <NavigationMenuItem href="/" icon={<Home size={20} />}>
          Dashboard
        </NavigationMenuItem>
        <NavigationMenuItem href="/aws-profiles" icon={<Cloud size={20} />}>
          AWS Profiles
        </NavigationMenuItem>
        <NavigationMenuItem href="/settings" icon={<Settings size={20} />}>
          Settings
        </NavigationMenuItem>
      </NavigationMenuPrimitive.List>
    </NavigationMenuPrimitive.Root>
  )
}

interface NavigationMenuItemProps {
  href: string
  icon: React.ReactNode
  children: React.ReactNode
}

const NavigationMenuItem = ({ href, icon, children }: NavigationMenuItemProps) => {
  return (
    <NavigationMenuPrimitive.Item>
      <Link 
        href={href}
        className="flex items-center space-x-3 px-4 py-3 rounded-lg text-teal-200 hover:text-white hover:bg-teal-800/30 backdrop-blur-sm transition-all duration-200 group"
      >
        <span className="text-teal-300 group-hover:text-emerald-300 transition-colors duration-200">
          {icon}
        </span>
        <span className="font-medium">{children}</span>
      </Link>
    </NavigationMenuPrimitive.Item>
  )
}

export { NavigationMenu } 