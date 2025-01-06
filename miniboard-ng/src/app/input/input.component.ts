import { Input, Output, Component, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  template: `
    <div>
      {{title}}
      <input type="text" (change)="inputEvent($event)">
    </div>
  `,
  styleUrl: './input.component.css'
})
export class InputComponent {
  @Input() title='';
  @Output() newValue = new EventEmitter<string>();

  public inputEvent(e){
    this.newValue.emit(e.target.value)
  }
}
