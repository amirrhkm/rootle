import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import NavigationMenu from "@/components/navigation-menu"
import { AWSProfileProvider } from "@/contexts/AWSProfileContext"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Rootle",
  description: "A modern dashboard application",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AWSProfileProvider>
          <div className="flex min-h-screen bg-gradient-to-br from-slate-100 via-teal-50 to-emerald-100">
            <NavigationMenu />
            <main className="flex-1 p-8">
              {children}
            </main>
          </div>
        </AWSProfileProvider>
      </body>
    </html>
  )
}
