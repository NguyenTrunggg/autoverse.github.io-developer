"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MoreHorizontal, Search, UserPlus, Eye, Edit, Key, ToggleLeft, ToggleRight, Trash2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import axios from "axios"

//
interface User {
  id: number
  name: string
  email: string
  phone: string
  status: { name: string }
  createdAt: string
  balance: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [showUserDetails, setShowUserDetails] = useState(false)
  const [showResetPassword, setShowResetPassword] = useState(false)
  const [showUserForm, setShowUserForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    status: "active",
  })
  const [historyService, setHistoryService] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user`, {
        credentials: 'include', // Thêm dòng này để gửi cookies
        headers: {
          'Content-Type': 'application/json',
        }
      })
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      const data = await response.json()
      setUsers(data.data.items)
    } catch (err: any) {
      setError(err.message)
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = () => {
    setEditingUser(null)
    setFormData({ name: "", email: "", phone: "", password: "", status: "active" })
    setShowUserForm(true)
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      password: "", // Password field is not pre-filled for security
      status: user.status.name,
    })
    setShowUserForm(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleStatusChange = (checked: boolean) => {
    setFormData({ ...formData, status: checked ? "active" : "inactive" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const url = editingUser
      ? `/user/${editingUser.id}`
      : `/user`
    const method = editingUser ? "PUT" : "POST"

    // Password should not be sent if it's empty during an update
    const body: any = { ...formData }
    if (editingUser && !body.password) {
      delete body.password
    }

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Đã có lỗi xảy ra")
      }

      toast.success(`Người dùng đã được ${editingUser ? "cập nhật" : "tạo"} thành công.`)
      setShowUserForm(false)
      fetchUsers() // Refresh list
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (userId: number) => {
    try {
      const response = await fetch(`/user/${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Không thể xóa người dùng")
      }

      toast.success("Người dùng đã được xóa thành công.")
      fetchUsers() // Refresh list
    } catch (error: any) {
      toast.error(error.message)
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý người dùng</h1>
        <Button onClick={handleCreate}>
          <UserPlus className="h-4 w-4 mr-2" />
          Thêm người dùng
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Xuất Excel
          </Button>
          <Button variant="outline" size="sm">
            Lọc
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên người dùng</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Số điện thoại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày đăng ký</TableHead>
                <TableHead>Số dư</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center text-red-500">
                    Error: {error}
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={`/placeholder.svg?height=32&width=32`} alt={user.name} />
                          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        {user.name}
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <Badge variant={user.status.name === "active" ? "default" : "secondary"}>
                        {user.status.name === "active" ? "Đã kích hoạt" : "Chưa kích hoạt"}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                      <span className="font-medium">{user.balance} Xu</span>
                    </TableCell>
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
                              setSelectedUser(user)
                              setShowUserDetails(true)
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedUser(user)
                              setShowResetPassword(true)
                            }}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Đổi mật khẩu
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            {user.status.name === "active" ? (
                              <>
                                <ToggleLeft className="h-4 w-4 mr-2" />
                                Vô hiệu hóa
                              </>
                            ) : (
                              <>
                                <ToggleRight className="h-4 w-4 mr-2" />
                                Kích hoạt
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onSelect={(e) => e.preventDefault()} // Prevents DropdownMenu from closing
                          >
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <button className="w-full text-left flex items-center">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Xóa
                                </button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn người dùng
                                    khỏi hệ thống.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(user.id)}>Xác nhận</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit User Dialog */}
      <Dialog open={showUserForm} onOpenChange={setShowUserForm}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng mới"}</DialogTitle>
            <DialogDescription>
              {editingUser
                ? `Cập nhật thông tin cho ${editingUser.name}.`
                : "Nhập thông tin chi tiết để tạo người dùng mới."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Điện thoại
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              {!editingUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Mật khẩu
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                    placeholder="Nhập mật khẩu"
                    required={!editingUser}
                  />
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Trạng thái
                </Label>
                <Switch
                  id="active"
                  checked={formData.status === "active"}
                  onCheckedChange={handleStatusChange}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowUserForm(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
          <DialogContent className="max-w-3xl max-h-[70vh] overflow-auto">
            <DialogHeader>
              <DialogTitle>Thông tin người dùng</DialogTitle>
              <DialogDescription>Chi tiết thông tin người dùng {selectedUser.name}</DialogDescription>
            </DialogHeader>
            <Tabs defaultValue="info">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="info">Thông tin</TabsTrigger>
                <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                <TabsTrigger value="login-history">Lịch sử đăng nhập</TabsTrigger>
                <TabsTrigger value="payment-history">Lịch sử nạp tiền</TabsTrigger>
              </TabsList>
              <TabsContent value="info" className="space-y-4 py-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={selectedUser.name} />
                    <AvatarFallback>{selectedUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-bold">{selectedUser.name}</h3>
                    <p className="text-muted-foreground">
                      {selectedUser.status.name === "active" ? "Đã kích hoạt" : "Chưa kích hoạt"}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Email</h4>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Số điện thoại</h4>
                    <p>{selectedUser.phone}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Ngày đăng ký</h4>
                    <p>{new Date(selectedUser.createdAt).toLocaleDateString("vi-VN")}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Đăng nhập gần nhất</h4>
                    <p>{selectedUser.lastLogin}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Số dư</h4>
                    <p className="font-medium">{selectedUser.balance} Xu</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Số dịch vụ đang sử dụng</h4>
                    <p>{selectedUser.services}</p>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="services" className="py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Dịch vụ đang sử dụng</h3>
                  {selectedUser.services > 0 ? (
                    <>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên dịch vụ</TableHead>
                            <TableHead>Gói</TableHead>
                            <TableHead>Ngày đăng ký</TableHead>
                            <TableHead>Ngày hết hạn</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.from({ length: selectedUser.services }).map((_, i) => {
                            const serviceName =
                              i % 3 === 0
                                ? "Chatbot tự động"
                                : i % 3 === 1
                                ? "Tạo ảnh AI"
                                : "Viết nội dung tự động"
                            return (
                              <TableRow key={i}>
                                <TableCell>{serviceName}</TableCell>
                                <TableCell>Gói cơ bản</TableCell>
                                <TableCell>{new Date(2023, 5, 10 + i).toLocaleDateString("vi-VN")}</TableCell>
                                <TableCell>
                                  {new Date(
                                    new Date(2023, 5, 10 + i).setFullYear(2024, 5, 10 + i),
                                  ).toLocaleDateString("vi-VN")}
                                </TableCell>
                                <TableCell>
                                  <Badge variant={"default"}>Đang hoạt động</Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setHistoryService(serviceName)}
                                  >
                                    Xem lịch sử
                                  </Button>
                                </TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Người dùng chưa sử dụng dịch vụ nào.</p>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="login-history" className="py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lịch sử đăng nhập</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Địa chỉ IP</TableHead>
                        <TableHead>Thiết bị</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>{new Date(2023, 5, 20 - i).toLocaleString("vi-VN")}</TableCell>
                          <TableCell>192.168.1.1</TableCell>
                          <TableCell>Chrome on Windows</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              <TabsContent value="payment-history" className="py-4">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Lịch sử nạp tiền</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mã giao dịch</TableHead>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Số tiền</TableHead>
                        <TableHead>Nội dung</TableHead>
                        <TableHead>Trạng thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 3 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell>#TX12345{i}</TableCell>
                          <TableCell>{new Date(2023, 5, 15 - i).toLocaleString("vi-VN")}</TableCell>
                          <TableCell>+{(i + 1) * 50} Xu</TableCell>
                          <TableCell>Nạp tiền vào tài khoản</TableCell>
                          <TableCell>
                            <Badge variant={"default"}>Thành công</Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowUserDetails(false)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Reset Password Dialog */}
      {selectedUser && (
        <Dialog open={showResetPassword} onOpenChange={setShowResetPassword}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Đổi mật khẩu</DialogTitle>
              <DialogDescription>
                Bạn có chắc chắn muốn đổi mật khẩu cho người dùng {selectedUser.name}?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowResetPassword(false)}>
                Hủy
              </Button>
              <Button>Xác nhận</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Service History Dialog */}
      {historyService && (
        <Dialog open={!!historyService} onOpenChange={() => setHistoryService(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Lịch sử sử dụng</DialogTitle>
              <DialogDescription>
                Chi tiết lịch sử sử dụng {historyService} của người dùng {selectedUser?.name}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-96 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Ngày</TableHead>
                    <TableHead>Giờ</TableHead>
                    <TableHead>Nội dung</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: 5 }).map((_, j) => (
                    <TableRow key={j}>
                      <TableCell>{new Date(2023, 5, 10 + j).toLocaleDateString("vi-VN")}</TableCell>
                      <TableCell>{`${9 + j}:00`}</TableCell>
                      <TableCell>Bài viết số {j + 1}</TableCell>
                      <TableCell>
                        <Badge variant={j % 2 === 0 ? "default" : "destructive"}>
                          {j % 2 === 0 ? "Thành công" : "Thất bại"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setHistoryService(null)}>
                Đóng
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
