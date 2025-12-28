'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Search, Loader2, Film, Tv } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface SearchModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  poster_path: string | null;
  backdrop_path: string | null;
  media_type: 'movie' | 'tv' | 'person';
  release_date?: string;
  first_air_date?: string;
  vote_average?: number;
}

export function SearchModal({ open, onOpenChange }: SearchModalProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [debounceTimer, setDebounceTimer] =
    React.useState<NodeJS.Timeout | null>(null);

  React.useEffect(() => {
    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // If query is empty, clear results
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Set loading state
    setIsLoading(true);

    // Create new timer
    const timer = setTimeout(async () => {
      try {
        if (!query.trim()) {
          setResults([]);
          setIsLoading(false);
          return;
        }

        const response = await fetch(
          `/api/search?query=${encodeURIComponent(query)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error('Search failed');
        }

        const data = await response.json();
        setResults(
          data.results.filter(
            (item: SearchResult) => item.media_type !== 'person'
          )
        );
        setIsLoading(false);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
        setIsLoading(false);
      }
    }, 300);

    setDebounceTimer(timer);

    // Cleanup
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [query]);

  // Clear results when modal closes
  React.useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setIsLoading(false);
    }
  }, [open]);

  const getMediaTitle = (item: SearchResult) =>
    item.title || item.name || 'Untitled';
  const getMediaDate = (item: SearchResult) =>
    item.release_date || item.first_air_date;
  const getMediaPath = (item: SearchResult) => {
    if (item.media_type === 'movie') return `/movie/${item.id}`;
    if (item.media_type === 'tv') return `/tv/${item.id}`;
    return '#';
  };
  const getMediaTypeLabel = (item: SearchResult) => {
    if (item.media_type === 'movie') return 'Movie';
    if (item.media_type === 'tv') return 'TV Show';
    return '';
  };

  return (
    <>
      <style jsx global>{`
        .search-results-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .search-results-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }
        .search-results-scroll::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        .search-results-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black gap-0 border-zinc-800/50 p-0 shadow-2xl max-w-[calc(100%-2rem)] overflow-hidden sm:max-w-4xl w-full">
          <DialogHeader className="sr-only">
            <DialogTitle>Search</DialogTitle>
          </DialogHeader>

          {/* Search Input */}
          <div className="">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400" />
              <input
                type="text"
                placeholder="Search for movies, TV shows..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-zinc-900/50 border-b border-zinc-800/50 text-white placeholder:text-zinc-500 focus:outline-none transition-all"
                autoFocus
              />
              {isLoading && (
                <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-zinc-400 animate-spin" />
              )}
            </div>
          </div>

          {/* Results */}
          <div className="px-6 pb-6 overflow-y-auto max-h-[calc(85vh-180px)] search-results-scroll">
            {query.trim() && isLoading && (
              <div className="space-y-3 py-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 bg-zinc-900/30 border-zinc-800/30"
                  >
                    {/* Poster Skeleton */}
                    <Skeleton className="size-24 md:size-28 bg-zinc-800 rounded-lg" />
                    {/* Info Skeleton */}
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 bg-zinc-800 w-3/4" />
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-5 bg-zinc-800 w-20" />
                        <Skeleton className="h-5 bg-zinc-800 w-16" />
                        <Skeleton className="h-5 bg-zinc-800 w-12" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {query.trim() && !isLoading && results.length === 0 && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center size-16 rounded-full bg-zinc-900/50 mb-4">
                  <Search className="size-8 text-zinc-500" />
                </div>
                <p className="text-zinc-400 text-lg">
                  No results found for &quot;{query}&quot;
                </p>
                <p className="text-zinc-500 text-sm mt-2">
                  Try a different search term
                </p>
              </div>
            )}

            {query.trim() && !isLoading && results.length > 0 && (
              <div className="space-y-3 py-4">
                {results.map((item) => (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    href={getMediaPath(item)}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-4 p-4 bg-zinc-900/30 hover:bg-zinc-900/60 border-zinc-800/30 hover:border-zinc-700/50 transition-all duration-200 group backdrop-blur-sm"
                  >
                    {/* Poster - Larger and better styled */}
                    <div className="relative size-24 md:size-28 flex-shrink-0 rounded-lg overflow-hidden bg-zinc-900 shadow-lg group-hover:shadow-xl transition-shadow">
                      {item.poster_path ? (
                        <Image
                          src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
                          alt={getMediaTitle(item)}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-110"
                          sizes="112px"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-zinc-800 to-zinc-900">
                          {item.media_type === 'movie' ? (
                            <Film className="size-10 text-zinc-500" />
                          ) : (
                            <Tv className="size-10 text-zinc-500" />
                          )}
                        </div>
                      )}
                      {/* Gradient overlay on hover */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>

                    {/* Info - Better layout */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-bold text-base md:text-lg mb-1.5 line-clamp-2 group-hover:text-white transition-colors">
                            {getMediaTitle(item)}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs font-medium text-zinc-300 px-2.5 py-1 bg-zinc-800/50 rounded-full border border-zinc-700/50">
                              {getMediaTypeLabel(item)}
                            </span>
                            {getMediaDate(item) && (
                              <span className="text-sm text-zinc-400">
                                {new Date(getMediaDate(item)!).getFullYear()}
                              </span>
                            )}
                            {item.vote_average && (
                              <div className="flex items-center gap-1.5 text-sm text-yellow-400">
                                <span>⭐</span>
                                <span className="font-semibold">
                                  {item.vote_average.toFixed(1)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Arrow indicator */}
                        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="size-8 rounded-full bg-white/10 flex items-center justify-center">
                            <svg
                              className="size-4 text-white"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!query.trim() && (
              <div className="py-16 text-center">
                <div className="inline-flex items-center justify-center size-20 rounded-full bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 mb-6 backdrop-blur-sm">
                  <Search className="size-10 text-zinc-500" />
                </div>
                <p className="text-zinc-300 text-lg font-medium mb-2">
                  Start searching
                </p>
                <p className="text-zinc-500 text-sm">
                  Type to find movies and TV shows
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
