"use client"

import type React from "react"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"
import { ContactIcons } from "@/components/layout/contact-icons"
import { usePathname } from "next/navigation"

export default function DefaultLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const showHeaderFooter = pathname !== "/auth/login"
  const showContactIcons = !pathname.startsWith("/admin") && pathname !== "/auth/login"

  return (
    <div className="flex flex-col min-h-screen">
      {showHeaderFooter && <Header />}
      <main className="flex-grow">{children}</main>
      {showHeaderFooter && <Footer />}
      {showContactIcons && <ContactIcons />}
    </div>
  )
} 