'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Autoplay from 'embla-carousel-autoplay';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { Button } from './ui/button';
import { Info } from 'lucide-react';
import { Rating } from './rating';

interface Movie {
  id: number;
  title?: string;
  name?: string;
  backdrop_path: string | null;
  poster_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface MovieCarouselProps {
  movies: Movie[];
}

export function MovieCarousel({ movies }: MovieCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);

  const autoplay = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="relative w-full h-[75vh]">
      <Carousel
        setApi={setApi}
        plugins={[autoplay.current]}
        opts={{
          align: 'start',
          loop: true,
          duration: 35,
        }}
        className="w-full h-full"
      >
        <div className="relative w-full h-full overflow-hidden">
          {movies.slice(0, 10).map((movie, index) => (
            <div
              key={movie.id}
              className={`absolute inset-0 transition-opacity duration-1500 ease-in-out ${
                current === index
                  ? 'opacity-100 z-10'
                  : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <Link
                href={movie.title ? `/movie/${movie.id}` : `/tv/${movie.id}`}
              >
                <div className="relative w-full h-[75vh] overflow-hidden group cursor-pointer">
                  {/* Backdrop Image */}
                  <Image
                    src={
                      movie.backdrop_path
                        ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                        : movie.poster_path
                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                        : '/placeholder-movie.jpg'
                    }
                    alt={movie.title || movie.name || 'Media'}
                    fill
                    priority={movie.id === movies[0]?.id}
                    className="object-cover object-top"
                    sizes="100vw"
                  />

                  {/* Gradient Overlay - Only bottom 200px */}
                  <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-linear-to-t from-black via-black/80 to-transparent" />

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 lg:p-24 z-10">
                    <div className="max-w-2xl">
                      <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                        {movie.title || movie.name}
                      </h2>
                      <div className="flex items-center gap-4 mb-4 text-white">
                        <div className="flex items-center gap-2">
                          <Rating rate={movie.vote_average / 2} />
                          <span className="font-semibold">
                            {movie.vote_average?.toFixed(1)}
                          </span>
                        </div>
                        <span>•</span>
                        <span>
                          {movie.release_date || movie.first_air_date
                            ? new Date(
                                movie.release_date || movie.first_air_date!
                              ).getFullYear()
                            : 'N/A'}
                        </span>
                      </div>
                      <p className="text-white text-sm md:text-base lg:text-lg mb-6 line-clamp-3 drop-shadow-lg">
                        {movie.overview}
                      </p>
                      <div className="flex gap-4">
                        <button className="px-6 py-3 flex gap-2 bg-white/20 text-white rounded-md font-semibold hover:bg-white/30 transition-colors backdrop-blur-sm">
                          <Info />
                          Daha Fazla Bilgi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Hidden CarouselContent for Embla API */}
        <CarouselContent className="ml-0 h-0 overflow-hidden opacity-0 pointer-events-none">
          {movies.slice(0, 10).map((movie) => (
            <CarouselItem key={movie.id} className="pl-0 basis-full">
              <div className="w-full h-[75vh]" />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {movies.slice(0, 10).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={`h-2 rounded-full transition-all ${
              current === index
                ? 'w-8 bg-white'
                : 'w-2 bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
