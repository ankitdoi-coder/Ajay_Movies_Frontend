import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {

   private baseUrl = `${environment.apiUrl}/api/auth`;
  //private baseUrl = 'https://ajay-movies-backend.onrender.com/api';
  private tokenKey = 'token';

  constructor(private http: HttpClient) {}

  // LOGIN
  login(credentials: {email: string, password: string}): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, credentials);
  }

  // SAVE TOKEN
  saveToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  // GET TOKEN
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // LOGOUT
  logout() {
    localStorage.removeItem(this.tokenKey);
  }

  // CHECK LOGIN
  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
