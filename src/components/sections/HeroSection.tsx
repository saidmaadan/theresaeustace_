'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import Link from "next/link"

export default function Hero() {
  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div
          className="w-full h-full bg-gradient-to-r from-purple-500 to-pulple-700 opacity-20 dark:opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>
      
      {/* Animated floating books */}
      <motion.div
        className="absolute left-1/4 top-1/4 w-16 h-20 bg-primary/20 rounded-md"
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute right-1/4 bottom-1/4 w-20 h-24 bg-secondary/20 rounded-md"
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute left-1/3 bottom-1/3 w-12 h-16 bg-accent/20 rounded-md"
        animate={{
          x: [0, 20, 0],
          y: [0, -10, 0],
          rotate: [0, 15, 0],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="container-center z-10">
        <motion.div
          className="max-w-[900px] text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-3xl sm:text-5xl md:text-7xl font-bold mb-6 text-foreground"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <p >Transform Your Life with Empowering Books and Inspiring Stories:</p>
            <p className="text-primary">From Fat to Fit </p>
          </motion.h1>
          <motion.p 
            className="text-lg md:text-xl mb-8 text-muted-foreground"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            Discover the best fitness resources, success stories, and actionable advice to help you lead a healthier, happier life from bestselling author and emerging talents.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            <div className="flex items-center justify-center gap-2 text-center ">
              <Button asChild size="lg">
                <Link href="/books">
                  Start Exploring
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/blog">
                  Read Blog
                </Link>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Animated particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-2 h-2 bg-primary/30 rounded-full"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: Math.random() * 2,
          }}
        />
      ))}
    </section>
  )
}

