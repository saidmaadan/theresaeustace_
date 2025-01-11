"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from "next/image"
import Link from "next/link"
import { Download, Crown, ShoppingBasket } from "lucide-react"
import { DownloadButton } from "@/components/dashboard/download-button"


interface Book {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverImage?: string;
  isPublished: boolean;
  isFeatured: boolean;
  isPremium: boolean;
  bookFile: string;
  isFree: boolean;
  amazonLink: string
}

interface BookCarouselProps {
  books?: Book[];
  showFeatured?: boolean;
  showPublished?: boolean;
  title?: string;
  displayCount?: number;
  showViewAll?: boolean;
}

const BookCarousel = ({ 
  books = [], 
  showFeatured = false, 
  showPublished = true,
  title = "Recent Books",
  displayCount = 10,
  showViewAll = true
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
        <div className="w-full mb-20 mr-20">
            <div className="flex items-center justify-between mb-4">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold tracking-tight sm:text-3xl"
              >
                {title}
              </motion.h2>
              {showViewAll && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Button variant="ghost" asChild>
                    <Link href="/books">View All Books →</Link>
                  </Button>
                </motion.div>
              )}
            </div>
            <div className="w-full flex space-x-4 ">
              {/* Header */}
              
              <div className="w-[140px] h-64 relative hidden sm:flex space-x-10 items-center">  
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
              </div> 

              {/* Carousel Container */}
              <div className="w-full flex-1 overflow-hidden mr-10">
                  <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-hidden overflow-x-hidden scroll-smooth pb-4"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
                  onScroll={checkScroll}
                  >
                  {filteredBooks.map((book) => (
                      <motion.div
                      key={book.id}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                      className="flex-none"
                      >
                      <Card className="w-[300px] bg-card">
                          <CardContent className="p-0">
                          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-t-lg">
                              <Image
                              src={book.coverImage || "/api/placeholder/200/300"}
                              alt={book.title}
                              fill
                              className="object-cover w-full h-64"
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
                            <h3 className="font-semibold line-clamp-2 ">{book.title}</h3>
                            
                              <div className="flex items-center justify-item space-x-1 flex-wrap mt-4">
                                <div className="flex items-center space-x-2">
                                  {book.bookFile && book.isFree ? (
                                    <DownloadButton 
                                    fileUrl={book.bookFile}
                                    fileName={book.title}
                                    title="Free Download"
                                  />
                                  ) : book.isPremium ? (
                                      <Link href={"/dashboard"}>
                                        <Button size='sm'>
                                          <Download className="mr-2 h-4 w-4" /> 
                                          Premium
                                          <Crown className="ml-2 h-4 w-4" />
                                        </Button>
                                      </Link>
                                    
                                  ) : book.amazonLink ? (
                                    <Button asChild size='sm'>
                                      <a href={book.amazonLink} target="_blank" rel="noopener noreferrer">
                                      <ShoppingBasket className="mr-2 h-4 w-4" /> Buy on Amazon
                                      </a>
                                    </Button>
                                  ) : null}
          
                                </div>
                                <Button variant="outline">
                                    <Link href={`/books/${book.slug}`}>Read More..</Link>
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
        </div>
    );
};

export default BookCarousel;