'use client'
import * as React from 'react'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MoonIcon, SunIcon, Menu, User, BookOpenCheck  } from 'lucide-react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Logo } from "@/components/shared/logo"
import { usePathname, useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { cn } from '@/lib/utils'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/theme/theme-toggle'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from 'sonner'

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false)
    const { theme, setTheme } = useTheme()
    const [isOpen, setIsOpen] = React.useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const { data: session, status } = useSession()

    const routes = [
        {
        href: '/about',
        label: 'About',
        },
        // {
        // href: '/books',
        // label: 'Books',
        // },
        
        {
        href: '/blog',
        label: 'Blog',
        },
        {
        href: '/contact',
        label: 'Contact',
        },
    ]

    const handleSignOut = async () => {
        try {
        await signOut({ 
            // callbackUrl: '/',
            redirect: false 
        })
        toast.success("Successfully logged out!")
        router.push('/')
        } catch (error) {
        console.error('Sign out error:', error)
        toast.error("Error logging out")
        }
    }

    useEffect(() => {
        const handleScroll = () => {
        setIsScrolled(window.scrollY > 0)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <motion.nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                isScrolled ? 'bg-background/80 backdrop-blur-md shadow-md' : 'bg-transparent'
            }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
        >
        <div className="container-center py-4 flex justify-between items-center">
            <Link href="/" className="">
                <Logo/>
            </Link>
            <div className="hidden md:flex items-center space-x-3">
                    {/* <ThemeToggle /> */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="bg-none hover:bg-none"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                    {theme === 'dark' ? <SunIcon className="h-5 w-5" /> : <MoonIcon className="h-5 w-5" />}
                </Button>
                <div className="flex items-center space-x-4 ">    
                    {routes.map((route) => (
                    <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                        'text-sm font-medium hover:text-primary/90 transition-colors',
                        pathname === route.href
                            ? 'text-foreground/60'
                            : 'text-foreground/100'
                        )}
                    >
                        {route.label}
                    </Link>
                    ))}
                    <Button asChild variant="ghost" >
                        <Link href="/books" className="text-foreground"><BookOpenCheck />Books Store</Link>
                    </Button>
                    
                </div>
                
                {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="relative">
                            <User className="h-5 w-5" />
                            <span className="sr-only">User menu</span>
                        </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                        <div className="flex items-center justify-start gap-2 p-2">
                            <div className="flex flex-col space-y-1 leading-none">
                            {session.user.name && (
                                <p className="font-medium">{session.user.name}</p>
                            )}
                            {session.user.email && (
                                <p className="w-[200px] truncate text-sm text-muted-foreground">
                                {session.user.email}
                                </p>
                            )}
                            </div>
                        </div>
                        <DropdownMenuSeparator />
                        {session.user.role === 'ADMIN' ? (
                            <DropdownMenuItem asChild>
                            <Link href="/admin">Admin Dashboard</Link>
                            </DropdownMenuItem>
                        ) : session.user.role === 'USER' ? (
                            <DropdownMenuItem asChild>
                            <Link href="/dashboard">Dashboard</Link>
                            </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="cursor-pointer"
                            onSelect={(e) => {
                            e.preventDefault()
                            handleSignOut()
                            }}
                        >
                            Sign Out
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    ) : (
                <>
                    {/* <Button asChild variant="ghost">
                        <Link href="/login">
                            <LockKeyhole /> Sign-in
                        </Link>
                    </Button> */}
                    <Button asChild className="w-full">
                        <Link href="/login" onClick={() => {
                            console.log('Navigating - to /register');
                            setIsOpen(false)
                          }}>
                           Get Started
                        </Link>
                    </Button>
                    
                    
                </>
                )}
            </div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <div className="md:hidden flex items-center space-x-4">
              <ThemeToggle />
              <SheetTrigger asChild className="">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
            </div>
            
            <SheetContent side="right">
              <div className="flex flex-col space-y-6">
                {routes.map((route) => (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'text-lg font-medium transition-colors hover:text-foreground/80 pl-4',
                      pathname === route.href
                        ? 'text-foreground'
                        : 'text-foreground/60'
                    )}
                    onClick={() => setIsOpen(false)}
                  >
                    {route.label}
                  </Link>
                ))}
                <Button asChild variant="ghost" className="flex text-center justify-start">
                    <Link href="/books" onClick={() => setIsOpen(false)}><BookOpenCheck />Books Store</Link>
                </Button>
                <div className="space-y-4">
                  {status === 'loading' ? null : status === 'authenticated' && session?.user ? (
                    <>
                      <div className="flex flex-col space-y-1 p-2">
                        {session.user.name && (
                          <p className="font-medium">{session.user.name}</p>
                        )}
                        {session.user.email && (
                          <p className="text-sm text-muted-foreground">
                            {session.user.email}
                          </p>
                        )}
                      </div>
                      
                      {session.user.role === 'ADMIN' ? (
                          <Link href="/admin" onClick={() => setIsOpen(false)}>
                            Admin Dashboard
                            </Link>
                          ) : session.user.role === 'USER' ? (
                          <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                            Dashboard
                          </Link>
                        ) : null}
                      
                      <Button
                        variant="ghost"
                        className="w-full flex text-center justify-start"
                        onClick={() => {
                          handleSignOut()
                          setIsOpen(false)
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full flex justify-start">
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                        <User />Get Started
                        </Link>
                      </Button>
                      
                      {/* <Button asChild className="w-full">
                          <Link href="/register" onClick={() => {
                            console.log('Navigating - to /register');
                            setIsOpen(false)
                          }}>
                          Get Started
                        </Link>
                      </Button> */}
                    </>
                  )}
                </div>
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
            
        </div>
        </motion.nav>
    )
}

