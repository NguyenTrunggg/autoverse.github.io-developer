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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, Copy } from "lucide-react"

// Mock data for service types
const serviceTypes = [
  {
    id: 1,
    name: "Đăng bài viết tự động",
    description: "Tự động tạo và đăng bài viết chất lượng cao lên Facebook Page hoặc Website.",
    status: "active",
    platforms: ["Facebook", "Website"],
    aiModel: "GPT-4o",
    usageCount: 1250,
  },
  {
    id: 2,
    name: "Chatbot tự động",
    description: "Huấn luyện chatbot AI để chăm sóc khách hàng trên các nền tảng.",
    status: "active",
    platforms: ["Facebook", "Zalo", "Telegram", "Website", "Shopee"],
    aiModel: "Claude 3 Opus",
    usageCount: 980,
  },
  {
    id: 3,
    name: "Gửi tin nhắn tự động",
    description: "Tự động gửi tin nhắn đến khách hàng tiềm năng hoặc khách hàng hiện tại.",
    status: "active",
    platforms: ["Facebook", "Zalo", "Telegram", "SMS"],
    aiModel: "GPT-4o",
    usageCount: 750,
  },
  {
    id: 4,
    name: "Email Marketing AI",
    description: "Tạo và gửi email marketing với nội dung được tạo bởi AI.",
    status: "inactive",
    platforms: ["Email"],
    aiModel: "GPT-4o",
    usageCount: 0,
  },
  {
    id: 5,
    name: "Tạo ảnh AI",
    description: "Tạo hình ảnh chất lượng cao từ mô tả văn bản.",
    status: "development",
    platforms: ["Website"],
    aiModel: "DALL-E 3",
    usageCount: 0,
  },
]

export default function ServiceTypesPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddServiceType, setShowAddServiceType] = useState(false)
  const [showEditServiceType, setShowEditServiceType] = useState(false)
  const [selectedServiceType, setSelectedServiceType] = useState<any>(null)

  const filteredServiceTypes = serviceTypes.filter((serviceType) =>
    serviceType.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý loại dịch vụ</h1>
        <Button onClick={() => setShowAddServiceType(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm loại dịch vụ
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên dịch vụ..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
              <SelectItem value="development">Đang phát triển</SelectItem>
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
                <TableHead>Tên dịch vụ</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Nền tảng hỗ trợ</TableHead>
                <TableHead>Mô hình AI</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Lượt sử dụng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredServiceTypes.map((serviceType) => (
                <TableRow key={serviceType.id}>
                  <TableCell className="font-medium">{serviceType.id}</TableCell>
                  <TableCell>{serviceType.name}</TableCell>
                  <TableCell className="max-w-xs truncate">{serviceType.description}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {serviceType.platforms.map((platform) => (
                        <Badge key={platform} variant="outline" className="mr-1">
                          {platform}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{serviceType.aiModel}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        serviceType.status === "active"
                          ? "default"
                          : serviceType.status === "development"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {serviceType.status === "active"
                        ? "Đang hoạt động"
                        : serviceType.status === "development"
                          ? "Đang phát triển"
                          : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>{serviceType.usageCount}</TableCell>
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
                            setSelectedServiceType(serviceType)
                            setShowEditServiceType(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Copy className="h-4 w-4 mr-2" />
                          Nhân bản
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

      {/* Add Service Type Dialog */}
      <Dialog open={showAddServiceType} onOpenChange={setShowAddServiceType}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm loại dịch vụ mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết về loại dịch vụ mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="service-name">Tên dịch vụ</Label>
              <Input id="service-name" placeholder="Nhập tên dịch vụ" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" placeholder="Nhập mô tả về dịch vụ" />
            </div>
            <div className="space-y-2">
              <Label>Nền tảng hỗ trợ</Label>
              <div className="grid grid-cols-2 gap-2">
                {["Facebook", "Website", "Zalo", "Telegram", "Shopee", "Email", "SMS"].map((platform) => (
                  <div key={platform} className="flex items-center space-x-2">
                    <input type="checkbox" id={`platform-${platform}`} className="rounded border-gray-300" />
                    <Label htmlFor={`platform-${platform}`} className="text-sm">
                      {platform}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="ai-model">Mô hình AI</Label>
              <Select defaultValue="gpt-4o">
                <SelectTrigger id="ai-model">
                  <SelectValue placeholder="Chọn mô hình AI" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                  <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                  <SelectItem value="grok-1">Grok-1</SelectItem>
                  <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Trạng thái</Label>
              <Select defaultValue="active">
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                  <SelectItem value="development">Đang phát triển</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddServiceType(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAddServiceType(false)}>Thêm dịch vụ</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Service Type Dialog */}
      {selectedServiceType && (
        <Dialog open={showEditServiceType} onOpenChange={setShowEditServiceType}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa loại dịch vụ</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin chi tiết về dịch vụ {selectedServiceType.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-service-name">Tên dịch vụ</Label>
                <Input id="edit-service-name" defaultValue={selectedServiceType.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea id="edit-description" defaultValue={selectedServiceType.description} />
              </div>
              <div className="space-y-2">
                <Label>Nền tảng hỗ trợ</Label>
                <div className="grid grid-cols-2 gap-2">
                  {["Facebook", "Website", "Zalo", "Telegram", "Shopee", "Email", "SMS"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`edit-platform-${platform}`}
                        className="rounded border-gray-300"
                        defaultChecked={selectedServiceType.platforms.includes(platform)}
                      />
                      <Label htmlFor={`edit-platform-${platform}`} className="text-sm">
                        {platform}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-ai-model">Mô hình AI</Label>
                <Select defaultValue={selectedServiceType.aiModel.toLowerCase().replace(/\s+/g, "-")}>
                  <SelectTrigger id="edit-ai-model">
                    <SelectValue placeholder="Chọn mô hình AI" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-4o">GPT-4o</SelectItem>
                    <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    <SelectItem value="grok-1">Grok-1</SelectItem>
                    <SelectItem value="dall-e-3">DALL-E 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-status">Trạng thái</Label>
                <Select defaultValue={selectedServiceType.status}>
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="inactive">Không hoạt động</SelectItem>
                    <SelectItem value="development">Đang phát triển</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditServiceType(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowEditServiceType(false)}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
