import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private dbApiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient, private storageService: StorageService) {}

  getSavedData(): Observable<any> {
    return this.http.get(`${this.dbApiUrl}/messages`);
  }

  submitMessage(username: string, msg: string): Observable<any>{
    const message = {username: username, msg: msg}
    return this.http.post(`${this.dbApiUrl}/submit-msg`, message); 
  }

  onLogin(username: string, password: string){
    const userInfo = {username: username, password: password}
    return this.http.post<{ username: string; message: string; token: string }>(`${this.dbApiUrl}/log-in`, userInfo).pipe(
      tap((response)=>{
        this.storageService.setItem('username', response.username);
        this.storageService.setItem('token', response.token);
        console.log("Login successful: ", response);
      }),
      catchError((error) => {
        console.error('log in error:', error);
        return throwError(() => new Error('log in error'));
      })
    );  
  }
}
