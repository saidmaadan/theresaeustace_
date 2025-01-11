"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden mb-10 bg-accent">
      <div className="container-center py-10 pt-40 pb-10">
        <div className="grid gap-6 grid-cols-[50px_1fr] md:grid-cols-[100px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12 xl:grid-cols-[400px_1fr]">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="aspect-square overflow-hidden rounded-xl object-cover aspect[1/4] sm:aspect[1/3] lg:aspect-[1] lg:order-first "
          >
            <div className="relative h-full w-full">
              <Image
                src="/theresa-hero.png"
                alt="theresa"
                fill
                className="object-cover w-full h-full flex justify-end"
                priority
              />
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-center space-y-4 "
          >
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
              Empowering You to Lead a Healthier, Happier Life
              </h1>
              <p className="max-w-4xl text-gray-500 md:text-xl dark:text-gray-400">
                At Theresa Eustace books club, we believe that everyone has the potential to transform their lives through education, inspiration, and the right resources. Our mission is to empower individuals to go from fat to fit by providing access to the best fitness books, actionable advice, and real-life success stories.

                Founded by Theresa Eustace, we are passionate about helping people achieve their fitness goals and lead healthier, more fulfilling lives. Whether you're looking for workout plans, nutrition tips, or simply a dose of motivation, we’re here to support you every step of the way.

                Join our growing community and take the first step toward a stronger, healthier, and more confident you. Together, we can turn your fitness dreams into reality."
              </p>
              <h1>Why Choose Us?</h1>
              <ul>
                <li>
                  Curated selection of the best fitness books and resources.
                </li>
                <li>
                  Inspiring success stories to keep you motivated.
                </li>
                <li>
                Expert advice and actionable tips to help you stay on track.
                </li>
              </ul> 
            </div>
            
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
