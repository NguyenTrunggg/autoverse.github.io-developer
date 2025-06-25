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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MoreHorizontal, PlusCircle, Edit, Trash2, RefreshCw, Key, Eye, EyeOff } from "lucide-react"

// Mock data for API connections
const apiConnections = [
  {
    id: 1,
    name: "OpenAI API",
    provider: "OpenAI",
    status: "active",
    lastChecked: "15/05/2023 14:30",
    usageLimit: "500,000 tokens/day",
    usageCount: "320,500 tokens",
    apiKey: "sk-o9X...Yd8K",
  },
  {
    id: 2,
    name: "xAI API",
    provider: "xAI",
    status: "active",
    lastChecked: "15/05/2023 12:15",
    usageLimit: "300,000 tokens/day",
    usageCount: "150,200 tokens",
    apiKey: "xai-8jK...Lp2M",
  },
  {
    id: 3,
    name: "Microsoft Copilot API",
    provider: "Microsoft",
    status: "inactive",
    lastChecked: "14/05/2023 09:45",
    usageLimit: "200,000 tokens/day",
    usageCount: "0 tokens",
    apiKey: "ms-c3R...Nj9P",
  },
  {
    id: 4,
    name: "Claude API",
    provider: "Anthropic",
    status: "active",
    lastChecked: "15/05/2023 10:20",
    usageLimit: "400,000 tokens/day",
    usageCount: "210,300 tokens",
    apiKey: "sk-ant-...Kd7R",
  },
  {
    id: 5,
    name: "Gemini API",
    provider: "Google",
    status: "active",
    lastChecked: "15/05/2023 11:05",
    usageLimit: "350,000 tokens/day",
    usageCount: "180,600 tokens",
    apiKey: "AIza...X8mQ",
  },
]

export default function AIConnectionsPage() {
  const [showAddConnection, setShowAddConnection] = useState(false)
  const [showEditConnection, setShowEditConnection] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState<any>(null)
  const [showApiKey, setShowApiKey] = useState<Record<number, boolean>>({})

  const toggleApiKeyVisibility = (id: number) => {
    setShowApiKey((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Kết nối API</h1>
        <Button onClick={() => setShowAddConnection(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Thêm kết nối API
        </Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Tất cả</TabsTrigger>
          <TabsTrigger value="active">Đang hoạt động</TabsTrigger>
          <TabsTrigger value="inactive">Không hoạt động</TabsTrigger>
        </TabsList>
      </Tabs>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[50px]">ID</TableHead>
                <TableHead>Tên kết nối</TableHead>
                <TableHead>Nhà cung cấp</TableHead>
                <TableHead>API Key</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Kiểm tra lần cuối</TableHead>
                <TableHead>Giới hạn sử dụng</TableHead>
                <TableHead>Đã sử dụng</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiConnections.map((connection) => (
                <TableRow key={connection.id}>
                  <TableCell className="font-medium">{connection.id}</TableCell>
                  <TableCell>{connection.name}</TableCell>
                  <TableCell>{connection.provider}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{showApiKey[connection.id] ? connection.apiKey : "••••••••••••••"}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => toggleApiKeyVisibility(connection.id)}
                      >
                        {showApiKey[connection.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={connection.status === "active" ? "default" : "secondary"}>
                      {connection.status === "active" ? "Đang hoạt động" : "Không hoạt động"}
                    </Badge>
                  </TableCell>
                  <TableCell>{connection.lastChecked}</TableCell>
                  <TableCell>{connection.usageLimit}</TableCell>
                  <TableCell>{connection.usageCount}</TableCell>
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
                            setSelectedConnection(connection)
                            setShowEditConnection(true)
                          }}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Kiểm tra kết nối
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Key className="h-4 w-4 mr-2" />
                          Tạo lại API Key
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

      {/* Add Connection Dialog */}
      <Dialog open={showAddConnection} onOpenChange={setShowAddConnection}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Thêm kết nối API mới</DialogTitle>
            <DialogDescription>Nhập thông tin chi tiết về kết nối API mới</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="connection-name">Tên kết nối</Label>
              <Input id="connection-name" placeholder="Nhập tên kết nối" />
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
              <Label htmlFor="api-key">API Key</Label>
              <Input id="api-key" type="password" placeholder="Nhập API Key" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="usage-limit">Giới hạn sử dụng</Label>
              <div className="flex space-x-2">
                <Input id="usage-limit" type="number" placeholder="Nhập giới hạn" />
                <Select defaultValue="tokens">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Đơn vị" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tokens">tokens/ngày</SelectItem>
                    <SelectItem value="requests">requests/ngày</SelectItem>
                    <SelectItem value="credits">credits/ngày</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddConnection(false)}>
              Hủy
            </Button>
            <Button onClick={() => setShowAddConnection(false)}>Thêm kết nối</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Connection Dialog */}
      {selectedConnection && (
        <Dialog open={showEditConnection} onOpenChange={setShowEditConnection}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Chỉnh sửa kết nối API</DialogTitle>
              <DialogDescription>Chỉnh sửa thông tin chi tiết về kết nối {selectedConnection.name}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-connection-name">Tên kết nối</Label>
                <Input id="edit-connection-name" defaultValue={selectedConnection.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-provider">Nhà cung cấp</Label>
                <Select defaultValue={selectedConnection.provider.toLowerCase()}>
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
                <Label htmlFor="edit-api-key">API Key</Label>
                <Input id="edit-api-key" type="password" defaultValue={selectedConnection.apiKey} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-usage-limit">Giới hạn sử dụng</Label>
                <div className="flex space-x-2">
                  <Input
                    id="edit-usage-limit"
                    type="text"
                    defaultValue={selectedConnection.usageLimit.split(" ")[0].replace(/,/g, "")}
                  />
                  <Select defaultValue="tokens">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Đơn vị" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tokens">tokens/ngày</SelectItem>
                      <SelectItem value="requests">requests/ngày</SelectItem>
                      <SelectItem value="credits">credits/ngày</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-status"
                  className="rounded border-gray-300"
                  defaultChecked={selectedConnection.status === "active"}
                />
                <Label htmlFor="edit-status">Kích hoạt</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowEditConnection(false)}>
                Hủy
              </Button>
              <Button onClick={() => setShowEditConnection(false)}>Lưu thay đổi</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
