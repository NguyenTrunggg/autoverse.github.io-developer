"use client"

import type React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"

// Mock data for payment history
const paymentHistory = [
  {
    id: "PAY-001",
    customerName: "Nguyễn Văn A",
    date: "2023-10-26",
    amount: 500000,
    xuAmount: 500,
    status: "Thành công",
    method: "Admin nạp",
  },
  {
    id: "PAY-002",
    customerName: "Trần Thị B",
    date: "2023-10-25",
    amount: 200000,
    xuAmount: 200,
    status: "Thành công",
    method: "Chuyển khoản",
  },
  {
    id: "PAY-003",
    customerName: "Lê Văn C",
    date: "2023-10-25",
    amount: 1000000,
    xuAmount: 1000,
    status: "Đang xử lý",
    method: "Tiền mặt",
  },
  {
    id: "PAY-004",
    customerName: "Phạm Thị D",
    date: "2023-10-24",
    amount: 100000,
    xuAmount: 100,
    status: "Thất bại",
    method: "Admin nạp",
  },
];

export default function PaymentHistoryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Lịch sử nạp tiền</h1>
      <Card>
        <CardHeader>
          <CardTitle>Giao dịch gần đây</CardTitle>
          <CardDescription>Xem lại lịch sử các giao dịch nạp tiền của khách hàng.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã GD</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Ngày giao dịch
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Số tiền (VNĐ)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="p-0 hover:bg-transparent">
                    Số Xu
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Phương thức</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.id}</TableCell>
                  <TableCell>{payment.customerName}</TableCell>
                  <TableCell>{payment.date}</TableCell>
                  <TableCell className="text-right">{payment.amount.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{payment.xuAmount}</TableCell>
                  <TableCell>{payment.method}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        payment.status === "Thành công"
                          ? "default"
                          : payment.status === "Đang xử lý"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
} 