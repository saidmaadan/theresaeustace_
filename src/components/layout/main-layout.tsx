"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'
import Navbar from "@/components/layout/navbar2"
import Footer from "@/components/layout/footer2"
// import { Navbar } from "@/components/layout/navbar"
// import { Footer } from "@/components/layout/footer"


interface MainLayoutProps {
    children: React.ReactNode;
}
  
export function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    return (
        <div className="flex min-h-screen flex-col">
            {/* <MainNav /> */}
            <Navbar />
                <AnimatePresence mode="wait">
                    <motion.main
                        key={pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="flex-1"
                        >
                        <div className="">
                            {children}
                        </div>
                    </motion.main>
                </AnimatePresence>
            <Footer />
        </div>
    )
}


