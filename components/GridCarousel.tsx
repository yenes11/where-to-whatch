'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Rating } from './rating';

interface MediaItem {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number;
  release_date?: string;
  first_air_date?: string;
}

interface GridCarouselProps {
  title: string;
  items: MediaItem[];
  type?: 'movie' | 'tv';
}

export function GridCarousel({
  title,
  items,
  type = 'movie',
}: GridCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;

    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());

    api.on('select', () => {
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    });
  }, [api]);

  const getMediaTitle = (item: MediaItem) =>
    item.title || item.name || 'Untitled';
  const getMediaDate = (item: MediaItem) =>
    item.release_date || item.first_air_date;
  const getMediaPath = (id: number) => `/${type}/${id}`;

  return (
    <div className="mb-8 md:mb-12">
      <div className="flex items-center justify-between mb-4 px-8 md:px-16 lg:px-24">
        <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-white">
          {title}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => api?.scrollPrev()}
            disabled={!canScrollPrev}
            className="h-8 w-8 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => api?.scrollNext()}
            disabled={!canScrollNext}
            className="h-8 w-8 text-white hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          loop: false,
          slidesToScroll: 4,
        }}
        className="w-full"
      >
        <CarouselContent className="mx-6 md:mx-12 lg:mx-20">
          {items.map((item) => (
            <CarouselItem
              key={item.id}
              className="basis-1/2 select-none sm:basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 pl-2 md:pl-4"
            >
              <Link href={getMediaPath(item.id)}>
                <div className="group relative aspect-2/3 overflow-hidden rounded-md bg-zinc-900 transition-transform duration-300 hover:z-10">
                  <Image
                    src={
                      item.poster_path
                        ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                        : '/placeholder-movie.jpg'
                    }
                    alt={getMediaTitle(item)}
                    fill
                    className="object-cover transition-all duration-300 group-hover:opacity-80 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 20vw, 16vw"
                  />

                  {/* Gradient Overlay on Hover */}
                  <div className="absolute w-full inset-0 bg-linear-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Info on Hover */}
                  <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">
                      {getMediaTitle(item)}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-white/80">
                      <span>
                        {getMediaDate(item)
                          ? new Date(getMediaDate(item)!).getFullYear()
                          : 'N/A'}
                      </span>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>{item.vote_average?.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
