import { RouterOutlet } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from './api.service';
import { response } from 'express';
import { CommonModule, DatePipe, NgFor } from '@angular/common';
import { InputComponent } from './input/input.component';
import { LoginDialogComponent } from './login-dialog/login-dialog.component';
import { FormsModule } from '@angular/forms';

interface msgType {
  id: number;
  msg: string;
  name: string;
  created_at: string;
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
  public username = 'guest'
  
  constructor(private apiService: ApiService){}

  ngOnInit():void{
    this.apiService.getSavedData().subscribe(response => {
      this.messages = response;
    });
    this.apiService.checkAuth().subscribe();
  }

  public nameInputHandler(e){
    this.newName=e;
  }

  public msgInputHandler(e){
    this.newMsg=e;
  }

    // Method to handle form submission
    public onSubmitMsg() {
      if (this.newMsg.trim() && this.newName.trim()) {
        this.apiService.sendMessage(this.newName, this.newMsg).subscribe(
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
        alert("Both name and message fields are required.");
      }
    }

    public openLoginDialog(): void {
      this.loginDialog.openDialog();
    }

    public isLoggedIn(): boolean {
      return localStorage.getItem("username") !== null;
    }
    
    public getLoggedInUser(): string | null {
      return localStorage.getItem("username");
    }
    
  }
