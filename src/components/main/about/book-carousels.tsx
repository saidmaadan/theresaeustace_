"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image"

interface Book {
  id: string;
  title: string;
  coverImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isPremium: boolean;
}

interface BookCarouselProps {
  books?: Book[];
  showFeatured?: boolean;
  showPublished?: boolean;
  title?: string;
  displayCount?: number;
}

const BookCarousel = ({ 
  books = [], 
  showFeatured = false, 
  showPublished = true,
  title = "Recent Books",
  displayCount = 10
}: BookCarouselProps) => {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  React.useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 400;
      const newScrollLeft = direction === 'left' 
        ? scrollContainerRef.current.scrollLeft - scrollAmount 
        : scrollContainerRef.current.scrollLeft + scrollAmount;
      
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth'
      });
    }
  };

  const filteredBooks = books
    .filter(book => {
      if (showFeatured) return book.isFeatured;
      if (showPublished) return book.isPublished;
      return true;
    })
    .slice(0, displayCount);

  return (
    <div className="relative w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
          </div>
          

      {/* Navigation Buttons */}
      {canScrollLeft && (
        <Button 
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-background shadow-lg"
          onClick={() => scroll('left')}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}
      
      {canScrollRight && (
        <Button 
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 z-10 transform -translate-y-1/2 rounded-full bg-background shadow-lg"
          onClick={() => scroll('right')}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}

      {/* Carousel Container */}
      <div className="w-full overflow-hidden">
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onScroll={checkScroll}
        >
          {filteredBooks.map((book) => (
            <motion.div
              key={book.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="flex-none"
            >
              <Card className="w-[200px] bg-card">
                <CardContent className="p-0">
                  <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={book.coverImage || "/api/placeholder/200/300"}
                      alt={book.title}
                      width={250}
                      height={250}
                      className="object-cover w-64 h-64"
                    />
                    {book.isPremium && (
                      <div className="absolute top-2 right-2">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Premium
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold truncate">{book.title}</h3>
                    <div className="flex mt-2 space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        Buy now
                      </Button>
                      <Button variant="secondary" size="sm" className="flex-1">
                        Read more
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookCarousel;