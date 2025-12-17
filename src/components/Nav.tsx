"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut, useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import { CalendarSearchIcon, LogInIcon, LogOutIcon, LucideUser2 } from "lucide-react"
import { cn } from "@/lib/cn"
import Image from "next/image"
const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
]

export default function Nav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const isAuthenticated = Boolean(session?.user)
  const bookingPath = "/user/appointments"
  const bookingHref = isAuthenticated ? bookingPath : `/login?next=${encodeURIComponent(bookingPath)}`

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 p-2 transition-all duration-300",
          "bg-[#0E2A47] backdrop-blur supports-[backdrop-filter]:bg-[#0E2A47]/95",
          scrolled && "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
        )}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between px-4 sm:h-20 sm:px-6 lg:px-8">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 transition-transform hover:scale-105">
              <div className="rounded-full border-4  border-[#0E2A47] relative h-40 w-40 mt-20  p-2 sm:p-0 bg-[#0E2A47]/50 ">
              <Image
                src="/website/logo.png" 
                alt="Kings Care Medical Clinic logo" 
                fill  priority className="  object-contain"
              />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-white lg:flex xl:gap-8">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "text-large font-bold transition-all duration-200 hover:text-[#D9C89E]",
                    "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#D9C89E] after:transition-all after:duration-300 hover:after:w-full",
                    pathname === link.href && "text-[#D9C89E] after:w-full",
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden items-center gap-3 lg:flex">
              {isAuthenticated ? (
                <>
                  <Link
                    href="/user/profile"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D9C89E] px-5 py-2.5 text-sm font-semibold text-[#0E2A47] shadow-lg shadow-[#D9C89E]/30 transition-all hover:bg-[#C7B57A] hover:shadow-xl hover:shadow-[#C7B57A]/40 hover:scale-105"
                  >
                    <LucideUser2 className="h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10 hover:scale-105"
                  >
                    <LogOutIcon className="h-4 w-4 text-[#D9C89E]" />
                    <span>Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href={bookingHref}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#D9C89E] px-5 py-2.5 text-sm font-semibold text-[#0E2A47] shadow-lg shadow-[#D9C89E]/30 transition-all hover:bg-[#C7B57A] hover:shadow-xl hover:shadow-[#C7B57A]/40 hover:scale-105"
                  >
                    <CalendarSearchIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Book Appointment</span>
                    <span className="sm:hidden">Book</span>
                  </Link>
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-all hover:border-white hover:bg-white/10 hover:scale-105"
                  >
                    <LogInIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Sign In</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Hamburger Menu Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-lg text-white transition-all hover:bg-white/10 lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Toggle menu</span>
              {/* Animated Hamburger Icon */}
              <div className="relative h-5 w-6">
                <span
                  className={cn(
                    "absolute left-0 top-0 h-0.5 w-full rounded-full bg-white transition-all duration-300",
                    mobileMenuOpen ? "top-2 rotate-45" : "top-0",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-2 h-0.5 w-full rounded-full bg-white transition-all duration-300",
                    mobileMenuOpen ? "opacity-0" : "opacity-100",
                  )}
                />
                <span
                  className={cn(
                    "absolute left-0 top-4 h-0.5 w-full rounded-full bg-white transition-all duration-300",
                    mobileMenuOpen ? "top-2 -rotate-45" : "top-4",
                  )}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 top-16 z-30 bg-black/60 backdrop-blur-sm sm:top-20 lg:hidden"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Slide-out Menu */}
      <div
        className={cn(
          "fixed inset-y-0 right-0 top-16 z-40 w-full max-w-sm transform bg-gradient-to-br from-[#0E2A47] to-[#4B5563] shadow-2xl transition-transform duration-300 ease-in-out sm:top-20 lg:hidden",
          mobileMenuOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Mobile Navigation Links */}
          <nav className="flex flex-col gap-1 border-b border-white/10 px-4 py-6">
            <p className="px-4 pb-2 text-xs font-semibold uppercase tracking-wider text-[#D9C89E]/80">
              Navigation
            </p>
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className={cn(
                  "group relative overflow-hidden rounded-xl px-4 py-3.5 text-lg font-bold text-white transition-all duration-200",
                  pathname === link.href
                    ? "bg-[#D9C89E]/20 text-[#D9C89E] shadow-lg shadow-[#D9C89E]/15"
                    : "hover:bg-white/10 active:bg-white/20",
                )}
              >
                <span className="relative z-10">{link.label}</span>
                {pathname === link.href && (
                  <div className="absolute inset-y-0 left-0 w-1 bg-[#D9C89E]" />
                )}
              </Link>
            ))}
          </nav>

          {/* Mobile Auth Section */}
          <div className="flex flex-col gap-3 p-4">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#D9C89E]/80">
              Account
            </p>
            {isAuthenticated ? (
              <>
                <Link
                  href="/user/profile"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#D9C89E] px-6 py-4 text-base font-bold text-[#0E2A47] shadow-lg shadow-[#D9C89E]/30 transition-all hover:bg-[#C7B57A] active:scale-95"
                >
                  <LucideUser2 className="h-5 w-5" />
                  View Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu()
                    signOut({ callbackUrl: "/" })
                  }}
                  className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-all hover:border-white/50 hover:bg-white/10 active:scale-95"
                >
                  <LogOutIcon className="h-5 w-5 text-[#D9C89E]" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href={bookingHref}
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#D9C89E] px-6 py-4 text-base font-bold text-[#0E2A47] shadow-lg shadow-[#D9C89E]/30 transition-all hover:bg-[#C7B57A] active:scale-95"
                >
                  <CalendarSearchIcon className="h-5 w-5" />
                  Book An Appointment
                </Link>
                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-3 rounded-xl border-2 border-white/30 bg-white/5 px-6 py-4 text-base font-bold text-white transition-all hover:border-white/50 hover:bg-white/10 active:scale-95"
                >
                  <LogInIcon className="h-5 w-5" />
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Footer */}
          <div className="mt-auto border-t border-white/10 bg-white/5 px-4 py-6">
            <div className="text-center">
              <p className="text-sm font-medium text-white/90">Kings Care Medical Clinic</p>
              <p className="mt-1 text-xs text-white/60">
                © {new Date().getFullYear()} All rights reserved
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
