

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
      title: 'Introduction',
      description: "Welcome to Theresa Eustace, your ultimate destination for fitness inspiration and education. Whether you're starting your fitness journey or looking for motivation to keep going, we provide the tools, books, and stories to help you succeed.",
    },
    {
      id: 2,
      icon: Users2Icon,
      title: 'Featured Books ',
      description: "Explore our curated collection of books designed to empower and guide you on your path to a healthier lifestyle. From workout plans to nutrition guides, we’ve got you covered.",
    },
    {
      id: 3,
      icon: LayoutDashboardIcon,
      title: 'Success Stories',
      description: "Read real-life stories of individuals who transformed their lives from fat to fit. Let their journeys inspire you to take the first step toward your own transformation.",
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
            <div className='container-center flex select-none flex-col space-y-1'>
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
