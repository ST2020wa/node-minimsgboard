import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  
  private apiUrl = 'http://localhost:3000/api'; // URL to Node.js backend

  constructor(private http: HttpClient) {}

  // Method to fetch data from the backend
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }

    // Method to send a new message to the backend
    sendMessage(content: string): Observable<any> {
      // ATTENTION: the data prepared for backend should be an object
      const message = { content };  // Prepare the message object
      return this.http.post(`${this.apiUrl}/messages`, message);  // Send POST request to backend
    }
}
