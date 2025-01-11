
import Hero from '@/components/sections/HeroSection'
import BookListing from '@/components/sections/BookListing2'
import BlogSection from '@/components/sections/BlogListing2'
import Newsletter from '@/components/sections/Newsletter2'
import CTA from '@/components/sections/CTA'
import {Newsletter as NewsLetterForm } from "@/components/home/newsletter"


export default function MainPage() {
  return (
    <main className="min-h-screen bg-background">
      
      <Hero />
      <BookListing />
      <BlogSection />
      <NewsLetterForm />
      {/* <NewsletterForm/> */}
      <CTA />
     
    </main>
  )
}
