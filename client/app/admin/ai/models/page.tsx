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
import { Switch } from "@/components/ui/switch"
import { MoreHorizontal, PlusCircle, Search, Edit, Trash2, Copy } from "lucide-react"

// Mock data for AI models
const aiModels = [
  {
    id: 1,
    name: "GPT-4o",
    provider: "OpenAI",
    type: "text",
    status: "active",
    lastUpdated: "15/05/2023",
    usageCount: 12500,
    description: "Mô hình ngôn ngữ lớn đa năng mới nhất từ OpenAI, hỗ trợ cả văn bản và hình ảnh.",
  },
  {
    id: 2,
    name: "Grok-1",
    provider: "xAI",
    type: "text",
    status: "active",
    lastUpdated: "10/05/2023",
    usageCount: 8200,
    description: "Mô hình ngôn ngữ lớn từ xAI, tối ưu cho các tác vụ sáng tạo nội dung.",
  },
  {
    id: 3,
    name: "Claude 3 Opus",
    provider: "Anthropic",
    type: "text",
    status: "active",
    lastUpdated: "05/05/2023",
    usageCount: 6300,
    description: "Mô hình ngôn ngữ lớn từ Anthropic, tối ưu cho các tác vụ phân tích và suy luận.",
  },
  {
    id: 4,
    name: "Copilot",
    provider: "Microsoft",
    type: "text",
    status: "inactive",
    lastUpdated: "01/05/2023",
    usageCount: 4500,
    description: "Mô hình ngôn ngữ lớn từ Microsoft, tối ưu cho các tác vụ lập trình và hỗ trợ kỹ thuật.",
  },
  {
    id: 5,
    name: "DALL-E 3",
    provider: "OpenAI",
    type: "image",
    status: "active",
    lastUpdated: "20/04/2023",
    usageCount: 7800,
    description: "Mô hình tạo hình ảnh từ văn bản của OpenAI, tạo ra hình ảnh chất lượng cao từ mô tả.",
  },
]

export default function AIModelsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showAddModel, setShowAddModel] = useState(false)
  const [showEditModel, setShowEditModel] = useState(false)
  const [selectedModel, setSelectedModel] = useState<any>(null)

  const filteredModels = aiModels.filter(
    (model) =>
      model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      model.provider.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý AI</h1>
        <Button onClick={() => setShowAddModel(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm mô hình AI
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Tìm kiếm theo tên, nhà cung cấp..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo loại" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả loại</SelectItem>
              <SelectItem value="text">Văn bản</SelectItem>
              <SelectItem value="image">Hình ảnh</SelectItem>
              <SelectItem value="audio">Âm thanh</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Đang hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
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
                <TableHead>Tên mô hình</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>Loại</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Cập nhật lần cuối</TableHead>
                <TableHead>Lượt sử dụng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.id}</TableCell>
                  <TableCell>{model.name}</TableCell>
                  <TableCell>{model.provider}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {model.type === "text" ? "Văn bản" : model.type === "image" ? "Hình ảnh" : "Âm thanh"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={model.status === "active" ? "default" : "secondary"}>
                      {model.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>{model.lastUpdated}</TableCell>
                  <TableCell>{model.usageCount.toLocaleString()}</TableCell>
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
                            setSelectedModel(model)
                            setShowEditModel(true)
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

      {/* Add Model Dialog */}
      <Dialog open={showAddModel} onOpenChange={setShowAddModel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm mô hình AI mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết về mô hình AI mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="model-name">Tên mô hình</Label>
              <Input id="model-name" placeholder="Nhập tên mô hình" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="provider">Nhà cung cấp</Label>
              <Select defaultValue="openai">
                <SelectTrigger id="provider">
                  <SelectValue placeholder="Chọn nhà cung cấp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="openai">OpenAI</SelectItem>
                  <SelectItem value="xai">xAI</SelectItem>
                  <SelectItem value="anthropic">Anthropic</SelectItem>
                  <SelectItem value="microsoft">Microsoft</SelectItem>
                  <SelectItem value="google">Google</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Loại</Label>
              <Select defaultValue="text">
                <SelectTrigger id="type">
                  <SelectValue placeholder="Chọn loại mô hình" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Văn bản</SelectItem>
                  <SelectItem value="image">Hình ảnh</SelectItem>
                  <SelectItem value="audio">Âm thanh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea id="description" placeholder="Nhập mô tả về mô hình" />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="status" defaultChecked />
              <Label htmlFor="status">Kích hoạt</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModel(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAddModel(false)}>Thêm mô hình</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Model Dialog */}
      {selectedModel && (
        <Dialog open={showEditModel} onOpenChange={setShowEditModel}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa mô hình AI</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin chi tiết về mô hình {selectedModel.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-model-name">Tên mô hình</Label>
                <Input id="edit-model-name" defaultValue={selectedModel.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-provider">Nhà cung cấp</Label>
                <Select defaultValue={selectedModel.provider.toLowerCase()}>
                  <SelectTrigger id="edit-provider">
                    <SelectValue placeholder="Chọn nhà cung cấp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="openai">OpenAI</SelectItem>
                    <SelectItem value="xai">xAI</SelectItem>
                    <SelectItem value="anthropic">Anthropic</SelectItem>
                    <SelectItem value="microsoft">Microsoft</SelectItem>
                    <SelectItem value="google">Google</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Loại</Label>
                <Select defaultValue={selectedModel.type}>
                  <SelectTrigger id="edit-type">
                    <SelectValue placeholder="Chọn loại mô hình" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Văn bản</SelectItem>
                    <SelectItem value="image">Hình ảnh</SelectItem>
                    <SelectItem value="audio">Âm thanh</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Mô tả</Label>
                <Textarea id="edit-description" defaultValue={selectedModel.description} />
              </div>
              <div className="flex items-center space-x-2">
                <Switch id="edit-status" defaultChecked={selectedModel.status === "active"} />
                <Label htmlFor="edit-status">Kích hoạt</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditModel(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowEditModel(false)}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
