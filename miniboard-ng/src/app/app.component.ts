import { RouterOutlet } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
import { response } from 'express';
import { DatePipe, NgFor } from '@angular/common';
import { InputComponent } from './input/input.component';

interface msgType {
  id: number;
  msg: string;
  name: string;
  created_at: string;
} 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [InputComponent,NgFor,DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'miniboard-ng';
  data: any;
  messages:msgType[]=[];
  newName='';
  newMsg='';
  Msgs:string[]=[];
  
  constructor(private apiService: ApiService){}

  ngOnInit():void{
    this.apiService.getData().subscribe(response => {
      this.data = response;
    })
  }

  public nameInputHandler(e){
    this.newName=e;
  }

  public msgInputHandler(e){
    this.newMsg=e;
  }

    // Method to handle form submission
    public onSubmit() {
      if (this.newMsg.trim() && this.newName.trim()) {
        this.apiService.sendMessage(this.newName, this.newMsg).subscribe(
          (response) => {
            this.messages.push(response);  // Add the new message to the list
            this.newName='';
            this.newMsg='';
          },
          (error) => {
            console.error('Error sending message:', error);
          }
        );
      }else{
        alert("Both name and message fields are required.");
      }
    }
  }
