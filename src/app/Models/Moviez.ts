import { Screenshot } from './screenShots.modal';

export interface Moviez {
  id?: number;

  // Basic
  title?: string;
  posterPath?: string;

  // Sub Head
  subHead_MovieName?: string;
  subHead_type?: string;

  // Movie Info Section
  movieInfo_ImbdRating?: string;
  movieInfo_movieName?: string;
  movieInfo_langauge?: string;
  movieInfo_releaseYear?: string;
  movieInfo_quality?: string;
  movieInfo_size?: string;
  movieInfo_Format?: string;

  // Synopsis
  movieSynopsis?: string;

  // Screenshots (dynamic length: 1, 5, 10…)
  screenshots?: Screenshot[];

  // Download Links
  downloadLink480?: string;
  downloadLink720?: string;
  downloadLink1080?: string;

  category?: string;
}
