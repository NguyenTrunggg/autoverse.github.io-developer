import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Package, MessageSquare, ArrowUpRight, ArrowDownRight, DollarSign, Activity } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="text-sm text-muted-foreground">
          Cập nhật lần cuối: {new Date().toLocaleDateString("vi-VN", { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng khách hàng</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12%
              </span>
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doanh thu tháng</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24,500,000đ</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                18%
              </span>
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dịch vụ đang hoạt động</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3,782</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-green-500 flex items-center mr-1">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                7%
              </span>
              so với tháng trước
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tương tác chatbot</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">42,893</div>
            <p className="text-xs text-muted-foreground flex items-center mt-1">
              <span className="text-red-500 flex items-center mr-1">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3%
              </span>
              so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Doanh thu theo thời gian</CardTitle>
            <CardDescription>Biểu đồ doanh thu 6 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-md">
              <Activity className="h-16 w-16 text-slate-200" />
            </div>
          </CardContent>
        </Card>
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Dịch vụ phổ biến</CardTitle>
            <CardDescription>Thống kê dịch vụ được sử dụng nhiều nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Chatbot tự động</span>
                    <span className="text-sm font-medium">45%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "45%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Đăng bài tự động</span>
                    <span className="text-sm font-medium">32%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "32%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Gửi tin nhắn tự động</span>
                    <span className="text-sm font-medium">18%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "18%" }}></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Dịch vụ khác</span>
                    <span className="text-sm font-medium">5%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "5%" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Khách hàng mới gần đây</CardTitle>
            <CardDescription>10 khách hàng đăng ký gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Tên</div>
                <div>Ngày đăng ký</div>
                <div className="text-right">Trạng thái</div>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-3 text-sm">
                  <div className="font-medium">Nguyễn Văn {String.fromCharCode(64 + i)}</div>
                  <div>{new Date(2023, 5, 20 - i).toLocaleDateString("vi-VN")}</div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        i % 3 === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : i % 2 === 0
                            ? "bg-green-100 text-green-800"
                            : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {i % 3 === 0 ? "Chưa kích hoạt" : i % 2 === 0 ? "Đã kích hoạt" : "Đang dùng thử"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-center">
                <Link href="/admin/customers" className="text-sm text-primary hover:underline">
                  Xem tất cả khách hàng
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Giao dịch gần đây</CardTitle>
            <CardDescription>10 giao dịch gần đây nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 text-sm font-medium text-muted-foreground">
                <div>Khách hàng</div>
                <div>Số tiền</div>
                <div className="text-right">Trạng thái</div>
              </div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="grid grid-cols-3 text-sm">
                  <div className="font-medium">Nguyễn Văn {String.fromCharCode(64 + i)}</div>
                  <div>{(i * 100000).toLocaleString()}đ</div>
                  <div className="text-right">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        i % 4 === 0
                          ? "bg-red-100 text-red-800"
                          : i % 3 === 0
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                      }`}
                    >
                      {i % 4 === 0 ? "Thất bại" : i % 3 === 0 ? "Đang xử lý" : "Thành công"}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-4 text-center">
                <Link href="/admin/payments/history" className="text-sm text-primary hover:underline">
                  Xem tất cả giao dịch
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
