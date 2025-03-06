import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { ApiService } from '../api.service';

export type user = {
  id?: number,
  username: string,
  password: string,
  fist_name?: string,
  last_name?: string,
  member_status?: string
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  imports: [FormsModule,CommonModule]
})
export class LoginDialogComponent {
  @ViewChild('loginDialog') loginDialog!: ElementRef<HTMLDialogElement>;
  @Output() public userInfo:user;
  @Input() public invitationCode: string;
  public username = '';
  public password = '';
  public invitationCodeUI = '';
  public showLogIn = true;
  public showSignUp = false;

  constructor(private apiService: ApiService){}

  ngOnDestory(){
    //
  }

  openDialog(): void {
    this.loginDialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.loginDialog.nativeElement.close();
  }

  toggleToSignUp(){
    this.showLogIn = false;
    this.showSignUp = true;
    this.username='';
    this.password='';
  }

  onLogIn(): void {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    this.apiService.onLogin(this.username, this.password).subscribe(
      (response) => {
        console.log('Login successful:', response);
        // Handle successful login (e.g., update UI, redirect, etc.)
        this.closeDialog();
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }

  onSignup(){
    // TODO: check invitation code
    if(this.invitationCodeUI !== this.invitationCode){
      alert('Incorrect invitation code.')
    }else{
      this.showSignUp = false;
      this.showLogIn = true;
    }
    console.log('invite code:', this.invitationCodeUI);
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    }
}