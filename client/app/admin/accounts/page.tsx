"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, Key, ShieldAlert } from "lucide-react"

// Mock data for admin accounts
const adminAccounts = [
  {
    id: 1,
    name: "Admin",
    email: "admin@aiservices.com",
    role: "super-admin",
    status: "active",
    lastLogin: "15/05/2023 14:30",
  },
  {
    id: 2,
    name: "Nguyễn Văn A",
    email: "nguyenvana@aiservices.com",
    role: "admin",
    status: "active",
    lastLogin: "15/05/2023 10:15",
  },
  {
    id: 3,
    name: "Trần Thị B",
    email: "tranthib@aiservices.com",
    role: "content-manager",
    status: "active",
    lastLogin: "14/05/2023 16:45",
  },
  {
    id: 4,
    name: "Lê Văn C",
    email: "levanc@aiservices.com",
    role: "support",
    status: "inactive",
    lastLogin: "10/05/2023 09:30",
  },
  {
    id: 5,
    name: "Phạm Thị D",
    email: "phamthid@aiservices.com",
    role: "finance",
    status: "active",
    lastLogin: "15/05/2023 11:20",
  },
]

// Role definitions
const roles = [
  {
    id: "super-admin",
    name: "Super Admin",
    description: "Quyền truy cập đầy đủ vào tất cả các tính năng của hệ thống.",
  },
  {
    id: "admin",
    name: "Admin",
    description: "Quyền truy cập vào hầu hết các tính năng, ngoại trừ một số cài đặt hệ thống quan trọng.",
  },
  {
    id: "content-manager",
    name: "Quản lý nội dung",
    description: "Quản lý nội dung, tin tức, video và khuyến mại.",
  },
  {
    id: "support",
    name: "Hỗ trợ khách hàng",
    description: "Quản lý khách hàng và hỗ trợ kỹ thuật.",
  },
  {
    id: "finance",
    name: "Tài chính",
    description: "Quản lý thanh toán, nạp tiền và báo cáo tài chính.",
  },
]

export default function AccountsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showEditAccount, setShowEditAccount] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<any>(null)

  const filteredAccounts = adminAccounts.filter(
    (account) =>
      account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      account.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý tài khoản</h1>
        <Button onClick={() => setShowAddAccount(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm tài khoản
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="super-admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="content-manager">Quản lý nội dung</SelectItem>
              <SelectItem value="support">Hỗ trợ khách hàng</SelectItem>
              <SelectItem value="finance">Tài chính</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Đăng nhập gần nhất</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAccounts.map((account) => (
                <TableRow key={account.id}>
                  <TableCell className="font-medium">{account.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={account.name} />
                        <AvatarFallback>{account.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {account.name}
                    </div>
                  </TableCell>
                  <TableCell>{account.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">
                      {roles.find((role) => role.id === account.role)?.name || account.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={account.status === "active" ? "default" : "secondary"}>
                      {account.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>{account.lastLogin}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Mở menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAccount(account)
                            setShowEditAccount(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedAccount(account)
                            setShowResetPassword(true)
                          }}
                        >
                          <Key className="h-4 w-4 mr-2" />
                          Đổi mật khẩu
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Xóa
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Account Dialog */}
      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm tài khoản mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết về tài khoản mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Tên</Label>
              <Input id="name" placeholder="Nhập tên" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="Nhập email" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mật khẩu</Label>
              <Input id="password" type="password" placeholder="Nhập mật khẩu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Xác nhận mật khẩu</Label>
              <Input id="confirm-password" type="password" placeholder="Xác nhận mật khẩu" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Vai trò</Label>
              <Select defaultValue="support">
                <SelectTrigger id="role">
                  <SelectValue placeholder="Chọn vai trò" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground mt-1">
                {roles.find((role) => role.id === "support")?.description}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <input type="checkbox" id="status" className="rounded border-gray-300" defaultChecked />
              <Label htmlFor="status">Kích hoạt tài khoản</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddAccount(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAddAccount(false)}>Thêm tài khoản</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Account Dialog */}
      {selectedAccount && (
        <Dialog open={showEditAccount} onOpenChange={setShowEditAccount}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa tài khoản</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin chi tiết về tài khoản {selectedAccount.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Tên</Label>
                <Input id="edit-name" defaultValue={selectedAccount.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" type="email" defaultValue={selectedAccount.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-role">Vai trò</Label>
                <Select defaultValue={selectedAccount.role}>
                  <SelectTrigger id="edit-role">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((role) => (
                      <SelectItem key={role.id} value={role.id}>
                        {role.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  {roles.find((role) => role.id === selectedAccount.role)?.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-status"
                  className="rounded border-gray-300"
                  defaultChecked={selectedAccount.status === "active"}
                />
                <Label htmlFor="edit-status">Kích hoạt tài khoản</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditAccount(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowEditAccount(false)}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reset Password Dialog */}
      {selectedAccount && (
        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
              <DialogDescription>
                Đổi mật khẩu cho tài khoản {selectedAccount.name} ({selectedAccount.email})
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2 p-3 bg-amber-50 text-amber-800 rounded-md">
                <ShieldAlert className="h-5 w-5" />
                <p className="text-sm">
                  {selectedAccount.role === "super-admin"
                    ? "Đây là tài khoản Super Admin. Hãy cẩn thận khi thay đổi mật khẩu."
                    : "Hãy đảm bảo mật khẩu mới đủ mạnh và an toàn."}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Mật khẩu mới</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password">Xác nhận mật khẩu mới</Label>
                <Input id="confirm-new-password" type="password" />
              </div>
              <div className="flex items-center space-x-2">
                <input type="checkbox" id="send-email" className="rounded border-gray-300" />
                <Label htmlFor="send-email" className="text-sm">
                  Gửi email thông báo cho người dùng
                </Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetPassword(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowResetPassword(false)}>Đổi mật khẩu</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
