"use client"

import Link from "next/link"
import { Icons } from "@/components/ui/icons"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ContactIcons() {
  // TODO: Replace with actual links
  const contactLinks = {
    zalo: "https://zalo.me/your-zalo-id",
    messenger: "https://m.me/your-messenger-id",
    phone: "tel:your-phone-number",
  }

  return (
    <div className="fixed bottom-4 right-4 flex flex-col space-y-2 z-50">
      <Link
        href={contactLinks.zalo}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "rounded-full w-14 h-14 bg-blue-500 hover:bg-blue-600 text-white",
          "contact-icon-animated shake-effect pulse-effect"
        )}
      >
        <Icons.zalo className="h-7 w-7" />
        <span className="sr-only">Zalo</span>
      </Link>
      <Link
        href={contactLinks.messenger}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "rounded-full w-14 h-14 bg-blue-600 hover:bg-blue-700 text-white",
          "contact-icon-animated shake-effect pulse-effect"
        )}
      >
        <Icons.messenger className="h-7 w-7" />
        <span className="sr-only">Messenger</span>
      </Link>
      <Link
        href={contactLinks.phone}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "rounded-full w-14 h-14 bg-green-500 hover:bg-green-600 text-white",
          "contact-icon-animated shake-effect pulse-effect"
        )}
      >
        <Icons.phone className="h-7 w-7" />
        <span className="sr-only">Phone</span>
      </Link>
    </div>
  )
} 