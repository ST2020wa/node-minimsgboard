import { Component, ViewChild, ElementRef } from '@angular/core';
import { log } from 'console';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.css']
})
export class LoginDialogComponent {
  @ViewChild('loginDialog') loginDialog!: ElementRef<HTMLDialogElement>;
  username: string = '';
  password: string = '';

  openDialog(): void {
    console.log('hi')
    this.loginDialog.nativeElement.showModal();
  }

  closeDialog(): void {
    this.loginDialog.nativeElement.close();
  }

  onSubmit(): void {
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    this.closeDialog();
  }
}