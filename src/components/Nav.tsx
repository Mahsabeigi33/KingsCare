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
  { href: "/#about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/services", label: "Services" },
  { href: "/specialty-clinic", label: "Specialty Clinic" },
  { href: "/contact", label: "Contact Us" },
]

type ServiceMenuItem = {
  href: string
  label: string
}

export default function Nav() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [serviceMenu, setServiceMenu] = useState<ServiceMenuItem[]>([])

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

  useEffect(() => {
    let isActive = true
    const loadServicesMenu = async () => {
      try {
        const response = await fetch("/api/services")
        if (!response.ok) return
        const data = (await response.json()) as ServiceMenuItem[]
        if (!Array.isArray(data)) return
        if (isActive) {
          setServiceMenu(data)
        }
        console.log("Loaded services menu", data)
      } catch (error) {
        console.error("Unable to load services menu", error)
      }
    }
    loadServicesMenu()
    return () => {
      isActive = false
    }
  }, [])

  const isAuthenticated = Boolean(session?.user)
  const bookingPath = "/not-available"
  const bookingHref = "/not-available"
  const servicesActive = pathname?.startsWith("/services")

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setServicesMenuOpen(false)
  }
  const logoSrc = scrolled ? "/website/Logo-solid.png" : "/website/Logo.png"
  const servicesMenuItems = serviceMenu.length > 0 ? serviceMenu : []

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
              <div
                className={cn(
                  "relative  transition-all duration-300",
                  scrolled ? "h-35 w-60" : "rounded-full border-2  border-[#d9b356] relative h-40 w-40 mt-20  p-2 sm:p-0 bg-[#0E2A47]/50",
                )}
              >
                <Image
                  src={logoSrc}
                  alt="Kings Care Medical Clinic logo"
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-6 text-white lg:flex xl:gap-8">
              {links.map((link) =>
                link.label === "Service" ? (
                  <div key={link.href} className="relative group">
                    <Link
                      href={link.href}
                      className={cn(
                        "text-large font-bold transition-all duration-200 hover:text-[#d9b356]",
                        "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#D9C89E] after:transition-all after:duration-300 hover:after:w-full",
                        servicesActive && "text-[#D9C89E] after:w-full",
                      )}
                    >
                      {link.label}
                    </Link>
                    <div className="pointer-events-none absolute left-0 top-full z-50 w-72 opacity-0 transition-all duration-200 group-focus-within:pointer-events-auto group-focus-within:opacity-100 group-hover:pointer-events-auto group-hover:opacity-100">
                      <div className="pt-2">
                        <div className="rounded-2xl border border-white/10 bg-[#0B1F36] p-3 shadow-2xl">
                          <div className="menu-scrollbar flex max-h-96 flex-col gap-1 overflow-y-auto pr-1">
                           
                            {servicesMenuItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                className="rounded-3xl px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#D9C89E] "
                              >
                                {item.label}
                              </Link>
                            ))}
                            
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      "text-large font-bold transition-all duration-200 hover:text-[#d9b356]",
                      "relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#D9C89E] after:transition-all after:duration-300 hover:after:w-full",
                      pathname === link.href && "text-[#D9C89E] after:w-full",
                    )}
                  >
                    {link.label}
                  </Link>
                ),
              )}
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden items-center gap-3 lg:flex">
              
                <>
                  <Link
                    href={bookingHref}
                    className="inline-flex items-center gap-2 rounded-full bg-[#d9b356] px-5 py-2.5 text-sm font-semibold text-[#0E2A47] shadow-lg shadow-[#d9b356]/70 transition-all hover:bg-[#C7B57A] hover:shadow-xl hover:shadow-[#C7B57A]/40 hover:scale-105"
                  >
                    <CalendarSearchIcon className="h-4 w-4" />
                    <span className="hidden sm:inline">Book Appointment</span>
                    <span className="sm:hidden">Book</span>
                  </Link>
              
                </>
             
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
            {links.map((link) =>
              link.label === "Services" ? (
                <div key={link.href} className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => setServicesMenuOpen((open) => !open)}
                    className={cn(
                      "group relative overflow-hidden rounded-xl px-4 py-3.5 text-left text-lg font-bold text-white transition-all duration-200",
                      servicesActive
                        ? "bg-[#D9C89E]/20 text-[#D9C89E] shadow-lg shadow-[#D9C89E]/15"
                        : "hover:bg-white/10 active:bg-white/20",
                    )}
                    aria-expanded={servicesMenuOpen}
                  >
                    <span className="relative z-10 flex items-center justify-between">
                      {link.label}
                      <span className={cn("text-xs transition-transform duration-200", servicesMenuOpen && "rotate-180")}>
                        ▼
                      </span>
                    </span>
                    {servicesActive && <div className="absolute inset-y-0 left-0 w-1 bg-[#D9C89E]" />}
                  </button>
                  {servicesMenuOpen && (
                    <div className="menu-scrollbar flex max-h-64 flex-col gap-1 overflow-y-auto rounded-xl bg-white/5 p-2 pr-1">
                      <Link
                        href="/services"
                        onClick={closeMobileMenu}
                        className="rounded-lg px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                      >
                        All Services
                      </Link>
                      {servicesMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={closeMobileMenu}
                          className="rounded-lg px-3 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-white"
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
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
                  {pathname === link.href && <div className="absolute inset-y-0 left-0 w-1 bg-[#D9C89E]" />}
                </Link>
              ),
            )}
          </nav>

          {/* Mobile Auth Section */}
          <div className="flex flex-col gap-3 p-4">
            <p className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-[#D9C89E]/80">
              Account
            </p>
           
              <>
                <Link
                  href={bookingHref}
                  onClick={closeMobileMenu}
                  className="inline-flex items-center justify-center gap-3 rounded-xl bg-[#d9b356] px-6 py-4 text-base font-bold text-[#0E2A47] shadow-lg shadow-[#D9C89E]/30 transition-all hover:bg-[#C7B57A] active:scale-95"
                >
                  <CalendarSearchIcon className="h-5 w-5" />
                  Book An Appointment
                </Link>
                
              </>
            
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
