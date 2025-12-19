import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

// Allow localhost admin API images during development
remotePatterns.push({ protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" });

// Allow external icon hosts
remotePatterns.push({ protocol: "https", hostname: "www.svgrepo.com", pathname: "/**" });

// Always allow the deployed admin host (can be overridden via ADMIN_PUBLIC_HOSTNAME)
remotePatterns.push({ protocol: "https", hostname: "admin-kings-care.vercel.app", pathname: "/**" });

// Optionally allow ADMIN_API_BASE_URL host if set and not localhost
try {
  const adminUrl = process.env.ADMIN_API_BASE_URL ? new URL(process.env.ADMIN_API_BASE_URL) : null;
  const publicAdminUrl = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL
    ? new URL(process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL)
    : null;
  const addHost = (url: URL | null) => {
    if (!url || url.hostname === "localhost") return;
    remotePatterns.push({
      protocol: url.protocol.replace(":", "") as "http" | "https",
      hostname: url.hostname,
      port: url.port || undefined,
      pathname: "/**",
    });
  };
  addHost(adminUrl);
  addHost(publicAdminUrl);
} catch (error) {
    console.warn("Could not parse admin URL from environment variables:", error);
}

// Allow Vercel Blob public URLs (account subdomains)
remotePatterns.push({ protocol: "https", hostname: "**.public.blob.vercel-storage.com", pathname: "/**" })
remotePatterns.push({ protocol: "https", hostname: "**.blob.vercel-storage.com", pathname: "/**" })

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
};

export default nextConfig;
