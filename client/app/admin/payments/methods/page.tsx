"use client"

import { useState } from "react"
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

interface PaymentMethod {
  _id: string
  name: string
  description: string
  details: string
  active: boolean
  createdAt: string
}

// Mock data for payment methods
const mockMethods: PaymentMethod[] = [
  { _id: "1", name: "Chuyển khoản ngân hàng", description: "Vietcombank - Chi nhánh ABC", details: "Số tài khoản: 123456789\nTên chủ tài khoản: NGUYEN VAN A\nNội dung: NAPTIEN {USERNAME}", active: true, createdAt: new Date().toISOString() },
  { _id: "2", name: "Ví MoMo", description: "Thanh toán qua ví điện tử MoMo", details: "Số điện thoại: 0987654321\nTên chủ tài khoản: NGUYEN VAN A", active: true, createdAt: new Date().toISOString() },
  { _id: "3", name: "PayPal", description: "Thanh toán quốc tế qua PayPal", details: "paypal.me/youraccount", active: false, createdAt: new Date().toISOString() },
  { _id: "4", name: "ZaloPay", description: "Thanh toán qua ZaloPay", details: "Số điện thoại: 0987654321", active: true, createdAt: new Date().toISOString() },
]

export default function PaymentMethodsPage() {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockMethods)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [open, setOpen] = useState(false)
  const [currentMethod, setCurrentMethod] = useState<PaymentMethod | null>(null)
  const [formState, setFormState] = useState({
    name: "",
    description: "",
    details: "",
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
    await new Promise((resolve) => setTimeout(resolve, 500))

    try {
      if (currentMethod) {
        setMethods(methods.map(m => m._id === currentMethod._id ? { ...currentMethod, ...formState } : m))
        toast.success("Phương thức đã được cập nhật thành công.")
      } else {
        const newMethod: PaymentMethod = {
          _id: (Math.random() * 10000).toString(),
          ...formState,
          createdAt: new Date().toISOString(),
        }
        setMethods([...methods, newMethod])
        toast.success("Phương thức đã được tạo thành công.")
      }
      setOpen(false)
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi gửi biểu mẫu.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (method: PaymentMethod) => {
    setCurrentMethod(method)
    setFormState({
      name: method.name,
      description: method.description,
      details: method.details,
      active: method.active,
    })
    setOpen(true)
  }

  const handleCreate = () => {
    setCurrentMethod(null)
    setFormState({
      name: "",
      description: "",
      details: "",
      active: true,
    })
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    try {
      setMethods(methods.filter(m => m._id !== id))
      toast.success("Phương thức đã được xóa thành công.")
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi xóa phương thức.")
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Phương thức Nạp tiền</h1>
        <Button onClick={handleCreate}>Thêm Phương thức</Button>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {currentMethod ? "Chỉnh sửa Phương thức" : "Tạo Phương thức mới"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Tên phương thức
                </Label>
                <Input id="name" name="name" value={formState.name} onChange={handleInputChange} className="col-span-3" required />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Mô tả ngắn
                </Label>
                <Input id="description" name="description" value={formState.description} onChange={handleInputChange} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="details" className="text-right">
                  Chi tiết
                </Label>
                <Textarea id="details" name="details" value={formState.details} onChange={handleInputChange} className="col-span-3" placeholder="Thông tin tài khoản, hướng dẫn..." />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="active" className="text-right">
                  Kích hoạt
                </Label>
                <Switch id="active" checked={formState.active} onCheckedChange={handleSwitchChange} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Đang lưu..." : currentMethod ? "Lưu thay đổi" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tên Phương thức</TableHead>
              <TableHead>Mô tả</TableHead>
              <TableHead>Chi tiết</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Hành động</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {methods.length > 0 ? (
              methods.map((method) => (
                <TableRow key={method._id}>
                  <TableCell className="font-medium">{method.name}</TableCell>
                  <TableCell>{method.description}</TableCell>
                  <TableCell className="whitespace-pre-wrap">{method.details}</TableCell>
                  <TableCell>
                    {method.active ? "Kích hoạt" : "Vô hiệu hóa"}
                  </TableCell>
                  <TableCell>
                    {new Date(method.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(method)}>Sửa</Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="ml-2">Xóa</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Bạn có chắc chắn muốn xóa?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Hành động này không thể được hoàn tác. Thao tác này sẽ xóa vĩnh viễn phương thức thanh toán.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(method._id)}>
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
                <TableCell colSpan={6} className="text-center">
                  Không tìm thấy phương thức nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
