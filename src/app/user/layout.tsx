import type { ReactNode } from "react"
import Nav from "@/components/NavUser"

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0E2A47] backdrop-blur supports-[backdrop-filter]:bg-[#0E2A47]/70 text-white">
      <Nav />
      <main className="mx-auto min-h-[calc(100vh-56px)] w-full max-w-6xl px-4 pb-16 pt-10 lg:pt-16 ">
        {children}
      </main>
    </div>
  )
}
