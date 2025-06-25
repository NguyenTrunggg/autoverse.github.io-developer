"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Info, CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { format } from "date-fns"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from "@/hooks/use-toast"

export default function ChatbotPage() {
  const searchParams = useSearchParams()
  const selectedPlan = searchParams.get("plan")

  const [selectedTab, setSelectedTab] = useState("template")
  const [businessType, setBusinessType] = useState("")
  const [selectedPlatform, setSelectedPlatform] = useState<string[]>([])
  const [chatStyle, setChatStyle] = useState("default")
  const [customPrompt, setCustomPrompt] = useState("")
  const [useStartDate, setUseStartDate] = useState<Date | undefined>(new Date())
  const [useEndDate, setUseEndDate] = useState<Date | undefined>(new Date())
  const [currentBalance, setCurrentBalance] = useState<number>(0)

  const totalDays = useStartDate && useEndDate
    ? Math.floor((useEndDate.getTime() - useStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    : 0
  const totalXu = totalDays * 5

  const handlePlatformChange = (platform: string) => {
    if (selectedPlatform.includes(platform)) {
      setSelectedPlatform(selectedPlatform.filter((p) => p !== platform))
    } else {
      setSelectedPlatform([...selectedPlatform, platform])
    }
  }

  // Submit chatbot registration
  const handleSubmit = async () => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: selectedPlan,
          businessType,
          selectedPlatform,
          chatStyle,
          customPrompt,
          useStartDate,
          useEndDate,
        }),
      })
      if (!response.ok) throw new Error('Network response was not ok')
      toast({ title: 'Đăng ký thành công', description: 'Chatbot đã được đăng ký thành công', variant: 'default' })
    } catch (error) {
      toast({ title: 'Đăng ký thất bại', description: 'Có lỗi xảy ra, vui lòng thử lại', variant: 'destructive' })
    }
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbot tự động</h1>
          <p className="text-muted-foreground mt-2">
            Huấn luyện chatbot AI để chăm sóc khách hàng trên Zalo, Telegram, Facebook, Shopee và các nền tảng khác.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình chatbot</CardTitle>
                <CardDescription>Tùy chỉnh chatbot AI theo nhu cầu của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="template">Mẫu chat</TabsTrigger>
                    <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger>
                  </TabsList>
                  <TabsContent value="template" className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="business-type">Lĩnh vực kinh doanh</Label>
                      <Select value={businessType} onValueChange={setBusinessType}>
                        <SelectTrigger id="business-type">
                          <SelectValue placeholder="Chọn lĩnh vực kinh doanh" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="retail">Bán lẻ</SelectItem>
                          <SelectItem value="food">Nhà hàng / Đồ ăn</SelectItem>
                          <SelectItem value="fashion">Thời trang</SelectItem>
                          <SelectItem value="tech">Công nghệ</SelectItem>
                          <SelectItem value="education">Giáo dục</SelectItem>
                          <SelectItem value="health">Sức khỏe / Làm đẹp</SelectItem>
                          <SelectItem value="travel">Du lịch</SelectItem>
                          <SelectItem value="realestate">Bất động sản</SelectItem>
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="custom-prompt">Prompt tùy chỉnh</Label>
                      <Textarea
                        id="custom-prompt"
                        placeholder="Nhập prompt tùy chỉnh để huấn luyện chatbot của bạn..."
                        className="min-h-[150px]"
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Mô tả chi tiết về doanh nghiệp, sản phẩm, dịch vụ, và cách chatbot nên tương tác với khách hàng.
                      </p>
                    </div>

                    <div className="grid gap-2">
                      <Label>Giao diện chat</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="chat-style" className="text-sm text-muted-foreground">
                            Kiểu giao diện
                          </Label>
                          <RadioGroup
                            value={chatStyle}
                            onValueChange={setChatStyle}
                            className="flex flex-col space-y-1"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="default" id="default" />
                              <Label htmlFor="default">Mặc định</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="modern" id="modern" />
                              <Label htmlFor="modern">Hiện đại</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="minimal" id="minimal" />
                              <Label htmlFor="minimal">Tối giản</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="playful" id="playful" />
                              <Label htmlFor="playful">Vui nhộn</Label>
                            </div>
                          </RadioGroup>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="chat-color" className="text-sm text-muted-foreground">
                            Màu sắc
                          </Label>
                          <div className="grid grid-cols-4 gap-2">
                            {[
                              "#0ea5e9",
                              "#8b5cf6",
                              "#ec4899",
                              "#f97316",
                              "#10b981",
                              "#ef4444",
                              "#6b7280",
                              "#000000",
                            ].map((color) => (
                              <button
                                key={color}
                                className="w-8 h-8 rounded-full border flex items-center justify-center"
                                style={{ backgroundColor: color }}
                                aria-label={`Color ${color}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label>Nền tảng kết nối</Label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: "facebook", name: "Facebook" },
                        { id: "zalo", name: "Zalo" },
                        { id: "telegram", name: "Telegram" },
                        { id: "website", name: "Website" },
                        { id: "shopee", name: "Shopee" },
                        { id: "tiktok", name: "TikTok" },
                        { id: "instagram", name: "Instagram" },
                        { id: "viber", name: "Viber" },
                      ].map((platform) => (
                        <div key={platform.id}>
                          <Button
                            type="button"
                            variant={selectedPlatform.includes(platform.id) ? "default" : "outline"}
                            className="w-full"
                            onClick={() => handlePlatformChange(platform.id)}
                          >
                            {platform.name}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedPlatform.length > 0 && (
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="font-medium">Cấu hình kết nối API</h3>
                      {selectedPlatform.includes("facebook") && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="facebook-api">Facebook</Label>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              Hướng dẫn
                            </Button>
                          </div>
                          <Input id="facebook-api" placeholder="Nhập Page ID Facebook" />
                        </div>
                      )}
                      {selectedPlatform.includes("zalo") && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="zalo-api">Zalo</Label>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              Hướng dẫn
                            </Button>
                          </div>
                          <Input id="zalo-api" placeholder="Nhập Zalo OA ID" />
                        </div>
                      )}
                      {selectedPlatform.includes("telegram") && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="telegram-api">Telegram</Label>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              Hướng dẫn
                            </Button>
                          </div>
                          <Input id="telegram-api" placeholder="Nhập Telegram Bot Token" />
                        </div>
                      )}
                      {selectedPlatform.includes("website") && (
                        <div className="grid gap-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="website-api">Website</Label>
                            <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                              Hướng dẫn
                            </Button>
                          </div>
                          <Input id="website-api" placeholder="Nhập URL Website" />
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="usage-start-date">Ngày bắt đầu sử dụng</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {useStartDate ? format(useStartDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={useStartDate} onSelect={setUseStartDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="usage-end-date">Ngày kết thúc sử dụng</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal mt-1">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {useEndDate ? format(useEndDate, "dd/MM/yyyy") : <span>Chọn ngày</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar mode="single" selected={useEndDate} onSelect={setUseEndDate} initialFocus />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Hủy</Link>
                </Button>
                <Button onClick={handleSubmit}>Đồng ý</Button>
              </CardFooter>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin gói dịch vụ</CardTitle>
                <CardDescription>Chi tiết gói dịch vụ bạn đã chọn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Gói dịch vụ:</span>
                  <span className="font-semibold">Chatbot tự động</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ngày bắt đầu sử dụng:</span>
                  <span className="font-semibold">{useStartDate ? format(useStartDate, "dd/MM/yyyy") : "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Ngày kết thúc sử dụng:</span>
                  <span className="font-semibold">{useEndDate ? format(useEndDate, "dd/MM/yyyy") : "-"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Tổng cộng:</span>
                  <span className="text-lg font-semibold">{totalXu} Xu</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số dư hiện tại:</span>
                  <span className="font-semibold text-primary">{currentBalance} Xu</span>
                </div>
                {currentBalance < totalXu && (
                  <p className="text-sm text-red-600">Số dư của bạn không đủ, hãy nạp thêm xu</p>
                )}
              </CardContent>
              <CardFooter>
                <Button className="w-full" asChild>
                  <Link href="/user/payment">Nạp tiền</Link>
                </Button>
              </CardFooter>
            </Card>

            <div className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Hướng dẫn sử dụng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Chọn lĩnh vực kinh doanh để AI tạo mẫu chat phù hợp hoặc tùy chỉnh prompt theo ý bạn.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Chọn các nền tảng bạn muốn tích hợp chatbot và cung cấp thông tin API cần thiết.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Tùy chỉnh giao diện chat để phù hợp với thương hiệu của bạn.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Sau khi cấu hình, chatbot sẽ được huấn luyện và sẵn sàng hoạt động trong vòng 24 giờ.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
