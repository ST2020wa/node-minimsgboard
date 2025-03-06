import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { log } from 'console';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost:3000/api'; // URL to Node.js backend
  private dbApiUrl = 'http://localhost:3000'

  constructor(private http: HttpClient) {}

  // Method to fetch data from the backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

  getSavedData(): Observable<any> {
    return this.http.get(`${this.dbApiUrl}/messages`);
  }

  // Method to send a new message to the backend
  sendMessage( name:string, msg:string): Observable<any> {
    const message = {  name:name,msg:msg };
    return this.http.post(`${this.apiUrl}/messages`, message); 
  }

  submitMessage(username: string, msg: string): Observable<any>{
    const message = {username: username, msg: msg}
    return this.http.post(`${this.dbApiUrl}/submit-msg`, message); 
  }

  onLogIn(username: string, pwd: string){
    const userInfo = {username: username, pwd: pwd};
    return this.http.post(`${this.apiUrl}/log-in`, userInfo);  
  }

  onLogin(username: string, password: string){
    const userInfo = {username: username, password: password}
    return this.http.post<{ username: string; message: string }>(`${this.dbApiUrl}/log-in`, userInfo).pipe(
      tap((response)=>{
        console.log("log in successful: ", response);
        localStorage.setItem("username", response.username);
      }),
      catchError((error) => {
        console.error('log in error:', error);
        return throwError(() => new Error('log in error'));
      })
    );  
  }

  checkAuth() {
    return this.http.get<{ username: string }>("http://localhost:3000/current-user").pipe(
      tap((response) => {
        localStorage.setItem("username", response.username);
      }),
      catchError(() => {
        localStorage.removeItem("username");
        return of(null);
      })
    );
  }
}
