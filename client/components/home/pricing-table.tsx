"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check } from "lucide-react"
import Link from "next/link"

const services = [
  {
    id: "auto-posting",
    name: "Đăng bài viết tự động",
    plans: [
      {
        id: "weekly",
        name: "1 Tuần",
        price: 50,
        features: [
          "Đăng tối đa 10 bài/tuần",
          "Tạo nội dung tự động",
          "Hỗ trợ 1 trang Facebook hoặc Website",
          "Phân tích hiệu quả cơ bản",
        ],
      },
      {
        id: "monthly",
        name: "1 Tháng",
        price: 180,
        popular: true,
        features: [
          "Đăng tối đa 50 bài/tháng",
          "Tạo nội dung tự động",
          "Hỗ trợ 3 trang Facebook hoặc Website",
          "Phân tích hiệu quả chi tiết",
          "Tối ưu hóa nội dung",
        ],
      },
      {
        id: "quarterly",
        name: "3 Tháng",
        price: 500,
        features: [
          "Đăng không giới hạn bài viết",
          "Tạo nội dung tự động",
          "Hỗ trợ 5 trang Facebook hoặc Website",
          "Phân tích hiệu quả chi tiết",
          "Tối ưu hóa nội dung",
          "Hỗ trợ 24/7",
        ],
      },
      {
        id: "biannual",
        name: "6 Tháng",
        price: 900,
        features: [
          "Đăng không giới hạn bài viết",
          "Tạo nội dung tự động",
          "Hỗ trợ 10 trang Facebook hoặc Website",
          "Phân tích hiệu quả chi tiết",
          "Tối ưu hóa nội dung",
          "Hỗ trợ 24/7",
          "Tư vấn chiến lược nội dung",
        ],
      },
      {
        id: "annual",
        name: "1 Năm",
        price: 1600,
        features: [
          "Đăng không giới hạn bài viết",
          "Tạo nội dung tự động",
          "Hỗ trợ không giới hạn trang Facebook hoặc Website",
          "Phân tích hiệu quả chi tiết",
          "Tối ưu hóa nội dung",
          "Hỗ trợ 24/7",
          "Tư vấn chiến lược nội dung",
          "Đào tạo sử dụng hệ thống",
        ],
      },
    ],
  },
  {
    id: "chatbot",
    name: "Chatbot tự động",
    plans: [
      {
        id: "weekly",
        name: "1 Tuần",
        price: 70,
        features: ["1 chatbot", "Hỗ trợ 1 nền tảng", "Tối đa 100 tin nhắn/ngày", "Mẫu chat cơ bản"],
      },
      {
        id: "monthly",
        name: "1 Tháng",
        price: 250,
        popular: true,
        features: [
          "3 chatbot",
          "Hỗ trợ 2 nền tảng",
          "Tối đa 500 tin nhắn/ngày",
          "Mẫu chat tùy chỉnh",
          "Báo cáo hiệu quả",
        ],
      },
      {
        id: "quarterly",
        name: "3 Tháng",
        price: 700,
        features: [
          "5 chatbot",
          "Hỗ trợ 3 nền tảng",
          "Tối đa 1000 tin nhắn/ngày",
          "Mẫu chat tùy chỉnh",
          "Báo cáo hiệu quả chi tiết",
          "Tích hợp CRM",
        ],
      },
      {
        id: "biannual",
        name: "6 Tháng",
        price: 1300,
        features: [
          "10 chatbot",
          "Hỗ trợ tất cả nền tảng",
          "Tối đa 2000 tin nhắn/ngày",
          "Mẫu chat tùy chỉnh",
          "Báo cáo hiệu quả chi tiết",
          "Tích hợp CRM",
          "Huấn luyện chatbot nâng cao",
        ],
      },
      {
        id: "annual",
        name: "1 Năm",
        price: 2400,
        features: [
          "Không giới hạn chatbot",
          "Hỗ trợ tất cả nền tảng",
          "Không giới hạn tin nhắn",
          "Mẫu chat tùy chỉnh",
          "Báo cáo hiệu quả chi tiết",
          "Tích hợp CRM",
          "Huấn luyện chatbot nâng cao",
          "Tư vấn chiến lược chatbot",
        ],
      },
    ],
  },
  {
    id: "auto-messaging",
    name: "Gửi tin nhắn tự động",
    plans: [
      {
        id: "weekly",
        name: "1 Tuần",
        price: 40,
        features: ["Tối đa 100 tin nhắn/ngày", "Hỗ trợ 1 nền tảng", "Mẫu tin nhắn cơ bản", "Phân tích cơ bản"],
      },
      {
        id: "monthly",
        name: "1 Tháng",
        price: 150,
        popular: true,
        features: [
          "Tối đa 300 tin nhắn/ngày",
          "Hỗ trợ 2 nền tảng",
          "Mẫu tin nhắn tùy chỉnh",
          "Phân tích chi tiết",
          "Lập lịch gửi tin nhắn",
        ],
      },
      {
        id: "quarterly",
        name: "3 Tháng",
        price: 400,
        features: [
          "Tối đa 500 tin nhắn/ngày",
          "Hỗ trợ 3 nền tảng",
          "Mẫu tin nhắn tùy chỉnh",
          "Phân tích chi tiết",
          "Lập lịch gửi tin nhắn",
          "Phân đoạn khách hàng",
        ],
      },
      {
        id: "biannual",
        name: "6 Tháng",
        price: 750,
        features: [
          "Tối đa 1000 tin nhắn/ngày",
          "Hỗ trợ tất cả nền tảng",
          "Mẫu tin nhắn tùy chỉnh",
          "Phân tích chi tiết",
          "Lập lịch gửi tin nhắn",
          "Phân đoạn khách hàng",
          "Tích hợp CRM",
        ],
      },
      {
        id: "annual",
        name: "1 Năm",
        price: 1400,
        features: [
          "Không giới hạn tin nhắn",
          "Hỗ trợ tất cả nền tảng",
          "Mẫu tin nhắn tùy chỉnh",
          "Phân tích chi tiết",
          "Lập lịch gửi tin nhắn",
          "Phân đoạn khách hàng",
          "Tích hợp CRM",
          "Tư vấn chiến lược tiếp thị",
        ],
      },
    ],
  },
]

export default function PricingTable() {
  const [activeService, setActiveService] = useState(services[0].id)

  const activeServiceData = services.find((s) => s.id === activeService)

  return (
    <div>
      <Tabs defaultValue={services[0].id} onValueChange={setActiveService} className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
          {services.map((service) => (
            <TabsTrigger key={service.id} value={service.id}>
              {service.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {services.map((service) => (
          <TabsContent key={service.id} value={service.id} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {service.plans.map((plan) => (
                <div
                  key={plan.id}
                  className={`flex flex-col p-6 bg-white rounded-lg border ${
                    plan.popular ? "border-primary shadow-lg relative" : "border-gray-200"
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4">
                      <span className="inline-block bg-primary text-white text-xs font-semibold px-3 py-1 rounded-full">
                        Phổ biến
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <div className="mt-4 flex items-baseline">
                      <span className="text-3xl font-bold">{plan.price}</span>
                      <span className="ml-1 text-muted-foreground">Xu</span>
                    </div>
                    <ul className="mt-6 space-y-3">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start">
                          <Check className="h-5 w-5 text-primary shrink-0 mr-2" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Button className={`mt-8 ${plan.popular ? "bg-primary" : ""}`} asChild>
                    <Link href={`/services/${service.id}?plan=${plan.id}`}>Chọn gói</Link>
                  </Button>
                </div>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
