"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Wallet, Phone, ArrowRight, CheckCircle } from "lucide-react"

export default function PaymentPage() {
  const [amount, setAmount] = useState<number>(10000)
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [xuAmount, setXuAmount] = useState(10)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value.replace(/[^0-9]/g, ""), 10) || 0

    // Enforce min and max limits
    const limitedValue = Math.min(Math.max(value, 10000), 9000000)
    setAmount(limitedValue)

    // Calculate Xu (1000đ = 1 Xu)
    setXuAmount(Math.floor(limitedValue / 1000))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsSuccess(true)
    }, 2000)
  }

  if (isSuccess) {
    return (
      <div className="container py-10">
        <div className="max-w-md mx-auto text-center">
          <div className="flex justify-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4">Nạp tiền thành công!</h1>
          <p className="text-muted-foreground mb-6">
            Bạn đã nạp thành công {amount.toLocaleString()}đ và nhận được {xuAmount} Xu vào tài khoản.
          </p>
          <div className="flex flex-col gap-4">
            <Button asChild>
              <Link href="/user/profile">Xem số dư</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Về trang chủ</Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-6">Nạp tiền</h1>

        <Card>
          <CardHeader>
            <CardTitle>Nạp Xu</CardTitle>
            <CardDescription>Nạp tiền để mua Xu và sử dụng các dịch vụ</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="amount">Số tiền cần nạp (VNĐ)</Label>
                  <Input id="amount" type="text" value={amount.toLocaleString()} onChange={handleAmountChange} />
                  <p className="text-xs text-muted-foreground">Số tiền tối thiểu: 10.000đ, tối đa: 9.000.000đ</p>
                </div>

                <div className="flex items-center justify-between py-4 px-2 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">Số Xu nhận được</p>
                    <p className="text-xs text-muted-foreground">1.000đ = 1 Xu</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{xuAmount}</p>
                    <p className="text-xs text-muted-foreground">Xu</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Phương thức thanh toán</Label>
                  <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="bank">
                        <CreditCard className="h-4 w-4 mr-2" />
                        Ngân hàng
                      </TabsTrigger>
                      <TabsTrigger value="ewallet">
                        <Wallet className="h-4 w-4 mr-2" />
                        Ví điện tử
                      </TabsTrigger>
                      <TabsTrigger value="contact">
                        <Phone className="h-4 w-4 mr-2" />
                        Liên hệ
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="bank" className="space-y-4 pt-4">
                      <div className="space-y-2">
                        <Label htmlFor="bank-select">Chọn ngân hàng</Label>
                        <select
                          id="bank-select"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <option value="vietcombank">Vietcombank</option>
                          <option value="techcombank">Techcombank</option>
                          <option value="bidv">BIDV</option>
                          <option value="vietinbank">Vietinbank</option>
                          <option value="mbbank">MB Bank</option>
                          <option value="tpbank">TPBank</option>
                        </select>
                      </div>
                    </TabsContent>
                    <TabsContent value="ewallet" className="space-y-4 pt-4">
                      <div className="grid grid-cols-3 gap-3">
                        {["Momo", "ZaloPay", "VNPay", "ShopeePay", "Moca", "ViettelPay"].map((wallet) => (
                          <Button
                            key={wallet}
                            variant="outline"
                            className="h-20 flex flex-col items-center justify-center gap-1"
                            type="button"
                          >
                            <div className="w-8 h-8 bg-muted rounded-full"></div>
                            <span className="text-xs">{wallet}</span>
                          </Button>
                        ))}
                      </div>
                    </TabsContent>
                    <TabsContent value="contact" className="space-y-4 pt-4">
                      <div className="space-y-2 text-sm">
                        <p>Liên hệ trực tiếp với người quản trị để được hỗ trợ nạp tiền:</p>
                        <div className="p-3 bg-muted rounded-lg">
                          <p>Hotline: 0123 456 789</p>
                          <p>Email: admin@aiservices.com</p>
                          <p>Zalo: 0123 456 789</p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>

              <div className="mt-6">
                <Button type="submit" className="w-full" disabled={isProcessing || amount < 10000}>
                  {isProcessing ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang xử lý...
                    </div>
                  ) : (
                    <div className="flex items-center">
                      Nạp tiền
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
