"use client"

import type React from "react"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wallet, User, Lock, Bell, History } from "lucide-react"
import { useSelector } from "react-redux"
import { type RootState } from "@/lib/redux/store"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("info")

  const { currentUser, isAuthenticated } = useSelector(
    (state: RootState) => state.user
  )

  const [name, setName] = useState(currentUser?.name || "")
  const [email, setEmail] = useState(currentUser?.email || "")
  const [phone, setPhone] = useState(currentUser?.phone || "")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setEmail(currentUser.email || "")
      setPhone(currentUser.phone || "")
    }
  }, [currentUser])

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle info update
    console.log({ name, email, phone })
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle password update
    console.log({ currentPassword, newPassword, confirmPassword })
  }

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6 flex flex-col items-center space-y-4">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="text-center w-full space-y-2">
                  <Skeleton className="h-5 w-3/4 mx-auto" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-10 w-full p-3" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-3">
            <Card>
              <CardContent className="p-6">
                <Skeleton className="h-10 w-1/3 mb-4" />
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Thông tin cá nhân</h1>
          <p className="text-muted-foreground mt-2">Quản lý thông tin cá nhân và tài khoản của bạn</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={"/images/avtUser.png"} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="text-center">
                    <h3 className="font-medium">{currentUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                  </div>
                  <div className="flex items-center justify-center bg-muted/50 rounded-lg p-3 w-full">
                    <Wallet className="h-5 w-5 mr-2 text-primary" />
                    <span className="font-medium">Số dư: </span>
                    <span className="font-bold ml-1">{currentUser.balance || 0} Xu</span>
                  </div>
                  <Button asChild className="w-full">
                    <Link href="/user/payment">Nạp tiền</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 hidden md:block">
              <div className="space-y-2">
                <Button
                  variant={activeTab === "info" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("info")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Thông tin cá nhân
                </Button>
                <Button
                  variant={activeTab === "password" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("password")}
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Đổi mật khẩu
                </Button>
                <Button
                  variant={activeTab === "notifications" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("notifications")}
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Thông báo
                </Button>
                <Button
                  variant={activeTab === "transactions" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("transactions")}
                >
                  <History className="mr-2 h-4 w-4" />
                  Lịch sử giao dịch
                </Button>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <Card>
              <CardHeader className="md:hidden">
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="info">
                      <User className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Thông tin</span>
                    </TabsTrigger>
                    <TabsTrigger value="password">
                      <Lock className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Mật khẩu</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications">
                      <Bell className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Thông báo</span>
                    </TabsTrigger>
                    <TabsTrigger value="transactions">
                      <History className="h-4 w-4 md:mr-2" />
                      <span className="hidden md:inline">Giao dịch</span>
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </CardHeader>
              <CardContent className="p-6">
                {activeTab === "info" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Thông tin cá nhân</h2>
                    <form onSubmit={handleInfoSubmit} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="name">Họ tên</Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Số điện thoại</Label>
                        <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                      </div>
                      <Button type="submit">Cập nhật thông tin</Button>
                    </form>
                  </div>
                )}

                {activeTab === "password" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Đổi mật khẩu</h2>
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="current-password">Mật khẩu hiện tại</Label>
                        <Input
                          id="current-password"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="new-password">Mật khẩu mới</Label>
                        <Input
                          id="new-password"
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="confirm-password">Xác nhận mật khẩu mới</Label>
                        <Input
                          id="confirm-password"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                      <Button type="submit">Đổi mật khẩu</Button>
                    </form>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Cài đặt thông báo</h2>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Thông báo qua email</h3>
                          <p className="text-sm text-muted-foreground">Nhận thông báo về dịch vụ qua email</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Thông báo qua SMS</h3>
                          <p className="text-sm text-muted-foreground">Nhận thông báo về dịch vụ qua SMS</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium">Thông báo về khuyến mãi</h3>
                          <p className="text-sm text-muted-foreground">Nhận thông báo về khuyến mãi và ưu đãi</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Lịch sử giao dịch</h2>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">Nạp tiền</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(2023, 5 - i, 10 + i * 5).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">+{i * 50} Xu</p>
                            <p className="text-sm text-muted-foreground">{i * 50 * 1000}đ</p>
                          </div>
                        </div>
                      ))}
                      {[1, 2].map((i) => (
                        <div key={i + 3} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-medium">Mua gói Chatbot tự động</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(2023, 4 - i, 5 + i * 3).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-red-600">-{i * 70} Xu</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
