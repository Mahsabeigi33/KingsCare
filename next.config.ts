import type { NextConfig } from "next";

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [];

// Allow localhost admin API images during development
remotePatterns.push({ protocol: "http", hostname: "localhost", port: "3000", pathname: "/**" });

// Allow external icon hosts
remotePatterns.push({ protocol: "https", hostname: "www.svgrepo.com", pathname: "/**" });

// Optionally allow ADMIN_API_BASE_URL host if set and not localhost
try {
  const adminUrl = process.env.ADMIN_API_BASE_URL ? new URL(process.env.ADMIN_API_BASE_URL) : null;
  if (adminUrl && adminUrl.hostname !== "localhost") {
    remotePatterns.push({
      protocol: adminUrl.protocol.replace(":", "") as "http" | "https",
      hostname: adminUrl.hostname,
      port: adminUrl.port || undefined,
      pathname: "/**",
    });
  }
} catch {
  // ignore invalid env URL
}

// Allow Vercel Blob public URLs (account subdomains)
remotePatterns.push({ protocol: "https", hostname: "**.public.blob.vercel-storage.com", pathname: "/**" })
remotePatterns.push({ protocol: "https", hostname: "**.blob.vercel-storage.com", pathname: "/**" })

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
  },
};

export default nextConfig;
