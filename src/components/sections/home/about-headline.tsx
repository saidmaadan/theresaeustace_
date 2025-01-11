"use client";

import AnimatedBackground from '@/components/ui/animated-background';
import { 
  LayoutDashboardIcon,
  BookOpen,
  Users2Icon,
} from "lucide-react"
import { motion } from "framer-motion"

export function AboutHeadline() {
  const ITEMS = [
    {
      id: 1,
      icon: Users2Icon,
      title: 'Whispers of the Heart ',
      description: "A tale of forbidden love that defies all odds.",
    },
    {
      id: 2,
      icon: BookOpen,
      title: 'Burning Embers',
      description: "A steamy romance that will set your soul on fire.",
    },
    {
      id: 3,
      icon: LayoutDashboardIcon,
      title: 'The Art of Seduction',
      description: "A guide to intimacy that will transform your relationships.",
    },
    
  ];

  return (
    <section className="py-16">
      <div className="container px-1">
        <div className="relative overflow-hidden rounded-xl border bg-background px-4 py-4 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4 text-center"
          >
            <div className='grid grid-cols sm:grid-cols-2 p-10 md:grid-cols-3 w-full h-full mb-4'>
              <AnimatedBackground
                className='rounded-lg bg-zinc-100 dark:bg-zinc-800'
                transition={{
                  type: 'spring',
                  bounce: 0.2,
                  duration: 0.6,
                }}
                enableHover
              >
                {ITEMS.map((item, index) => (
                  <div key={index} data-id={`card-${index}`}>
                    <div className='flex select-none flex-col space-y-1 p-4'>
                      {/* <p className="w-8 h-8 text-primary-foreground">{ item.icon}</p> */}
                      <h3 className='text-base font-medium text-zinc-800 dark:text-zinc-50'>
                        {item.title}
                      </h3>
                      <p className='text-base text-zinc-600 dark:text-zinc-400'>
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </AnimatedBackground>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          />
        </div>
      </div>
    </section>
  );
}
