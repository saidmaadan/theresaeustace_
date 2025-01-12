import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { NextAuthProvider } from '@/components/providers/next-auth-provider'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TheresaEustace's Book Store",
  description: "Welcome to TheresaEustace's Book Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
      <NextAuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <main className="overflow-x-hidden">
              {children}
          </main>
          <Toaster/>
          </ThemeProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
