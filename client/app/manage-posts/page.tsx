"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { 
  Table, TableBody, TableCell, 
  TableHead, TableHeader, TableRow 
} from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { toast } from "@/hooks/use-toast"
import { 
  Edit, MoreHorizontal, Plus, Trash, X, Calendar, 
  Image as ImageIcon, FileText, Clock, Loader2, Upload,
  ChevronLeft, ChevronRight
} from "lucide-react"
import axios from "axios"
import { useSelector } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { format } from "date-fns"

interface ConnectedAccount {
  id: string
  name: string
}

interface Post {
  id: number;
  postId: number;
  title: string;
  body: string;
  images?: {
    id: number;
    imageUrl: string;
  }[];
  status: Status;
  scheduledDate: string;
  scheduledHour: string;
  socialIntegrationName: string;
}

interface Status {
  id: number
  type: string
  name: string
}

interface PostScheduleData {
  businessFieldName: string
  userId: string
  channelId: string
  socialInteId: string
  excelFileName: string
  excelFileData: string
  socialIntegrationName: string
  startDate: string
  endDate: string
  postsPerDay: number
  postingTimes: string[]
}

interface SocialIntegration {
  id: number
  integrationName: string
}

export default function ManagePostsPage() {
  const { currentUser } = useSelector((state: RootState) => state.user)
  const router = useRouter()
  const searchParams = useSearchParams()
  const newSchedule = searchParams.get('newSchedule')

  const [posts, setPosts] = useState<Post[]>([])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [socialIntegrations, setSocialIntegrations] = useState<SocialIntegration[]>([])
  const [selectedSocialId, setSelectedSocialId] = useState<number | null>(null)
  
  // New state for Facebook connection
  const [connectedAccounts, setConnectedAccounts] = useState<ConnectedAccount[]>([])
  const [loadingAccounts, setLoadingAccounts] = useState(true)
  const [selectedAccount, setSelectedAccount] = useState<string>("")
  const [loadingFanpages, setLoadingFanpages] = useState(false)

  const [loading, setLoading] = useState(true)
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPosts, setTotalPosts] = useState(0)
  const [limit, setLimit] = useState(10) // Or any default value
  
  // Dialog states
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isNewScheduleDialogOpen, setIsNewScheduleDialogOpen] = useState(false)
  
  // Edit post states
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledHour, setScheduledHour] = useState("")
  
  // Image management states
  const [currentImages, setCurrentImages] = useState<{id: number, imageUrl: string}[]>([])
  const [newImages, setNewImages] = useState<File[]>([])
  const [imagesToRemove, setImagesToRemove] = useState<number[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)
  
  // New schedule states
  const [scheduleData, setScheduleData] = useState<PostScheduleData | null>(null)
  const [scheduleImages, setScheduleImages] = useState<File[]>([])
  const [isCreatingSchedule, setIsCreatingSchedule] = useState(false)

  const handleApiError = useCallback((error: any, defaultMessage: string) => {
    console.error("API Error:", error)
    
    if (error.response?.status === 401) {
      toast({
        title: "Phiên đăng nhập hết hạn",
        description: "Vui lòng đăng nhập lại để tiếp tục.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }
    
    const errorMessage = error.response?.data?.error || error.response?.data?.message || error.message || defaultMessage
    toast({
      title: "Có lỗi xảy ra",
      description: errorMessage,
      variant: "destructive",
    })
  }, [router])

  // Fetch accounts and statuses on mount
  useEffect(() => {
    if (!currentUser) {
      toast({
        title: "Yêu cầu đăng nhập",
        description: "Vui lòng đăng nhập để quản lý bài đăng.",
        variant: "destructive",
      })
      router.push("/auth/login")
      return
    }

    const fetchInitialData = async () => {
      try {
        setLoadingAccounts(true)
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888'

        const [accountRes, statusRes] = await Promise.all([
            axios.get(`${apiUrl}/third-account/get-by-user/${currentUser.id}`, { withCredentials: true }),
            axios.get(`${apiUrl}/status`, { withCredentials: true }),
        ]);

        if (accountRes.data.success) {
            const accountData = accountRes.data.data;
            setConnectedAccounts(accountData);
            if (accountData.length > 0 && !selectedAccount) {
                // Select the first account by default
                setSelectedAccount(accountData[0].id)
            }
        } else {
            console.warn("Failed to fetch connected accounts.");
            setConnectedAccounts([]);
        }

        if (statusRes.data.success) {
            setStatuses(statusRes.data.data);
        } else {
            console.warn("Failed to fetch statuses.");
            setStatuses([]);
        }

      } catch (error) {
        handleApiError(error, "Không thể tải dữ liệu ban đầu.")
      } finally {
        setLoadingAccounts(false)
      }
    }

    fetchInitialData();
  }, [currentUser, router, handleApiError]);

  // Fetch fanpages when selectedAccount changes
  useEffect(() => {
    if (!selectedAccount) {
      setSocialIntegrations([])
      setSelectedSocialId(null)
      return;
    };

    const fetchFanpages = async () => {
      try {
        setLoadingFanpages(true);
        setSocialIntegrations([]); // Reset previous list
        setSelectedSocialId(null); // Reset selection
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';
        const socialRes = await axios.get(`${apiUrl}/third-account/social/get-by-user/${selectedAccount}`, { withCredentials: true });

        if (socialRes.data.success) {
            const socialData = socialRes.data.data;
            setSocialIntegrations(socialData);
            if (socialData.length > 0) {
              // Select the first fanpage by default
              setSelectedSocialId(socialData[0].id);
            }
        } else {
            console.warn("Failed to fetch social integrations.");
        }
      } catch (error) {
        handleApiError(error, "Không thể tải danh sách Fanpage.");
        setSocialIntegrations([]);
      } finally {
        setLoadingFanpages(false);
      }
    }

    fetchFanpages();
  }, [selectedAccount, handleApiError]);

  const fetchPosts = useCallback(async (socialId: number, page: number, limit: number) => {
    try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8888';
        const postRes = await axios.get(`${apiUrl}/post/get-by-social/${socialId}`, {
            params: { page, limit },
            withCredentials: true,
        });

        if (postRes.data.success) {
            setPosts(postRes.data.data.items);
            setTotalPages(postRes.data.data.totalPages);
            setTotalPosts(postRes.data.data.total);
            setCurrentPage(postRes.data.data.page);
        } else {
            console.warn("Failed to fetch posts.");
            setPosts([]);
        }
    } catch (error) {
        handleApiError(error, "Không thể tải danh sách bài đăng.");
        setPosts([]); // Clear posts on error
    } finally {
        setLoading(false);
    }
  }, [handleApiError]); // Dependencies for useCallback

  // Fetch posts when selectedSocialId or pagination changes
  useEffect(() => {
    if (selectedSocialId) {
      fetchPosts(selectedSocialId, currentPage, limit);
    } else {
      // Clear posts if no fanpage is selected
      setPosts([]);
      setTotalPages(1);
      setTotalPosts(0);
      setCurrentPage(1);
    }
  }, [selectedSocialId, currentPage, limit, fetchPosts]);

  // Effect for handling new schedule from local storage
  useEffect(() => {
    const storedData = localStorage.getItem('postScheduleData')
    if (storedData && newSchedule === 'true') {
      try {
        const data = JSON.parse(storedData) as PostScheduleData
        setScheduleData(data)
        setIsNewScheduleDialogOpen(true)
        // Remove the query param to prevent reopening on refresh
        router.replace('/manage-posts')
      } catch (e) {
        console.error("Error parsing schedule data:", e)
      }
    }
  }, [newSchedule, router]);

  const handleDeletePost = async (postId: number) => {
    if (!selectedSocialId) return

    const confirmed = window.confirm("Bạn có chắc chắn muốn xóa bài đăng này không?")
    if (confirmed) {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"
        const response = await axios.delete(`${apiUrl}/post/${postId}`, { withCredentials: true })

        if (response.data.success) {
          toast({
            title: "Xóa thành công",
            description: "Bài đăng đã được xóa.",
          })
          fetchPosts(selectedSocialId, currentPage, limit) // Refresh the list
        } else {
          throw new Error(response.data.message || "Không thể xóa bài đăng.")
        }
      } catch (error) {
        handleApiError(error, "Đã xảy ra lỗi khi xóa bài đăng.")
      }
    }
  }

  const handleEditPost = (post: Post) => {
    setEditingPost(post)
    setTitle(post.title)
    setContent(post.body)
    setScheduledDate(post.scheduledDate)
    setScheduledHour(post.scheduledHour)
    setIsEditDialogOpen(true)
  }

  const handleManageImages = (post: Post) => {
    setEditingPost(post)
    setCurrentImages(post.images || [])
    setNewImages([])
    setImagesToRemove([])
    setIsImageDialogOpen(true)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setNewImages(Array.from(e.target.files))
    }
  }

  const handleScheduleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setScheduleImages(Array.from(e.target.files))
    }
  }

  const removeImage = (imageId: number) => {
    setImagesToRemove([...imagesToRemove, imageId])
    setCurrentImages(currentImages.filter(img => img.id !== imageId))
  }

  const removeNewImage = (index: number) => {
    setNewImages(newImages.filter((_, i) => i !== index))
  }

  const removeScheduleImage = (index: number) => {
    setScheduleImages(scheduleImages.filter((_, i) => i !== index))
  }

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPost) return

    setIsUploadingImages(true) // Use this for loading state
    const formData = new FormData()

    // Append text data
    formData.append("title", title)
    formData.append("body", content)
    
    // Append image data
    imagesToRemove.forEach(id => formData.append("imagesToRemove[]", String(id)))
    newImages.forEach(file => formData.append("images", file))

    // We don't need scheduledDate and scheduledHour for content template
    
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"
      // The ID is the content template ID, which is correct here.
      const response = await axios.put(
        `${apiUrl}/content-template/${editingPost.id}`,
        formData,
        { 
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      )

      if (response.data.success) {
        toast({
          title: "Cập nhật thành công",
          description: "Nội dung bài đăng đã được cập nhật.",
        })
        setIsEditDialogOpen(false)
        setIsImageDialogOpen(false) // Close both dialogs
        if (selectedSocialId) {
          fetchPosts(selectedSocialId, currentPage, limit) // Refresh
        }
      } else {
        throw new Error(response.data.message || "Không thể cập nhật bài đăng.")
      }
    } catch (error) {
      handleApiError(error, "Đã xảy ra lỗi khi cập nhật bài đăng.")
    } finally {
      setIsUploadingImages(false)
    }
  }

  const handleCreateSchedule = async () => {
    if (!scheduleData) {
      toast({
        title: "Lỗi",
        description: "Không có dữ liệu lịch trình để tạo.",
        variant: "destructive",
      })
      return
    }
    setIsCreatingSchedule(true)

    const formData = new FormData()
    // Convert data URL back to Blob
    const res = await fetch(scheduleData.excelFileData)
    const blob = await res.blob()
    const excelFile = new File([blob], scheduleData.excelFileName, { type: blob.type })

    formData.append("file", excelFile)
    formData.append("userId", scheduleData.userId)
    formData.append("channelId", scheduleData.channelId)
    formData.append("socialInteId", scheduleData.socialInteId)
    scheduleImages.forEach(file => formData.append("images", file))

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8888"
      const response = await axios.post(`${apiUrl}/auto-post/create-by-excel`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data.success) {
        toast({
          title: "Tạo lịch thành công",
          description: "Lịch đăng bài của bạn đã được tạo thành công.",
        })
        setIsNewScheduleDialogOpen(false)
        localStorage.removeItem("postScheduleData") // Clean up
        if (selectedSocialId) {
          fetchPosts(selectedSocialId, currentPage, limit) // Refresh
        }
      } else {
        throw new Error(response.data.message || "Không thể tạo lịch đăng.")
      }
    } catch (error) {
      handleApiError(error, "Đã xảy ra lỗi khi tạo lịch đăng.")
    } finally {
      setIsCreatingSchedule(false)
    }
  }

  const navigateToCreatePost = () => {
    router.push("/services/auto-posting")
  }

  const getStatusBadgeColor = (status: Status) => {
    switch (status.name) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'failed':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusDisplayName = (status: Status) => {
    switch (status.name) {
      case 'success':
        return 'Đã đăng'
      case 'pending':
        return 'Chờ đăng'
      case 'failed':
        return 'Thất bại'
      case 'draft':
        return 'Bản nháp'
      default:
        return status.name
    }
  }

  const formatDateTime = (date: string, hour: string) => {
    try {
      const dateTime = new Date(`${date}T${hour}`)
      return format(dateTime, 'dd/MM/yyyy HH:mm')
    } catch (error) {
      return `${date} ${hour}`
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
        setCurrentPage(newPage);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-6 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-2xl font-bold">Quản lý bài đăng</h1>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="w-64">
                <Select
                  onValueChange={setSelectedAccount}
                  value={selectedAccount}
                  disabled={loadingAccounts}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tài khoản..." />
                  </SelectTrigger>
                  <SelectContent>
                    {loadingAccounts ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      connectedAccounts.map((acc) => (
                        <SelectItem key={acc.id} value={acc.id}>
                          {acc.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-64">
                <Select
                  onValueChange={(value) => setSelectedSocialId(Number(value))}
                  value={selectedSocialId?.toString() ?? ""}
                  disabled={loadingFanpages || !selectedAccount}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn Fanpage..." />
                  </SelectTrigger>
                  <SelectContent>
                  {loadingFanpages ? (
                      <div className="flex items-center justify-center p-2">
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        <span>Đang tải...</span>
                      </div>
                    ) : (
                      socialIntegrations.map((integration) => (
                        <SelectItem key={integration.id} value={integration.id.toString()}>
                          {integration.integrationName}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={navigateToCreatePost} disabled={!selectedSocialId}>
              <Plus className="w-4 h-4 mr-2" />
              Tạo lịch đăng mới
            </Button>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[5%]">STT</TableHead>
                  <TableHead className="w-[10%]">Ảnh</TableHead>
                  <TableHead className="w-[30%]">Tiêu đề</TableHead>
                  <TableHead className="w-[20%]">Ngày đăng</TableHead>
                  <TableHead className="w-[15%]">Trạng thái</TableHead>
                  <TableHead className="w-[10%] text-right">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((post, index) => (
                  <TableRow key={post.postId}>
                    <TableCell>{(currentPage - 1) * limit + index + 1}</TableCell>
                    <TableCell>
                      {post.images && post.images.length > 0 ? (
                        <Image
                          src={post.images[0].imageUrl}
                          alt={post.title}
                          width={64}
                          height={64}
                          className="object-cover rounded-md"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-16 w-16 bg-muted rounded-md">
                          <ImageIcon className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{formatDateTime(post.scheduledDate, post.scheduledHour)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadgeColor(post.status)}>
                        {getStatusDisplayName(post.status)}
                      </Badge>
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
                          <DropdownMenuItem onClick={() => handleEditPost(post)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Sửa chi tiết</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleManageImages(post)}>
                            <ImageIcon className="mr-2 h-4 w-4" />
                            <span>Quản lý ảnh</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeletePost(post.postId)} className="text-red-600">
                            <Trash className="mr-2 h-4 w-4" />
                            <span>Xóa</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <div>
                  <p className="text-sm text-gray-700">
                      Hiển thị từ <span className="font-medium">{(currentPage - 1) * limit + 1}</span> đến <span className="font-medium">{Math.min(currentPage * limit, totalPosts)}</span> trong tổng số <span className="font-medium">{totalPosts}</span> bài đăng
                  </p>
              </div>
              <div className="flex items-center space-x-2">
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                  >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="ml-2">Trang trước</span>
                  </Button>
                  <Button
                      variant="outline"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                  >
                     <span className="mr-2">Trang sau</span>
                     <ChevronRight className="h-4 w-4" />
                  </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài đăng</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Tiêu đề</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề bài đăng"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Nội dung</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung bài đăng"
                className="min-h-[200px]"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="scheduled-date">Ngày đăng</Label>
                <Input
                  id="scheduled-date"
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scheduled-time">Giờ đăng</Label>
                <Input
                  id="scheduled-time"
                  type="time"
                  value={scheduledHour}
                  onChange={(e) => setScheduledHour(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit">
                Cập nhật
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Image Management Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Quản lý hình ảnh</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Hình ảnh hiện tại</Label>
              {currentImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                  {currentImages.map((img) => (
                    <div key={img.id} className="relative h-32 rounded-md overflow-hidden">
                      <Image 
                        src={img.imageUrl} 
                        alt="Current image" 
                        fill 
                        className="object-cover" 
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeImage(img.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Không có hình ảnh</p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="images">Thêm hình ảnh mới</Label>
              <Input
                id="images"
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                multiple
              />
              
              {newImages.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {Array.from(newImages).map((file, index) => (
                    <div key={index} className="relative h-32 rounded-md overflow-hidden">
                      <Image 
                        src={URL.createObjectURL(file)} 
                        alt="New image preview" 
                        fill 
                        className="object-cover" 
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-1 right-1 h-6 w-6"
                        onClick={() => removeNewImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsImageDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmitEdit} disabled={isUploadingImages}>
                {isUploadingImages ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Đang cập nhật...
                  </>
                ) : (
                  'Cập nhật'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* New Schedule Dialog */}
      <Dialog open={isNewScheduleDialogOpen} onOpenChange={setIsNewScheduleDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Tạo lịch đăng mới</DialogTitle>
          </DialogHeader>
          
          {scheduleData && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Lĩnh vực:</strong> {scheduleData.businessFieldName}
                </div>
                <div>
                  <strong>Nền tảng:</strong> {scheduleData.socialIntegrationName}
                </div>
                <div>
                  <strong>Từ ngày:</strong> {scheduleData.startDate}
                </div>
                <div>
                  <strong>Đến ngày:</strong> {scheduleData.endDate}
                </div>
                <div>
                  <strong>Bài/ngày:</strong> {scheduleData.postsPerDay}
                </div>
                <div>
                  <strong>File Excel:</strong> {scheduleData.excelFileName}
                </div>
              </div>
              
              <div>
                <strong>Giờ đăng:</strong> {scheduleData.postingTimes.join(', ')}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="schedule-images">Thêm hình ảnh (tùy chọn)</Label>
                <Input
                  id="schedule-images"
                  type="file"
                  onChange={handleScheduleImageChange}
                  accept="image/*"
                  multiple
                />
                
                {scheduleImages.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-2">
                    {Array.from(scheduleImages).map((file, index) => (
                      <div key={index} className="relative h-24 rounded-md overflow-hidden">
                        <Image 
                          src={URL.createObjectURL(file)} 
                          alt="Schedule image preview" 
                          fill 
                          className="object-cover" 
                        />
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-5 w-5"
                          onClick={() => removeScheduleImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsNewScheduleDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleCreateSchedule} disabled={isCreatingSchedule}>
                  {isCreatingSchedule ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Đang tạo...
                    </>
                  ) : (
                    'Tạo lịch đăng'
                  )}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}