
import Hero from '@/components/sections/HeroSection'
import BookListing from '@/components/sections/BookListing2'
import BlogSection from '@/components/sections/BlogListing2'
import Newsletter from '@/components/sections/Newsletter2'
import CTA from '@/components/sections/CTA'


export default function MainPage() {
  return (
    <main className="min-h-screen bg-background">
      
      <Hero />
      <BookListing />
      <BlogSection />
      <Newsletter />
      <CTA />
     
    </main>
  )
}
