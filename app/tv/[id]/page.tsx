import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getTvShowDetails, getTvShowWatchProviders } from '@/lib/api-calls';
import { Rating } from '@/components/rating';
import { MovieWatchProviders } from '@/components/MovieWatchProviders';
import { Calendar, Clock, Tv } from 'lucide-react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function TvShowDetailPage({ params }: PageProps) {
  const { id } = await params;
  const tvId = parseInt(id);

  if (isNaN(tvId)) {
    notFound();
  }

  try {
    const [tvShow, watchProviders] = await Promise.all([
      getTvShowDetails(tvId),
      getTvShowWatchProviders(tvId),
    ]);

    const runtime = tvShow.episode_run_time?.[0] || tvShow.runtime;

    return (
      <div className="min-h-screen bg-black">
        {/* Hero Section */}
        <div className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden">
          {tvShow.backdrop_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/original${tvShow.backdrop_path}`}
              alt={tvShow.name}
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
                {tvShow.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-4 text-white">
                <div className="flex items-center gap-2">
                  <Rating rate={tvShow.vote_average / 2} />
                  <span className="font-semibold">
                    {tvShow.vote_average?.toFixed(1)}
                  </span>
                </div>
                {tvShow.first_air_date && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="size-4" />
                      <span>
                        {new Date(tvShow.first_air_date).getFullYear()}
                        {tvShow.last_air_date &&
                          tvShow.last_air_date !== tvShow.first_air_date &&
                          ` - ${new Date(tvShow.last_air_date).getFullYear()}`}
                      </span>
                    </div>
                  </>
                )}
                {runtime && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Clock className="size-4" />
                      <span>{runtime} min</span>
                    </div>
                  </>
                )}
                {tvShow.number_of_seasons && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1.5">
                      <Tv className="size-4" />
                      <span>
                        {tvShow.number_of_seasons} Season
                        {tvShow.number_of_seasons > 1 ? 's' : ''}
                        {tvShow.number_of_episodes &&
                          ` • ${tvShow.number_of_episodes} Episode${
                            tvShow.number_of_episodes > 1 ? 's' : ''
                          }`}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {tvShow.genres && tvShow.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {tvShow.genres.map((genre: any) => (
                    <span
                      key={genre.id}
                      className="px-3 py-1 bg-white/10 text-white rounded-full text-sm backdrop-blur-sm border border-white/20"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}

              {tvShow.overview && (
                <p className="text-white/90 text-lg leading-relaxed">
                  {tvShow.overview}
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
    console.error('Error fetching TV show details:', error);
    notFound();
  }
}
