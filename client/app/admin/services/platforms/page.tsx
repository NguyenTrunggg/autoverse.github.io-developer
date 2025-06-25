"use client"

import { useState, useEffect } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface Platform {
  _id: string
  name: string
  description: string
  active: boolean
  createdAt: string
}

// Mock data for service platforms
const mockPlatforms: Platform[] = [
  { _id: "1", name: "Facebook", description: "Nền tảng mạng xã hội Facebook.", active: true, createdAt: new Date().toISOString() },
  { _id: "2", name: "Website", description: "Nền tảng website cá nhân hoặc doanh nghiệp.", active: true, createdAt: new Date().toISOString() },
  { _id: "3", name: "Zalo", description: "Ứng dụng nhắn tin Zalo.", active: true, createdAt: new Date().toISOString() },
  { _id: "4", name: "Telegram", description: "Ứng dụng nhắn tin Telegram.", active: false, createdAt: new Date().toISOString() },
  { _id: "5", name: "Shopee", description: "Sàn thương mại điện tử Shopee.", active: true, createdAt: new Date().toISOString() },
  { _id: "6", name: "Email", description: "Nền tảng gửi và nhận email.", active: true, createdAt: new Date().toISOString() },
  { _id: "7", name: "SMS", description: "Dịch vụ tin nhắn ngắn.", active: false, createdAt: new Date().toISOString() },
]

export default function ServicePlatformsPage() {
  const [platforms, setPlatforms] = useState<Platform[]>(mockPlatforms)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentPlatform, setCurrentPlatform] = useState<Platform | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    active: true,
  })

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormState((prevState) => ({ ...prevState, [name]: value }))
  }

  const handleSwitchChange = (checked: boolean) => {
    setFormState((prevState) => ({ ...prevState, active: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      if (currentPlatform) {
        // Update existing platform
        setPlatforms(platforms.map(p => p._id === currentPlatform._id ? { ...p, ...formState } : p))
        toast.success("Nền tảng dịch vụ đã được cập nhật thành công.")
      } else {
        // Create new platform
        const newPlatform: Platform = {
          _id: (Math.random() * 10000).toString(),
          ...formState,
          createdAt: new Date().toISOString(),
        }
        setPlatforms([...platforms, newPlatform])
        toast.success("Nền tảng dịch vụ đã được tạo thành công.")
      }
      setOpen(false)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast.error("Đã xảy ra lỗi khi gửi biểu mẫu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (platform: Platform) => {
    setCurrentPlatform(platform)
    setFormState({
      name: platform.name,
      description: platform.description,
      active: platform.active,
    })
    setOpen(true)
  }

  const handleCreate = () => {
    setCurrentPlatform(null)
    setFormState({
      name: "",
      description: "",
      active: true,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
     // Simulate API call
     await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      setPlatforms(platforms.filter(p => p._id !== id))
      toast.success("Nền tảng dịch vụ đã được xóa thành công.")
    } catch (error) {
      console.error("Error deleting platform:", error)
      toast.error("Đã xảy ra lỗi khi xóa nền tảng dịch vụ.")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Nền tảng Dịch vụ</h1>
        <Button onClick={handleCreate}>Tạo Nền tảng mới</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentPlatform ? "Chỉnh sửa Nền tảng" : "Tạo Nền tảng mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên nền tảng
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formState.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formState.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Kích hoạt
                </Label>
                <Switch
                  id="active"
                  checked={formState.active}
                  onCheckedChange={handleSwitchChange}
                />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Đang lưu..."
                  : currentPlatform
                    ? "Lưu thay đổi"
                    : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Nền tảng</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {platforms.length > 0 ? (
              platforms.map((platform) => (
                <TableRow key={platform._id}>
                  <TableCell className="font-medium">{platform.name}</TableCell>
                  <TableCell>{platform.description}</TableCell>
                  <TableCell>
                    {platform.active ? "Kích hoạt" : "Vô hiệu hóa"}
                  </TableCell>
                  <TableCell>
                    {new Date(platform.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(platform)}
                    >
                      Sửa
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="ml-2">
                          Xóa
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể được hoàn tác. Thao tác này
                            sẽ xóa vĩnh viễn nền tảng dịch vụ khỏi máy chủ.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(platform._id)}
                          >
                            Tiếp tục
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  Không tìm thấy nền tảng dịch vụ nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
