"use client"
import type React from "react"
import { Toaster } from "@/components/ui/toaster"

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen">
      {/* Background Image - Lightened or different image might be better for a light theme */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/backgroundLogin.png')" }} // Consider a lighter background image
      >
        {/* Reduced overlay to make it brighter, or remove it entirely */}
        <div className="absolute inset-0 bg-black/20" /> 
      </div>
      
      {/* Login Form */}
      <div className="relative z-10 flex min-h-screen items-center justify-start p-8 pl-60">
        {/* Make the form background transparent */}
        <div className="w-full max-w-md rounded-lg p-8 shadow-2xl backdrop-blur-sm">
          {children}
        </div>
        <Toaster />
      </div>
    </div>
  )
} 