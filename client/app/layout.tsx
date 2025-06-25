import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { headers } from 'next/headers'
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider";
import DefaultLayout from "@/components/layout/default-layout";
import { ReduxProvider } from "../lib/redux/provider.tsx"
import { Toaster } from "@/components/ui/toaster";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Automated Services",
  description: "Providing automated AI services for businesses",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const headersList = await headers()
  const layoutType = headersList.get('x-layout-type')

  return (
    <html lang="en" suppressHydrationWarning>
          <body className={inter.className}>
            <ReduxProvider>
              <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
                {layoutType === 'default' ? (
                  <DefaultLayout>{children}</DefaultLayout>
                ) : (
                  children
                )}
                <Toaster />
              </ThemeProvider>
            </ReduxProvider>
          </body>
        </html>
  )
}
