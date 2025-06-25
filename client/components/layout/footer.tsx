import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Về chúng tôi</h3>
            <p className="text-muted-foreground">
              Cung cấp dịch vụ tự động về AI, giúp doanh nghiệp tối ưu hóa quy trình và tăng hiệu quả kinh doanh.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>Địa chỉ: Số 3 - ngách 87 - ngõ 258 Tân Mai - Hoàng Mai - Hà Nội</li>
              <li>Email: contact@aiservices.com</li>
              <li>Điện thoại: 0912345678</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Chính sách</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Điều khoản sử dụng
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  Chính sách hoàn tiền
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Kết nối</h3>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Facebook">
                <Facebook className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Twitter">
                <Twitter className="h-6 w-6" />
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary" aria-label="Instagram">
                <Instagram className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} AI Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
