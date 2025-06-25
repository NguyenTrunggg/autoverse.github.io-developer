"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ArrowRight, Search } from "lucide-react"

// Mock user data
const users = Array.from({ length: 10 }).map((_, i) => ({
  id: i + 1,
  name: `Nguyễn Văn ${String.fromCharCode(65 + i)}`,
  email: `user${i + 1}@example.com`,
  phone: `091234567${i}`,
  balance: (i + 1) * 100,
}))

export default function AddCreditPage() {
  const searchParams = useSearchParams()
  const userId = searchParams.get("user")

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(
    userId ? users.find((c) => c.id === Number(userId)) : null,
  )
  const [amount, setAmount] = useState<number>(100000)
  const [xuAmount, setXuAmount] = useState(100)
  const [note, setNote] = useState("")
  const [showUserSearch, setShowUserSearch] = useState(!selectedUser)

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0
    setAmount(value)
    setXuAmount(Math.round(value / 1000))
  }

  const handleSelectUser = (user: any) => {
    setSelectedUser(user)
    setShowUserSearch(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Nạp tiền cho người dùng</h1>
      </div>

      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Nạp Xu cho người dùng</CardTitle>
            <CardDescription>Nạp Xu trực tiếp vào tài khoản người dùng</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {showUserSearch ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Tìm kiếm người dùng</Label>
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden">
                  <div className="grid grid-cols-3 bg-muted p-2 text-sm font-medium">
                    <div>Tên người dùng</div>
                    <div>Email</div>
                    <div>Số dư</div>
                  </div>
                  <div className="max-h-60 overflow-y-auto">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => (
                        <div
                          key={user.id}
                          className="grid grid-cols-3 p-2 text-sm border-t hover:bg-muted/50 cursor-pointer"
                          onClick={() => handleSelectUser(user)}
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={`/placeholder.svg?height=24&width=24`} alt={user.name} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span>{user.name}</span>
                          </div>
                          <div>{user.email}</div>
                          <div>{user.balance} Xu</div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-muted-foreground">Không tìm thấy người dùng</div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={`/placeholder.svg?height=40&width=40`} alt={selectedUser.name} />
                      <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{selectedUser.name}</h3>
                      <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setShowUserSearch(true)}>
                    Đổi người dùng
                  </Button>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="current-balance">Số dư hiện tại</Label>
                  <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background">
                    <span className="opacity-70">Xu</span>
                    <span className="ml-1 font-medium">{selectedUser.balance}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền cần nạp (VNĐ)</Label>
                  <Input id="amount" type="text" value={amount.toLocaleString()} onChange={handleAmountChange} />
                </div>

                <div className="flex items-center justify-between py-4 px-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Số Xu nạp vào tài khoản</p>
                    <p className="text-xs text-muted-foreground">1.000đ = 1 Xu</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{xuAmount}</p>
                    <p className="text-xs text-muted-foreground">Xu</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="payment-method">Phương thức thanh toán</Label>
                  <Select defaultValue="admin">
                    <SelectTrigger id="payment-method">
                      <SelectValue placeholder="Chọn phương thức thanh toán" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin nạp trực tiếp</SelectItem>
                      <SelectItem value="bank">Ngân hàng</SelectItem>
                      <SelectItem value="cash">Tiền mặt</SelectItem>
                      <SelectItem value="other">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="note">Ghi chú</Label>
                  <Textarea
                    id="note"
                    placeholder="Nhập ghi chú về giao dịch này (nếu có)"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  />
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Hủy</Button>
            <Button disabled={!selectedUser || amount <= 0}>
              <div className="flex items-center">
                Nạp tiền
                <ArrowRight className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
