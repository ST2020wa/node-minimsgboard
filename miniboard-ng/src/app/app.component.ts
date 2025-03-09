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
  public messages:msgType[]=[];
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

  ngOnInit():void{
    this.apiService.getSavedData().subscribe(response => {
      this.messages = response;
    });
    this.getUsername();
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
        this.apiService.submitMessage(this.username, this.newMsg).subscribe(
          (response) => {
            this.messages.push(response);  // Add the new message to the list
            this.newName='';
            this.newMsg='';
          },
          (error) => {
            console.error('Error sending message:', error);
            alert("Oops, something went wrong. Failed to send the message.")
          }
        );
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
      this.apiService.onDeleteMsg(message).then(console.log).catch(console.error);
    }
  }
