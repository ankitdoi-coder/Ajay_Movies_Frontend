import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moviez } from '../Models/Moviez';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PageResponse } from '../Models/PageResponse';


@Injectable({
  providedIn: 'root',
})
export class Movie {

  private baseUrl = `${environment.apiUrl}/api`;
  //private baseUrl = 'https://ajay-movies-backend.onrender.com/api';
  constructor(private http: HttpClient) { }

  saveMovie(movie: FormData): Observable<Moviez> {
    return this.http.post<Moviez>(`${this.baseUrl}/save-movie`, movie);
  }

  getAllMovies(page: number = 0, size: number = 12): Observable<PageResponse<Moviez>> {
    return this.http.get<PageResponse<Moviez>>(`${this.baseUrl}/get-all-movies?page=${page}&size=${size}`);
  }

  getMovieById(id: any): Observable<Moviez> {
    return this.http.get<Moviez>(`${this.baseUrl}/get-by-id/${id}`);
  }

  getCategories() {
    return this.http.get<any>(`${this.baseUrl}/categories`);
  }

  getMovieImageUrl(filename: string | undefined): string {
    return filename ? `${environment.apiUrl}${filename}` : '';
  }

  searchMovie(title?: string, category?: string, page: number = 0, size: number = 12): Observable<PageResponse<Moviez>> {
    let params: any = { page, size };
    if (title !== undefined && title !== null) {
      params.title = title;
    }
    if (category !== undefined && category !== null) {
      params.category = category;
    }
    return this.http.get<PageResponse<Moviez>>(`${this.baseUrl}/search`, { params });
  }
}
