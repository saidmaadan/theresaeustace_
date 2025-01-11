"use client"

import { motion } from "framer-motion"
import Image from "next/image"

export function AboutHero() {
  return (
    <section className="relative overflow-hidden py-20 mb-10 ">
      <div className="">
        <div className="grid gap-6 grid-cols-[50px_1fr] md:grid-cols-[100px_1fr] lg:grid-cols-[300px_1fr] lg:gap-12 xl:grid-cols-[400px_1fr]">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="aspect-square overflow-hidden rounded-xl object-cover aspect[1/4] sm:aspect[1/3] lg:aspect-[1] lg:order-first "
          >
            <div className="relative h-full w-full">
              <Image
                src="/images/sophiabent-br-1.png"
                alt="Sophia Bent"
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
              {/* <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                About Sophia Bent
              </h1> */}
              <p className="max-w-xl text-gray-500 md:text-xl dark:text-gray-400">
              Hi, I’m <span className="font-bold text-primary">Sophia Bent</span>—a passionate storyteller, hopeless romantic, and advocate for love in all its forms. For as long as I can remember, I’ve been captivated by the power of connection, the thrill of desire, and the beauty of vulnerability.


              </p>
            </div>
            <div className="max-w-[1000px] space-y-2 ">
              <p className="text-gray-500 dark:text-gray-400">
              My journey as an author began with a simple goal: to create stories that resonate deeply with readers, sparking emotions and igniting passions. Whether it’s a whirlwind romance, a steamy encounter, or a heartfelt exploration of intimacy, I pour my heart into every word I write.
              </p>
              <p className="text-gray-500 dark:text-gray-400">
              When I’m not crafting stories, you’ll find me sipping coffee in cozy cafes, indulging in long walks, or daydreaming about my next plot twist. I believe that love is the most powerful force in the world, and I’m committed to sharing its magic through my books.

              Thank you for joining me on this journey. Let’s explore the depths of love and desire together.


              </p>
            </div>
          </motion.div>
          
        </div>
      </div>
    </section>
  )
}
