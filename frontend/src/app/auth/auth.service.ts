import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/v1/auth/local';

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password });
  }

  async login(email: string, password: string): Promise<any> {
    return await firstValueFrom(
      this.http.post<any>(this.apiUrl + '/signin', { email, password })
    );
  }
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }
  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  logout(): void {
    localStorage.removeItem('access_token');
    this.router.navigate(['/login']);
  }
}