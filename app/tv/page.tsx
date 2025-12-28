import {
  getPopularTvShows,
  getTvGenres,
  getTrendingTvShows,
  getTvShowsByGenre,
} from '@/lib/api-calls';
import { TvShowsPage } from '@/components/TvShowsPage';

export default async function TvShowsPageRoute() {
  const [{ results: popularTvShows }, { results: trendingTvShows }, genres] =
    await Promise.all([
      getPopularTvShows(),
      getTrendingTvShows(),
      getTvGenres(),
    ]);

  // Get TV shows for top 5 genres
  const topGenres = genres.slice(0, 5);
  const genreTvShows = await Promise.all(
    topGenres.map((genre: { id: number; name: string }) =>
      getTvShowsByGenre(genre.id).then((data) => ({
        genreId: genre.id,
        genreName: genre.name,
        tvShows: data.results,
      }))
    )
  );

  return (
    <TvShowsPage
      initialTvShows={popularTvShows}
      initialGenres={genres}
      popularTvShows={popularTvShows}
      trendingTvShows={trendingTvShows}
      genreTvShowsData={genreTvShows}
    />
  );
}
