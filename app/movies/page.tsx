import {
  getPopularMovies,
  getMovieGenres,
  getTrendingMovies,
  getTopRatedMovies,
  getMoviesByGenre,
} from '@/lib/api-calls';
import { MoviesPage } from '@/components/MoviesPage';

export default async function MoviesPageRoute() {
  const [
    { results: popularMovies },
    { results: trendingMovies },
    { results: topRatedMovies },
    genres,
  ] = await Promise.all([
    getPopularMovies(),
    getTrendingMovies(),
    getTopRatedMovies(),
    getMovieGenres(),
  ]);

  // Get movies for top 5 genres
  const topGenres = genres.slice(0, 5);
  const genreMovies = await Promise.all(
    topGenres.map((genre: { id: number; name: string }) =>
      getMoviesByGenre(genre.id).then((data) => ({
        genreId: genre.id,
        genreName: genre.name,
        movies: data.results,
      }))
    )
  );

  return (
    <MoviesPage
      initialMovies={popularMovies}
      initialGenres={genres}
      popularMovies={popularMovies}
      trendingMovies={trendingMovies}
      topRatedMovies={topRatedMovies}
      genreMoviesData={genreMovies}
    />
  );
}
