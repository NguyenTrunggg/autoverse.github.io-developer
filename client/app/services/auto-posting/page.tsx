"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, addDays, differenceInDays } from "date-fns"
import { CalendarIcon, Clock, CloudCog, Info } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { log } from "util"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

interface ConnectedAccount {
  id: string
  name: string
}

interface UserFacebookPage {
  id: string
  name: string
}

interface BusinessField {
  id: string
  name: string
}

interface ChannelType {
  id: string;
  name: string;
}

export default function AutoPostingPage() {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const searchParams = useSearchParams()
  const router = useRouter()
  const selectedPlan = searchParams.get("plan")

  const [selectedTab, setSelectedTab] = useState("template")
  const [postsPerDay, setPostsPerDay] = useState<number>(1)
  const [postingTimes, setPostingTimes] = useState<string[]>(["09:00"])
  const [startDate, setStartDate] = useState<Date | undefined>(new Date())
  const [endDate, setEndDate] = useState<Date | undefined>(addDays(new Date(), 6))
  const [businessType, setBusinessType] = useState("")
  const [businessFields, setBusinessFields] = useState<BusinessField[]>([])
  const [loadingBusinessFields, setLoadingBusinessFields] = useState(true)
  const [customBusinessType, setCustomBusinessType] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isGeneratingExcel, setIsGeneratingExcel] = useState(false)
  const [keywords, setKeywords] = useState("")
  const [currentBalance, setCurrentBalance] = useState<number>(100) // User's current xu balance
  const [facebookPostType, setFacebookPostType] = useState<"page" | "group">("page")
  const [selectedFacebookTarget, setSelectedFacebookTarget] = useState<string>("")
  // Mock data - replace with actual API call to fetch user's pages/groups
  const [userFacebookPages, setUserFacebookPages] = useState<UserFacebookPage[]>([])
  const [loadingFanpages, setLoadingFanpages] = useState(false)

  const [facebookApiToken, setFacebookApiToken] = useState<string>("") // New state for API token/credential

  // New state for Facebook connection
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [selectedFanpage, setSelectedFanpage] = useState<string>("")
  const [excelFile, setExcelFile] = useState<File | null>(null)
  const [channelTypes, setChannelTypes] = useState<ChannelType[]>([]);
  const [loadingChannelTypes, setLoadingChannelTypes] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState<string>("");

  useEffect(() => {
    const fetchConnectedAccounts = async () => {
      // Assume userId is stored in localStorage after login
      // const userId = localStorage.getItem("userId")
      console.log(">>> check currentUser: ", currentUser)
      const userId = currentUser?.id
      if (!userId) {
        toast({
          title: "Lỗi",
          description: "Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.",
          variant: "destructive",
        })
        setLoadingAccounts(false)
        return
      }

      try {
        setLoadingAccounts(true)
        // Check if backend server is running
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
        console.log(`Đang gọi API: ${apiUrl}/third-account/get-by-user/${userId}`)
        
        const response = await axios.get(
          `${apiUrl}/third-account/get-by-user/${userId}`,
          { 
            withCredentials: true,
            timeout: 10000 // Tăng timeout lên 10 giây
          }
        )
        
        console.log('Response từ API third-account:', response.data)
        
        if (response.data && response.data.success) {
          // Assuming the API returns data in the format { success: true, data: [...] }
          // And each item has `id` and `name` or similar fields.
          // You might need to adjust the mapping based on the actual API response structure.
          const formattedAccounts = response.data.data.map((acc: any) => ({
            id: acc.id, // Adjust if property name is different
            name: acc.name, // Adjust if property name is different
          }))
          setConnectedAccounts(formattedAccounts)
        } else {
          throw new Error("Failed to fetch accounts: " + (response.data?.message || "Unknown error"))
        }
      } catch (error: any) {
        console.error("Error fetching connected accounts:", error)
        
        // Chi tiết lỗi cụ thể hơn
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách tài khoản đã kết nối."
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem máy chủ có đang chạy không."
        } else if (error.response) {
          // Server trả về lỗi với status code
          if (error.response.status === 500) {
            errorMessage = "Lỗi server (500). Vui lòng kiểm tra logs của server để biết chi tiết."
            console.error("Server error details:", error.response.data)
          } else {
            errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || error.message}`
          }
        }
        
        toast({
          title: "Không thể tải tài khoản",
          description: errorMessage,
          variant: "destructive",
        })
      } finally {
        setLoadingAccounts(false)
      }
    }

    const fetchBusinessFields = async () => {
      try {
        setLoadingBusinessFields(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
        console.log(`Đang gọi API: ${apiUrl}/business-field`)
        
        const response = await axios.get(
          `${apiUrl}/business-field`, 
          { 
            withCredentials: true,
            timeout: 10000 // Tăng timeout lên 10 giây
          }
        )
        
        console.log('Response từ API business-field:', response.data)
        
        if (response.data && response.data.success) {
          setBusinessFields(response.data.data)
        } else {
          throw new Error("Failed to fetch business fields: " + (response.data?.message || "Unknown error"))
        }
      } catch (error: any) {
        console.error("Error fetching business fields:", error)
        
        // Chi tiết lỗi cụ thể hơn
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách lĩnh vực kinh doanh."
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem máy chủ có đang chạy không."
        } else if (error.response) {
          // Server trả về lỗi với status code
          if (error.response.status === 500) {
            errorMessage = "Lỗi server (500). Vui lòng kiểm tra logs của server để biết chi tiết."
            console.error("Server error details:", error.response.data)
          } else {
            errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || error.message}`
          }
        }
        
        toast({
          title: "Không thể tải lĩnh vực kinh doanh",
          description: errorMessage,
          variant: "destructive",
        })
        
        // Không fix cứng dữ liệu mà để trống
        setBusinessFields([])
      } finally {
        setLoadingBusinessFields(false)
      }
    }

    const fetchChannelTypes = async () => {
      try {
        setLoadingChannelTypes(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';
        const response = await axios.get(`${apiUrl}/channel/type`, {
          withCredentials: true,
        });
        if (response.data && response.data.success) {
          setChannelTypes(response.data.data);
        } else {
          throw new Error("Failed to fetch channel types");
        }
      } catch (error) {
        console.error("Error fetching channel types:", error);
        toast({
          title: "Không thể tải loại kênh",
          description: "Đã xảy ra lỗi khi tải danh sách các loại kênh.",
          variant: "destructive",
        });
      } finally {
        setLoadingChannelTypes(false);
      }
    };

    fetchConnectedAccounts()
    fetchBusinessFields()
    fetchChannelTypes()
  }, [currentUser])

  useEffect(() => {
    // Reset fanpage list when account changes
    setUserFacebookPages([])
    setSelectedFanpage("")

    if (!selectedAccount) {
      return
    }

    const fetchFanpages = async () => {
      try {
        setLoadingFanpages(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
        console.log(`Đang gọi API: ${apiUrl}/third-account/social/get-by-user/${selectedAccount}`)
        
        const response = await axios.get(
          // Fetch pages based on the selected account ID
          `${apiUrl}/third-account/social/get-by-user/${selectedAccount}`,
          { 
            withCredentials: true,
            timeout: 10000 // Tăng timeout lên 10 giây
          }
        )
        
        console.log('Response từ API social-account:', response.data)
        
        if (response.data && response.data.success) {
          const formattedPages = response.data.data.map((page: any) => ({
            id: page.id,
            name: page.integrationName,
          }))
          setUserFacebookPages(formattedPages)
        } else {
          setUserFacebookPages([])
          throw new Error("Failed to fetch fanpages for the selected account: " + (response.data?.message || "Unknown error"))
        }
      } catch (error: any) {
        console.error("Error fetching fanpages:", error)
        
        // Chi tiết lỗi cụ thể hơn
        let errorMessage = "Đã xảy ra lỗi khi tải danh sách Fanpage cho tài khoản đã chọn."
        if (error.code === 'ERR_NETWORK' || error.code === 'ECONNABORTED') {
          errorMessage = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra xem máy chủ có đang chạy không."
        } else if (error.response) {
          // Server trả về lỗi với status code
          if (error.response.status === 500) {
            errorMessage = "Lỗi server (500). Vui lòng kiểm tra logs của server để biết chi tiết."
            console.error("Server error details:", error.response.data)
          } else {
            errorMessage = `Lỗi ${error.response.status}: ${error.response.data?.message || error.message}`
          }
        }
        
        toast({
          title: "Không thể tải Fanpage",
          description: errorMessage,
          variant: "destructive",
        })
        
        // Không dùng dữ liệu mẫu mà để trống
        setUserFacebookPages([])
      } finally {
        setLoadingFanpages(false)
      }
    }

    fetchFanpages()
  }, [selectedAccount])

  const numberOfPostingDays =
    startDate && endDate && endDate >= startDate ? differenceInDays(endDate, startDate) + 1 : 0

  const handlePostsPerDayChange = (value: string) => {
    const numPosts = parseInt(value, 10)
    setPostsPerDay(numPosts)
    setPostingTimes(Array(numPosts).fill("09:00")) // Reset times when count changes
  }

  const handlePostingTimeChange = (index: number, time: string) => {
    const newTimes = [...postingTimes]
    newTimes[index] = time
    setPostingTimes(newTimes)
  }

  const handleStartDateSelect = (date: Date | undefined) => {
    setStartDate(date)
    if (date && endDate && date > endDate) {
      setEndDate(date)
    }
  }

  const handleEndDateSelect = (date: Date | undefined) => {
    setEndDate(date)
    if (date && startDate && date < startDate) {
      setStartDate(date)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setExcelFile(e.target.files[0])
      toast({
        title: "Tải file thành công",
        description: `Đã chọn file: ${e.target.files[0].name}`,
      })
    }
  }

  const handleGenerateExcel = async () => {
    setIsGeneratingExcel(true)
    const selectedBusinessField = businessFields.find((field) => field.id.toString() === businessType)
    const businessFieldName =
      businessType === "other" ? customBusinessType : selectedBusinessField?.name || "Chưa chọn"

    const planData = {
      businessFieldName: businessFieldName,
      startDate: startDate ? format(startDate, "yyyy-MM-dd") : "N/A",
      endDate: endDate ? format(endDate, "yyyy-MM-dd") : "N/A",
      numberOfDays: numberOfPostingDays,
      postsPerDay: postsPerDay,
      postTimes: postingTimes,
    }

    // Sử dụng apiUrl để đảm bảo kết nối đúng tới server
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'
    console.log(`Đang kết nối đến API tạo Excel: ${apiUrl}/auto-post/create-plan-excel`)

    const createExcelPlan = (data: typeof planData) => {
      return axios.post(`${apiUrl}/auto-post/create-plan-excel`, data, {
        responseType: "blob",
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
    }

    try {
      const response = await createExcelPlan(planData)

      if (response?.data instanceof Blob) {
        const blob = response.data
        let fileName = "ke_hoach_dang_bai.xlsx"
        const disposition = response.headers["content-disposition"]

        if (disposition) {
          const match = disposition.match(/filename="?([^"]+)"?/)
          if (match && match[1]) {
            fileName = match[1]
          }
        }

        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        toast({
          title: "Thành công",
          description: "File Excel mẫu đã được tải về.",
        })
      } else {
        toast({
          title: "Lỗi",
          description: "Không nhận được file đúng định dạng từ máy chủ.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Lỗi khi tạo file Excel:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo file Excel mẫu. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingExcel(false)
    }
  }

  const handleAddConnection = () => {
    // Logic to guide user to the connection page
    router.push("/admin/ai/connections")
  }

  const createScheduleFromExcel = async (formData: FormData) => {
    setIsUploading(true)
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auto-post/create-by-excel`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      if (response.data?.success) {
        toast({
          title: "Tải lên và tạo lịch thành công!",
          description: "Lịch đăng bài của bạn từ tệp Excel đã được tạo.",
        })
        router.push("/manage-posts")
      } else {
        throw new Error(response.data?.message || "Tạo lịch từ file excel thất bại")
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Đã có lỗi xảy ra khi tải tệp lên."
      toast({
        title: "Tạo lịch đăng thất bại",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleUpload = async () => {
    if (!excelFile) {
      toast({ title: "Lỗi", description: "Vui lòng chọn file Excel trước", variant: "destructive" })
      return
    }
    if (!selectedFanpage) {
      toast({ title: "Lỗi", description: "Vui lòng chọn Fanpage", variant: "destructive" })
      return
    }
    if (!businessType) {
      toast({ title: "Lỗi", description: "Vui lòng chọn lĩnh vực kinh doanh", variant: "destructive" })
      return
    }

    const formData = new FormData()
    formData.append("file", excelFile)
    if (currentUser?.id) {
      formData.append("userId", currentUser.id)
    }
    formData.append("socialInteId", selectedFanpage)
    // TODO: Get selected channelId from header/global state
    formData.append("channelId", "1")
    const selectedBusinessField = businessFields.find((field) => field.id.toString() === businessType)
    formData.append("businessFieldName", selectedBusinessField ? selectedBusinessField.name : customBusinessType)

    await createScheduleFromExcel(formData)
  }

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Đăng bài viết tự động bằng AI</h1>
          <p className="text-muted-foreground mt-2">
            Tự động tạo và đăng bài viết chất lượng cao lên Facebook Page hoặc Website của bạn với sự hỗ trợ của AI.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Cấu hình dịch vụ</CardTitle>
                <CardDescription>Tùy chỉnh dịch vụ đăng bài tự động theo nhu cầu của bạn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-1"> {/* grid-cols-2 */}
                    <TabsTrigger value="template">Mẫu nội dung</TabsTrigger>
                    {/* <TabsTrigger value="custom">Tùy chỉnh</TabsTrigger> */}
                  </TabsList>
                  <TabsContent value="template" className="space-y-4 pt-4">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Kết nối tài khoản Facebook</Label>
                      <div className="flex items-center gap-2">
                        <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingAccounts ? "Đang tải..." : "Các tài khoản đã kết nối"} />
                          </SelectTrigger>
                          <SelectContent>
                            {connectedAccounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button onClick={handleAddConnection} type="button">
                          Thêm Kết nối
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Chọn Fanpage</Label>
                      <Select
                        value={selectedFanpage}
                        onValueChange={setSelectedFanpage}
                        disabled={!selectedAccount || loadingFanpages}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={loadingFanpages ? "Đang tải..." : "Chọn Fanpage"} />
                        </SelectTrigger>
                        <SelectContent>
                          {userFacebookPages.map((page) => (
                            <SelectItem key={page.id} value={page.id}>
                              {page.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                    <div className="grid gap-2">
                      <Label htmlFor="business-type">Lĩnh vực kinh doanh</Label>
                      <Select value={businessType} onValueChange={setBusinessType} disabled={loadingBusinessFields}>
                        <SelectTrigger id="business-type">
                          <SelectValue placeholder={loadingBusinessFields ? "Đang tải..." : "Chọn lĩnh vực kinh doanh"} />
                        </SelectTrigger>
                        <SelectContent>
                          {businessFields.map((field) => (
                            <SelectItem key={field.id} value={field.id.toString()}>
                              {field.name}
                            </SelectItem>
                          ))}
                          <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                      </Select>
                      {businessType === "other" && (
                        <Input
                          className="mt-2"
                          placeholder="Nhập lĩnh vực kinh doanh của bạn"
                          value={customBusinessType}
                          onChange={(e) => setCustomBusinessType(e.target.value)}
                        />
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4 pt-4">
                    <div className="grid gap-2">
                      <Label htmlFor="custom-content">Nội dung tùy chỉnh</Label>
                      <Textarea
                        id="custom-content"
                        placeholder="Nhập nội dung tùy chỉnh cho bài đăng của bạn..."
                        className="min-h-[150px]"
                      />
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="posts-per-day">Số lần đăng / ngày</Label>
                    <Select value={postsPerDay.toString()} onValueChange={handlePostsPerDayChange}>
                      <SelectTrigger id="posts-per-day">
                        <SelectValue placeholder="Chọn số lần" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 lần</SelectItem>
                        <SelectItem value="2">2 lần</SelectItem>
                        <SelectItem value="3">3 lần</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    {[...Array(postsPerDay)].map((_, index) => (
                      <div className="grid gap-2" key={index}>
                        <Label htmlFor={`posting-time-${index}`}>Giờ đăng lần {index + 1}</Label>
                        <Input
                          id={`posting-time-${index}`}
                          type="time"
                          value={postingTimes[index]}
                          onChange={(e) => handlePostingTimeChange(index, e.target.value)}
                        />
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label>Ngày bắt đầu</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, "dd/MM/yyyy") : <span>Chọn ngày bắt đầu</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={handleStartDateSelect}
                            disabled={{ before: new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="grid gap-2">
                      <Label>Ngày kết thúc</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant={"outline"} className="w-full justify-start text-left font-normal">
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, "dd/MM/yyyy") : <span>Chọn ngày kết thúc</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={handleEndDateSelect}
                            disabled={{ before: startDate || new Date() }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Nội dung bài đăng</Label>
                    <Button
                      variant="outline"
                      onClick={handleGenerateExcel}
                      type="button"
                      className="w-full mb-2"
                      disabled={isGeneratingExcel}
                    >
                      {isGeneratingExcel ? "Đang tạo..." : "Tạo file Excel mẫu"}
                    </Button>
                    <Input
                      id="excel-upload"
                      type="file"
                      onChange={handleFileChange}
                      accept=".xlsx, .xls"
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Tải lên file Excel chứa nội dung và từ khóa cho bài đăng.
                    </p>
                  </div>

                  
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" asChild>
                  <Link href="/">Hủy</Link>
                </Button>
                <Button onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Đang xử lý..." : "Lên lịch bài viết"}
                </Button>
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
                  <span className="font-semibold">Đăng bài viết tự động bằng AI</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số lần đăng/ngày:</span>
                  <span className="font-semibold">{postsPerDay}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số ngày đăng:</span>
                  <span className="font-semibold">{numberOfPostingDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium">Số dư hiện tại:</span>
                  <span className="font-semibold text-primary">{currentBalance} Xu</span>
                </div>
                {currentBalance < postsPerDay * numberOfPostingDays * 3 && (
                  <p className="text-sm text-red-600">Số dư của bạn không đủ, hãy nạp thêm xu</p>
                )}
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Tổng cộng:</span>
                    <span className="text-lg">{postsPerDay * numberOfPostingDays * 3} Xu</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button className="w-full" onClick={handleUpload} disabled={isUploading}>
                  {isUploading ? "Đang xử lý..." : "Lên lịch bài viết"}
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
                    <p>Chọn lĩnh vực kinh doanh để AI tạo nội dung phù hợp hoặc tùy chỉnh nội dung theo ý bạn.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Thiết lập thời gian và tần suất đăng bài để tự động hóa quy trình.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Thêm từ khóa liên quan để AI tạo nội dung tối ưu SEO và phù hợp với đối tượng mục tiêu.</p>
                  </div>
                  <div className="flex gap-2">
                    <Info className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <p>Kết nối API Facebook hoặc Website để hệ thống tự động đăng bài.</p>
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
