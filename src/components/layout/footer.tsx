"use client"

import Link from "next/link"
import { motion } from "framer-motion"
// import { NewsletterForm } from "@/components/shared/newsletter-form"
import NewsletterSignup from "@/components/home/newsletter-footer-c"
import { Mail, Twitter, Facebook, Instagram, Printer } from 'lucide-react'
import { siteConfig } from '@/config/site'
//import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function Footer() {
  const footerLinks = {
    resources: [
      { title: "Books", href: "/books" },
      { title: "Blog", href: "/blog" },
      { title: "About", href: "/about" },
      { title: "Contact", href: "/contact" },
    ],
    legal: [
      { title: "Cookies", href: "/cookies" },
      { title: "Disclaimer", href: "/disclaimer" },
      { title: "Privacy Policy", href: "/privacy" },
      { title: "Terms of Service", href: "/terms" },
    ],
    social: [
      { title: "Twitter", href: "https://twitter.com" },
      { title: "Instagram", href: "https://instagram.com" },
      { title: "Facebook", href: "https://facebook.com" },
    ],
  }

  return (
    <footer className="border-t bg-background">
      <div className="container-center">
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">About</h3>
            <p className="text-sm text-muted-foreground">
            A modern Love story that will captures your heart and captivate you from start to finish. Whether you’re looking for a heartwarming romance or a steamy escape, there’s something here for every reader.
            </p>
            <div className="flex space-x-1">
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.twitter}>
                    <Twitter className="h-4 w-4" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.facebook}>
                    <Facebook className="h-4 w-4" />
                    <span className="sr-only">Facebook</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.instagram}>
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Instagram</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={siteConfig.links.pinterest}>
                    <Printer className="h-4 w-4" />
                    <span className="sr-only">Pinterest</span>
                  </Link>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="mailto:info@sophiabent.com">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Link>
                </Button>
              </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Resources</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.resources.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Legal</h3>
            <ul className="space-y-2 text-sm">
              {footerLinks.legal.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="space-y-4"
          >
            <h3 className="text-lg font-semibold">Newsletter</h3>
            {/* <NewsletterForm /> */}
            <NewsletterSignup/>
          </motion.div>
        </div>
        <div className="mt-8 border-t pt-8 text-center">
          <div className="flex items-center justify-between flex-wrap container-center">
            <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SophiaBent. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
            Made in Austin, TX & powered by <a href="https://inventivelabs.co" target="_blank">@inventivelabs</a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}