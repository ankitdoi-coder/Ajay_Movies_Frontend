import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Moviez } from '../Models/Moviez';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class Movie {
  //private baseUrl = "https://ajay-movies-backend.onrender.com/api";
   private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  saveMovie(movie: FormData): Observable<Moviez> {
    return this.http.post<Moviez>(`${this.baseUrl}/save-movie`, movie)
  }

  getAllMovies(): Observable<Moviez[]> {
    return this.http.get<Moviez[]>(`${this.baseUrl}/get-all-movies`)
  }

  getMovieById(id: any): Observable<Moviez> {
    return this.http.get<Moviez>(`${this.baseUrl}/get-by-id/${id}`)
  }

  getCategories(){
    return this.http.get<any>(`${this.baseUrl}/categories`);
  }
}
