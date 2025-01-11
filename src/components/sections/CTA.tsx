'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function CTA() {
  return (
    <section className="py-16 dark:bg-muted/40 bg-purple-100">
      <div className="container-center ">
        <motion.div
          className="text-center "
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8">Browse our books, read our blogs, and join a community of like-minded individuals striving for a healthier life."

</p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link href="/books">
              Browse Books
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

