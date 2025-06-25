"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Users,
  Brain,
  CreditCard,
  Package,
  Tag,
  FileText,
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
  ChevronRight,
  Home,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface SidebarItem {
  title: string
  href?: string
  icon: React.ReactNode
  submenu?: { title: string; href: string }[]
  onClick?: () => void
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("userRole")
    localStorage.removeItem("userName")
    localStorage.removeItem("userEmail")
    localStorage.removeItem("userPhone")
    localStorage.removeItem("userAddress")
    router.push("/auth/login")
  }

  const sidebarItems: SidebarItem[] = [
    {
      title: "Về trang chủ",
      href: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Dashboard",
      href: "/admin",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      title: "Quản lý người dùng",
      href: "/admin/users",
      icon: <Users className="h-5 w-5" />,
      submenu: [
        { title: "Danh sách người dùng", href: "/admin/users" },
        { title: "Tài khoản chưa kích hoạt", href: "/admin/users/inactive" },
      ],
    },
    {
      title: "Quản lý AI",
      href: "/admin/ai",
      icon: <Brain className="h-5 w-5" />,
      submenu: [
        { title: "Kết nối API", href: "/admin/ai/connections" },
        { title: "Danh sách AI", href: "/admin/ai/models" },
      ],
    },
    {
      title: "Quản lý nạp tiền",
      href: "/admin/payments",
      icon: <CreditCard className="h-5 w-5" />,
      submenu: [
        { title: "Lịch sử nạp tiền", href: "/admin/payments/history" },
        { title: "Nạp tiền cho người dùng", href: "/admin/payments/add-credit" },
        { title: "Phương thức nạp tiền", href: "/admin/payments/methods" },
      ],
    },
    {
      title: "Quản lý dịch vụ",
      href: "/admin/services",
      icon: <Package className="h-5 w-5" />,
      submenu: [
        { title: "Loại dịch vụ", href: "/admin/services/types" },
        { title: "Nền tảng dịch vụ", href: "/admin/services/platforms" },

      ],
    },
    {
      title: "Quản lý khuyến mại",
      href: "/admin/promotions",
      icon: <Tag className="h-5 w-5" />,
    },
    {
      title: "Quản lý nội dung",
      href: "/admin/content",
      icon: <FileText className="h-5 w-5" />,
      submenu: [
        { title: "Tin AI", href: "/admin/content/ai-news" },
        { title: "Video AI", href: "/admin/content/ai-videos" },
        { title: "Tin khuyến mại", href: "/admin/content/promotions" },
      ],
    },
    {
      title: "Quản lý tài khoản",
      href: "/admin/accounts",
      icon: <Settings className="h-5 w-5" />,
    },
    {
      title: "Đăng xuất",
      icon: <LogOut className="h-5 w-5" />,
      onClick: handleLogout,
    },
  ]

  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>(() => {
    const initialOpenMenus: Record<string, boolean> = {}
    sidebarItems.forEach(item => {
      if (item.submenu && item.href && pathname.startsWith(item.href)) {
        initialOpenMenus[item.title] = true
      }
    })
    return initialOpenMenus
  })

  const toggleSubmenu = (title: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6">
        <h1 className="text-xl font-bold">Trang quản trị</h1>
      </div>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-2">
          {sidebarItems.map((item) => (
            <div key={item.title}>
              {item.submenu ? (
                <div>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-between text-white hover:text-white hover:bg-slate-800",
                      item.href && pathname.startsWith(item.href) && "bg-slate-800",
                    )}
                    onClick={() => toggleSubmenu(item.title)}
                  >
                    <div className="flex items-center">
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </div>
                    {openMenus[item.title] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                  {openMenus[item.title] && (
                    <div className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subitem) => (
                        <Button
                          key={subitem.href}
                          variant="ghost"
                          className={cn(
                            "w-full justify-start text-slate-300 hover:text-white hover:bg-slate-800",
                            pathname === subitem.href && "bg-slate-800 text-white",
                          )}
                          asChild
                        >
                          <Link href={subitem.href}>{subitem.title}</Link>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-white hover:text-white hover:bg-slate-800",
                    item.href && pathname === item.href && "bg-slate-800",
                  )}
                  asChild={!!item.href}
                  onClick={item.onClick}
                >
                  {item.href ? (
                    <Link href={item.href}>
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </Link>
                  ) : (
                    <>
                      {item.icon}
                      <span className="ml-3">{item.title}</span>
                    </>
                  )}
                </Button>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
