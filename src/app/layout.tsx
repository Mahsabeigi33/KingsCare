import "./globals.css";
import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/options";
import Providers from "./providers";

const poppins = Poppins({ subsets: ["latin"], weight: ["600", "700"] });
const roboto = Roboto({ subsets: ["latin"], weight: ["300", "400", "500"] });

export const metadata: Metadata = {
  title: "Kings Care Medical Clinic",
  description:
    "Book appointments medical clinic , family doctor .",
  icons: [
    { rel: "icon", url: "/favicon.png" },
    { rel: "shortcut icon", url: "/favicon.png" },
  ],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"),
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en" className={`${roboto.className} ${poppins.className}`} suppressHydrationWarning>
      <body className="min-h-screen">
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
