"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, ExternalLink, MoreHorizontal, Pause, Play, RefreshCw, Settings, Trash2 } from "lucide-react"

// Mock data for active services
const activeServices = [
  {
    id: 1,
    type: "auto-posting",
    name: "Đăng bài viết tự động",
    platform: "Facebook",
    platformId: "Tech Company Page",
    status: "active",
    startDate: "2023-05-15",
    endDate: "2023-06-15",
    posts: [
      {
        id: 101,
        date: "2023-05-20",
        time: "09:00",
        content: "Giới thiệu sản phẩm mới - Laptop XYZ với hiệu năng vượt trội",
        status: "published",
      },
      {
        id: 102,
        date: "2023-05-18",
        time: "14:30",
        content: "Khuyến mãi đặc biệt - Giảm 20% cho tất cả sản phẩm công nghệ",
        status: "published",
      },
      {
        id: 103,
        date: "2023-05-22",
        time: "10:00",
        content: "Hướng dẫn sử dụng tính năng mới trên phần mềm ABC",
        status: "scheduled",
      },
    ],
  },
  {
    id: 2,
    type: "chatbot",
    name: "Chatbot tự động",
    platform: "Website",
    platformId: "techcompany.com",
    status: "active",
    startDate: "2023-05-10",
    endDate: "2023-08-10",
    conversations: [
      {
        id: 201,
        date: "2023-05-20",
        time: "10:15",
        customer: "user123",
        messages: 12,
      },
      {
        id: 202,
        date: "2023-05-19",
        time: "16:45",
        customer: "user456",
        messages: 8,
      },
      {
        id: 203,
        date: "2023-05-18",
        time: "09:30",
        customer: "user789",
        messages: 15,
      },
    ],
  },
  {
    id: 3,
    type: "auto-messaging",
    name: "Gửi tin nhắn tự động",
    platform: "Facebook",
    platformId: "Tech Company Page",
    status: "paused",
    startDate: "2023-04-20",
    endDate: "2023-05-20",
    messages: [
      {
        id: 301,
        date: "2023-05-15",
        time: "08:00",
        content: "Chào mừng bạn đến với Tech Company!",
        recipients: 45,
        opened: 32,
      },
      {
        id: 302,
        date: "2023-05-10",
        time: "09:00",
        content: "Khám phá sản phẩm mới của chúng tôi",
        recipients: 50,
        opened: 38,
      },
      {
        id: 303,
        date: "2023-05-05",
        time: "10:00",
        content: "Ưu đãi đặc biệt dành cho khách hàng thân thiết",
        recipients: 30,
        opened: 25,
      },
    ],
  },
]

export default function UserServicesPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [selectedService, setSelectedService] = useState<any>(null)
  const [showHistory, setShowHistory] = useState(false)

  const filteredServices =
    activeTab === "all" ? activeServices : activeServices.filter((service) => service.type === activeTab)

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dịch vụ của tôi</h1>
            <p className="text-muted-foreground mt-2">Quản lý các dịch vụ bạn đang sử dụng</p>
          </div>
          <Button asChild>
            <Link href="/services">Thêm dịch vụ mới</Link>
          </Button>
        </div>

        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-4 mb-8">
            <TabsTrigger value="all">Tất cả</TabsTrigger>
            <TabsTrigger value="auto-posting">Đăng bài</TabsTrigger>
            <TabsTrigger value="chatbot">Chatbot</TabsTrigger>
            <TabsTrigger value="auto-messaging">Tin nhắn</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => (
                <Card key={service.id}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{service.name}</CardTitle>
                        <CardDescription className="mt-1">
                          {service.platform}: {service.platformId}
                        </CardDescription>
                      </div>
                      <Badge variant={service.status === "active" ? "default" : "secondary"}>
                        {service.status === "active" ? "Đang hoạt động" : "Tạm dừng"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Bắt đầu: </span>
                        <span className="ml-1 font-medium">
                          {new Date(service.startDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Kết thúc: </span>
                        <span className="ml-1 font-medium">
                          {new Date(service.endDate).toLocaleDateString("vi-VN")}
                        </span>
                      </div>

                      {service.type === "auto-posting" && (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Bài viết: </span>
                          <span className="ml-1 font-medium">{service.posts.length} bài</span>
                        </div>
                      )}

                      {service.type === "chatbot" && (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Cuộc hội thoại: </span>
                          <span className="ml-1 font-medium">{service.conversations.length} cuộc</span>
                        </div>
                      )}

                      {service.type === "auto-messaging" && (
                        <div className="flex items-center text-sm">
                          <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Tin nhắn: </span>
                          <span className="ml-1 font-medium">{service.messages.length} tin</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedService(service)
                        setShowHistory(true)
                      }}
                    >
                      Xem lịch sử
                    </Button>
                    <div className="flex gap-2">
                      {service.status === "active" ? (
                        <Button variant="outline" size="icon">
                          <Pause className="h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" size="icon">
                          <Play className="h-4 w-4" />
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Tùy chọn dịch vụ</DialogTitle>
                            <DialogDescription>Quản lý dịch vụ {service.name}</DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <Button variant="outline" className="w-full justify-start" asChild>
                              <Link href={`/services/${service.type}?id=${service.id}`}>
                                <Settings className="mr-2 h-4 w-4" />
                                Cài đặt dịch vụ
                              </Link>
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Gia hạn dịch vụ
                            </Button>
                            <Button variant="outline" className="w-full justify-start">
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Xem trên nền tảng
                            </Button>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-red-500 hover:text-red-500 hover:bg-red-50"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa dịch vụ
                            </Button>
                          </div>
                          <DialogFooter>
                            <Button type="submit">Lưu thay đổi</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Service History Dialog */}
      {selectedService && (
        <Dialog open={showHistory} onOpenChange={setShowHistory}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Lịch sử {selectedService.name}</DialogTitle>
              <DialogDescription>
                {selectedService.platform}: {selectedService.platformId}
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {selectedService.type === "auto-posting" && (
                <div className="space-y-4">
                  {selectedService.posts.map((post: any) => (
                    <div key={post.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(post.date).toLocaleDateString("vi-VN")} - {post.time}
                          </span>
                        </div>
                        <Badge variant={post.status === "published" ? "default" : "secondary"}>
                          {post.status === "published" ? "Đã đăng" : "Lên lịch"}
                        </Badge>
                      </div>
                      <p className="text-sm">{post.content}</p>
                    </div>
                  ))}
                </div>
              )}

              {selectedService.type === "chatbot" && (
                <div className="space-y-4">
                  {selectedService.conversations.map((conv: any) => (
                    <div key={conv.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(conv.date).toLocaleDateString("vi-VN")} - {conv.time}
                          </span>
                        </div>
                        <span className="text-sm font-medium">{conv.messages} tin nhắn</span>
                      </div>
                      <p className="text-sm font-medium">Khách hàng: {conv.customer}</p>
                      <Button variant="link" size="sm" className="p-0 h-auto mt-2">
                        Xem chi tiết cuộc hội thoại
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {selectedService.type === "auto-messaging" && (
                <div className="space-y-4">
                  {selectedService.messages.map((msg: any) => (
                    <div key={msg.id} className="p-4 border rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {new Date(msg.date).toLocaleDateString("vi-VN")} - {msg.time}
                          </span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{msg.opened}</span>
                          <span className="text-muted-foreground">/{msg.recipients} đã mở</span>
                        </div>
                      </div>
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={() => setShowHistory(false)}>Đóng</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
