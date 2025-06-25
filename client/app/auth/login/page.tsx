"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Icons } from "@/components/ui/icons"
import { Eye, EyeOff } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { loginSuccess } from "@/lib/redux/userSlice"

const formSchema = z.object({
  email: z.string().email("Email không hợp lệ"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 ký tự").optional(),
  name: z.string().min(2, "Tên phải có ít nhất 2 ký tự").optional(),
  address: z.string().min(5, "Địa chỉ phải có ít nhất 5 ký tự").optional(),
})

type FormData = z.infer<typeof formSchema>

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const { toast } = useToast()
  const router = useRouter()
  const dispatch = useDispatch()

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: undefined,
      name: undefined,
      address: undefined,
    },
    mode: "onChange",
  })

  async function onSubmit(data: FormData) {
    setIsLoading(true)
    try {
      if (!isLogin) {
        if (!data.name || !data.email || !data.phoneNumber || !data.address || !data.password) {
          toast({
            title: "Thông tin không đầy đủ",
            description: "Vui lòng điền đầy đủ tất cả các trường thông tin để đăng ký.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }
      const payload = isLogin
        ? { email: data.email, password: data.password }
        : {
            email: data.email,
            password: data.password,
            phone: data.phoneNumber,
            name: data.name,
            address: data.address,
          }

      const endpoint = isLogin ? "/auth/login" : "/auth/register"

      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, payload, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })

      const result = response.data
      console.log("Server response data (result):", result)

      if (isLogin) {
        if (response.status === 200 && result?.success && result.data?.user) {
          // Dispatch loginSuccess action with user data from API
          dispatch(loginSuccess(result.data.user))

          toast({
            title: "Đăng nhập thành công!",
            description: "Chào mừng bạn trở lại.",
          })

          const userRole = result.data.user.role?.id
          if (typeof userRole === "number") {
            if (userRole === 1) {
              router.push("/admin")
            } else {
              router.push("/")
            }
          } else {
            router.push("/")
          }
        } else {
          throw new Error(result?.message || "Đăng nhập không thành công. Dữ liệu trả về không hợp lệ.")
        }
      } else {
        // Registration
        if (response.status === 200 && result?.success && result.data) {
          toast({
            title: "Đăng ký thành công!",
            description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
          })
          setIsLogin(true)
          form.reset({
            email: data.email,
            password: "",
            name: undefined,
            phoneNumber: undefined,
            address: undefined,
          })
        } else {
          throw new Error(result?.message || "Đăng ký không thành công. Dữ liệu trả về không hợp lệ.")
        }
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        (isLogin ? "Đăng nhập thất bại. Vui lòng thử lại." : "Đăng ký thất bại. Vui lòng thử lại.")
      toast({
        title: "Có lỗi xảy ra",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-white">
          {isLogin ? "Đăng nhập vào tài khoản" : "Tạo tài khoản mới"}
        </h1>
        <p className="text-sm text-gray-200">
          {isLogin
            ? "Nhập email và mật khẩu để đăng nhập"
            : "Nhập thông tin cá nhân để tạo tài khoản"}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-100">Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isLoading}
                    placeholder="name@example.com"
                    type="email"
                    className="bg-gray-700/50 border-gray-500 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
                  />
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <div className={isLogin ? "hidden" : ""}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Họ và tên</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                      placeholder="Nguyễn Văn A"
                      type="text"
                      className="bg-gray-700/50 border-gray-500 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Số điện thoại</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                      placeholder="0123456789"
                      type="tel"
                      className="bg-gray-700/50 border-gray-500 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-100">Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      disabled={isLoading}
                      placeholder="Tân Mai, Hoàng Mai, Hà Nội"
                      type="text"
                      className="bg-gray-700/50 border-gray-500 text-white placeholder:text-gray-400 focus:border-sky-400 focus:ring-sky-400"
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-100">Mật khẩu</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      disabled={isLoading}
                      type={showPassword ? "text" : "password"}
                      className="bg-gray-700/50 border-gray-500 text-white placeholder:text-gray-400 pr-10 focus:border-sky-400 focus:ring-sky-400"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-gray-600/50 text-gray-300 hover:text-white"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage className="text-red-400" />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-sky-500 hover:bg-sky-600 text-white"
            disabled={isLoading}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </Button>
        </form>
      </Form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-gray-500" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-transparent px-2 text-gray-200">
            Hoặc tiếp tục với
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => {}} // TODO: Implement Google login
          className="w-full bg-red-500 hover:bg-red-600 text-white border-transparent"
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </Button>
        <Button
          variant="outline"
          disabled={isLoading}
          onClick={() => {}} // TODO: Implement Facebook login
          className="w-full bg-[#1877F2] hover:bg-[#166eeb] text-white border-transparent"
        >
          <Icons.facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>

      <div className="text-center text-sm text-gray-200">
        {isLogin ? (
          <p>
            Chưa có tài khoản?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-sky-400 hover:text-sky-300"
              onClick={() => setIsLogin(false)}
            >
              Đăng ký
            </Button>
          </p>
        ) : (
          <p>
            Đã có tài khoản?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-sky-400 hover:text-sky-300"
              onClick={() => setIsLogin(true)}
            >
              Đăng nhập
            </Button>
          </p>
        )}
      </div>
    </div>
  )
}
