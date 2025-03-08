import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef, Input, Output,EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { log } from 'console';
import { ApiService } from '../api.service';
import { UserInfo } from 'os';

export type user = {
  id?: number,
  username: string,
  password?: string,
  fist_name?: string,
  last_name?: string,
  member_status?: string,
  token?: string
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css'],
  imports: [FormsModule,CommonModule]
})
export class LoginDialogComponent {
  @ViewChild('loginDialog') loginDialog!: ElementRef<HTMLDialogElement>;
  @Output() public userLoggedin= new EventEmitter<boolean>();
  @Input() public invitationCode: string;
  public username = '';
  public password = '';
  public passwordRe = '';
  public invitationCodeUI = '';
  public showLogIn = true;
  public showSignUp = false;

  constructor(private apiService: ApiService){}

  public ngOnDestory(){
    //
  }

  public openDialog(): void {
    this.loginDialog.nativeElement.showModal();
  }

  public closeDialog(): void {
    this.loginDialog.nativeElement.close();
  }

  public toggleToSignUp(){
    this.showLogIn = false;
    this.showSignUp = true;
    this.username='';
    this.password='';
  }

  public onLogIn(): void {
    this.apiService.onLogin(this.username, this.password).subscribe(
      (response) => {
        this.closeDialog();
        this.userLoggedin.emit(true);
      },
      (error) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    );
  }

  public onSignup(){
    const username = this.username.trim();
    const password = this.password.trim();
    const passwordReEnter = this.passwordRe.trim();
    console.log(username, password, passwordReEnter)
    if(this.invitationCodeUI !== this.invitationCode){
      alert('Incorrect invitation code.');
      return;
    }
    if(username.length && password.length && passwordReEnter.length && (username.length < 6) && (password.length < 6)){
      alert('Both the username and password need to be at least 6 characters long.');
      return;
    }
    if(password!== passwordReEnter){
      alert('The passwords you entered do not match. Please try again.');
      return;
    }
    this.apiService.onSignup(username, password).subscribe(
      {next: (response) => {
        console.log('Sign-up successful:', response);
        this.showSignUp = false; // Only set to false on success
        this.showLogIn = true;
        alert('Sign-up successful. Please log in.');
      },
      error: (error) => {
        console.error('Sign-up failed:', error);
        alert('Sign-up failed. Please try again.');
      }}
    );
    }
}