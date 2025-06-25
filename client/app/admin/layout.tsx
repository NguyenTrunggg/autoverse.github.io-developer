"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminSidebar from "@/components/admin/admin-sidebar"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user)
  const isLoading = !useSelector((state: RootState) => state._persist.rehydrated)

  useEffect(() => {
    // Wait until rehydration is complete before checking auth state
    if (!isLoading) {
      if (!isAuthenticated || currentUser?.role?.id !== 1) {
        router.push("/auth/login")
      }
    }
  }, [isLoading, isAuthenticated, currentUser, router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center"><p>Loading admin section...</p></div> // Or a proper spinner component
  }

  if (!isAuthenticated || currentUser?.role?.id !== 1) {
    // Fallback to prevent rendering children if the redirect hasn't happened yet
    return null
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}
