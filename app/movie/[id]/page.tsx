import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getMovieDetails, getMovieWatchProviders } from '@/lib/api-calls';
import { Rating } from '@/components/rating';
import { MovieWatchProviders } from '@/components/MovieWatchProviders';
import { Calendar, Clock } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MovieDetailPage({ params }: PageProps) {
  const { id } = await params;
  const movieId = parseInt(id);

  if (isNaN(movieId)) {
    notFound();
  }

  try {
    const [movie, watchProviders] = await Promise.all([
      getMovieDetails(movieId),
      getMovieWatchProviders(movieId),
    ]);

    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          {movie.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              className="object-cover object-top"
              priority
              sizes="100vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-900 to-black" />
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />

          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 px-8 md:px-16 lg:px-24 z-10">
            {/* Info - No poster, aligned to left */}
            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-white">
                <div className="flex items-center gap-2">
                  <Rating rate={movie.vote_average / 2} />
                  <span className="font-semibold">
                    {movie.vote_average?.toFixed(1)}
                  </span>
                </div>
                {movie.release_date && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      <span>{new Date(movie.release_date).getFullYear()}</span>
                    </div>
                  </>
                )}
                {movie.runtime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span>{movie.runtime} min</span>
                    </div>
                  </>
                )}
              </div>

              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {movie.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {movie.overview && (
                <p className="text-white/90 text-lg leading-relaxed">
                  {movie.overview}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Watch Providers Section */}
        {watchProviders && Object.keys(watchProviders).length > 0 ? (
          <MovieWatchProviders watchProviders={watchProviders} />
        ) : (
          <div className="px-8 md:px-16 lg:px-24 py-12">
            <div className="text-center py-12">
              <p className="text-zinc-400 text-lg">
                No streaming information available
              </p>
            </div>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error fetching movie details:', error);
    notFound();
  }
}
