"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Menu, X, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/lib/redux/store"
import { logoutSuccess } from "@/lib/redux/userSlice"

interface CurrentUser {
  name: string;
  role?: { id: number };
  // Potentially add other details if stored and needed
}

interface ChannelType {
  id: number;
  name: string;
  slug: string;
}

interface MenuItem {
  name: string;
  href: string;
  submenu?: { name: string; href: string; }[];
}

const baseMenuItems: MenuItem[] = [
  { name: "Trang chủ", href: "/" },
  { name: "Giới thiệu", href: "/about" },
  {
    name: "Dịch vụ",
    href: "/services",
    submenu: [], // Sẽ được điền dữ liệu động
  },
  { name: "Quản lý bài đăng", href: "/manage-posts" },
  { name: "Khuyến mại", href: "/promotions" },
  { name: "Tin AI", href: "/ai-news" },
  { name: "Video AI", href: "/ai-videos" },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)
  const [dichVuMenuOpen, setDichVuMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(baseMenuItems);
  const pathname = usePathname()
  const router = useRouter()
  const dispatch = useDispatch()
  const { isAuthenticated, currentUser } = useSelector((state: RootState) => state.user)

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        const response = await fetch('/api/channels/types');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const responseData = await response.json();
        const data: ChannelType[] = responseData.data;
        const serviceSubmenu = data.map(item => {
          // Chuẩn hóa slug để khớp với cấu trúc thư mục
          const slug = item.name.toLowerCase().includes("đăng bài") || 
                       item.name.toLowerCase().includes("auto post") ? "auto-posting" :
                       item.name.toLowerCase().includes("chatbot") || 
                       item.name.toLowerCase().includes("auto chat") ? "chatbot" :
                       item.slug || "default";

          return {
            name: item.name,
            href: `/services/${slug}`,
          };
        });

        setMenuItems(currentMenuItems =>
          currentMenuItems.map(item =>
            item.name === "Dịch vụ" ? { ...item, submenu: serviceSubmenu } : item
          )
        );
      } catch (error) {
        console.error("Failed to fetch service types:", error);
      }
    };

    fetchServiceTypes();
  }, []);

  const handleLogout = () => {
    dispatch(logoutSuccess())
    router.push("/auth/login"); 
  };

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo.png" alt="AI Services Logo" width={150} height={150} />
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {menuItems.map((item) => {
              const isDichVuService = item.name === "Dịch vụ" && !!item.submenu && item.submenu.length > 0;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (isDichVuService) {
                      setDichVuMenuOpen(true);
                    }
                  }}
                  onMouseLeave={() => {
                    if (isDichVuService) {
                      setDichVuMenuOpen(false);
                    }
                  }}
                >
                  {item.submenu ? (
                    <DropdownMenu
                      open={isDichVuService ? dichVuMenuOpen : undefined}
                      onOpenChange={isDichVuService ? setDichVuMenuOpen : undefined}
                    >
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="link"
                          className={cn(
                            "p-0 text-base flex items-center uppercase",
                            pathname.startsWith(item.href) && "font-medium",
                            isDichVuService
                              ? "text-muted-foreground hover:text-primary"
                              : [
                                  "gap-1",
                                  pathname.startsWith(item.href)
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-primary"
                                ]
                          )}
                        >
                          {item.name}
                          {isDichVuService && <ChevronDown className="h-4 w-4" />}
                        </Button>
                      </DropdownMenuTrigger>
                      {isDichVuService && (
                        <DropdownMenuContent align="start">
                          {item.submenu.map((subitem) => (
                            <DropdownMenuItem key={subitem.name} asChild className="uppercase">
                              <Link
                                href={subitem.href}
                                onClick={() => {
                                  if (isDichVuService) {
                                    setDichVuMenuOpen(false); 
                                  }
                                }}
                              >
                                {subitem.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      )}
                    </DropdownMenu>
                  ) : (
                    <Link
                      href={item.href}
                      className={cn(
                        "text-base font-medium transition-colors hover:text-primary uppercase",
                        pathname === item.href ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* User section */}
        <div className="flex items-center gap-4">
          {isAuthenticated && currentUser ? (
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium">
                <span className="mr-2">Số dư:</span>
                <span className="text-primary">100 Xu</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/images/avtUser.png" alt={currentUser.name} />
                      <AvatarFallback>{currentUser.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/user/profile">Thông tin cá nhân</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/services">Dịch vụ của tôi</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/user/payment">Nạp tiền</Link>
                  </DropdownMenuItem>
                  {currentUser.role?.id === 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">Trang quản trị</Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Đăng xuất</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <Button asChild>
              <Link href="/auth/login">Đăng nhập / Đăng ký</Link>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button variant="ghost" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {menuItems.map((item) => (
              <div key={item.name} className="py-2">
                {item.submenu && item.submenu.length > 0 ? (
                  <div>
                    <Button
                      variant="ghost"
                      className="flex w-full justify-between uppercase"
                      onClick={() => toggleSubmenu(item.name)}
                    >
                      {item.name}
                      <ChevronDown
                        className={cn("h-4 w-4 transition-transform", openSubmenu === item.name && "rotate-180")}
                      />
                    </Button>
                    {openSubmenu === item.name && (
                      <div className="ml-4 mt-2 space-y-2">
                        {item.submenu.map((subitem) => (
                          <Link
                            key={subitem.name}
                            href={subitem.href}
                            className="block py-2 pl-3 pr-4 text-sm text-muted-foreground hover:text-primary uppercase"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subitem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={cn(
                      "block py-2 text-base font-medium uppercase",
                      pathname === item.href ? "text-primary" : "text-muted-foreground hover:text-primary",
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
