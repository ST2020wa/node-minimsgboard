import { Input, Output, Component, EventEmitter,NgModule } from '@angular/core';
import { AppModule } from '../app.module';

@Component({
  selector: 'app-input',
  imports: [AppModule],
  template: `
    <div>
      {{title}}
      <input type="text" (change)="inputEvent($event)" [value]="inputValue">
    </div>
  `,
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() title='';
  @Input() inputValue='';
  @Output() newValue = new EventEmitter<string>();

  public inputEvent(e){
    this.newValue.emit(e.target.value)
  }    
}
