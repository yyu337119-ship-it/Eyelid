import type { Metadata } from "next"
import { Noto_Sans_SC, Noto_Serif_SC } from "next/font/google"
import { TooltipProvider } from "@/components/ui/tooltip"
import "./globals.css"

const sans = Noto_Sans_SC({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans",
})

const serif = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-noto-serif",
})

export const metadata: Metadata = {
  title: "系统评价小鼠眼睑异常表型",
  description:
    "按 MG、角膜与泪膜、结膜、眼睑相关肌肉四类整理检测方法、分子标志物、观察结果和原文图表。",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="zh-CN" className={`${sans.variable} ${serif.variable} h-full antialiased`}>
      <body className="min-h-full font-sans">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  )
}
