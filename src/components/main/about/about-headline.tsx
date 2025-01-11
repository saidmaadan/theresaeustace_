

import AnimatedBackground from '@/components/ui/animated-background';
import { 
  LayoutDashboardIcon,
  BookOpen,
  Users2Icon,
} from "lucide-react"

export function AboutHeadline() {
  const ITEMS = [
    {
      id: 1,
      icon: Users2Icon,
      title: 'Discover ',
      description: "Discover why Sophia Bent's stories of Love and Romance captivate readers across the globe",
    },
    {
      id: 2,
      icon: BookOpen,
      title: 'Warm-Hearted',
      description: "Lose Yourself in a Love Story with warm-hearted and engaging author.",
    },
    {
      id: 3,
      icon: LayoutDashboardIcon,
      title: 'Romantic love story',
      description: "Be swept off your feet by this award-winning author's romantic love story.",
    },
    
  ];

  return (
    <div className='grid grid-cols sm:grid-cols-2 p-10 md:grid-cols-3 w-full h-full mb-20'>
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
  );
}
