'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function CTA() {
  return (
    <section className="py-16 bg-accent">
      <div className="container-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Reading Journey?</h2>
          <p className="text-xl mb-8">Join our community of book lovers and discover your next favorite read.</p>
          <Button size="lg" className="text-lg px-8 py-6">
            Join Now
          </Button>
        </motion.div>
      </div>
    </section>
  )
}

