import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3333/api/auth'; // Adjust based on your backend URL

  constructor(private http: HttpClient) {}

  signup(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/signup`, { email, password });
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }
  
}