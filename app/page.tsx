import {
  getPopularMovies,
  getTrendingMovies,
  getTopRatedMovies,
  getTrendingTvShows,
} from '@/lib/api-calls';
import { MovieCarousel } from '@/components/MovieCarousel';
import { GridCarousel } from '@/components/GridCarousel';

export default async function Home() {
  const [
    { results: popularMovies },
    { results: trendingMovies },
    { results: topRatedMovies },
    { results: trendingTvShows },
  ] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
    getTrendingTvShows(),
  ]);

  return (
    <div className="min-h-screen bg-black font-sans">
      <main className="w-full">
        <MovieCarousel movies={popularMovies} />

        <div className="pt-8 pb-16">
          <GridCarousel
            title="Trending Now"
            items={trendingMovies}
            type="movie"
          />
          <GridCarousel title="Top Rated" items={topRatedMovies} type="movie" />
          <GridCarousel
            title="Trending TV Shows"
            items={trendingTvShows}
            type="tv"
          />
          <GridCarousel
            title="Popular Movies"
            items={popularMovies}
            type="movie"
          />
        </div>
      </main>
    </div>
  );
}
