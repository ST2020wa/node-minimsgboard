import { RouterOutlet } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { response } from 'express';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { InputComponent } from './input/input.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { log } from 'node:console';

interface msgType {
  id: number;
  content: string;
  user_id: string;
  created_at: string;
  title?: string;
} 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputComponent,NgFor,DatePipe,CommonModule,LoginDialogComponent,FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  @ViewChild(LoginDialogComponent) loginDialog!: LoginDialogComponent;
  public title = 'miniboard-ng';
  private messagesSubject = new BehaviorSubject<msgType[]>([]);
  public messages$ = this.messagesSubject.asObservable();
  public newName='';
  public newMsg='';
  public trimFlag=false;
  public savedMsg:msgType[]=[];
  public username: string;
  public invitationCode = '+2025';
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();
  public isEditMode = false;

  constructor(private apiService: ApiService, private storageService: StorageService) {}

  public ngOnInit():void{
    this.loadMessages();
    this.getUsername();
  }

  private loadMessages(): void {
    this.apiService.getSavedData().subscribe({
      next: (messages) => this.messagesSubject.next(messages),
      error: (err) => console.error('Failed to load messages:', err)
    });
  }

  public getUsername(){
    if(this.storageService.getItem('token')){
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        this.username = storedUsername;
        this.isLoggedInSubject.next(true);
      }
      this.isEditMode = this.username === 'Admin';
    }else{
      this.isLoggedInSubject.next(false); 
    };
  }

  public nameInputHandler(e){
    this.newName=e;
  }

  public msgInputHandler(e){
    this.newMsg=e;
  }

    public onSubmitMessage(){
      if (this.newMsg.trim()) {
        this.apiService.submitMessage(this.username, this.newMsg).subscribe({
          next:(response)=>{
            console.log('Message submitted successfully:', response);
            this.loadMessages();
            this.newName='';
            this.newMsg='';
          },
          error: (error) => {
            console.error('Error sending message:', error);
            alert("Oops, something went wrong. Failed to send the message.")
          }
        });
      }else{
        alert("Message field is required.");
      }
    }

    public openLoginDialog(): void {
      this.loginDialog.openDialog();
    }

    public onLogout(){
      this.storageService.removeItems(['username', 'token']);
      this.username = '';
      this.isEditMode = false;
      this.isLoggedInSubject.next(false);
    }

    public onDeleteMsg(message: string){
      this.apiService.onDeleteMsg(message).then(()=>{
        this.loadMessages();
      }).catch(console.error);
    }
  }
