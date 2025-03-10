import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private dbApiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient, private storageService: StorageService) {}

  public getSavedData(): Observable<any> {
    return this.http.get(`${this.dbApiUrl}/messages`);
  }

  public submitMessage(username: string, msg: string): Observable<any>{
    console.log(username, msg);
    return this.http.post(`${this.dbApiUrl}/submit-msg`, {
      username: username,
      msg: msg
    }).pipe(
      catchError((err)=>{
        console.error('Submit message error:', err);
        return throwError(() => new Error('Submit message error'));
      })
    ); 
  }

  public onLogin(username: string, password: string){
    const userInfo = {username: username, password: password}
    return this.http.post<{ username: string; message: string; token: string }>(`${this.dbApiUrl}/log-in`, userInfo).pipe(
      tap((response)=>{
        this.storageService.setItem('username', response.username);
        this.storageService.setItem('token', response.token);
        //console.log("Login successful: ", response);
      }),
      catchError((error) => {
        console.error('log in error:', error);
        return throwError(() => new Error('log in error'));
      })
    );  
  }

  public onSignup(username: string, password: string) {
    const userInfo = { username: username, password: password };
    return this.http.post(`${this.dbApiUrl}/sign-up`, userInfo).pipe(
      catchError((error) => {
        return throwError(() => new Error(error.error.message));
      })
    );
  }

  public onDeleteMsg(msgContent: string) {
    return fetch(`${this.dbApiUrl}/delete-msg`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msgContent })
    }).then(response => response.json())
      .then(data => {
        console.log("Delete successful:", data);
        return data;
      })
      .catch(error => {
        console.error("Delete error:", error);
        throw error;
      });
  }
}
