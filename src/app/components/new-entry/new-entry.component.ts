import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
  selector: 'new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent {
  @Output() 
  onClose = new EventEmitter<boolean>();

  @Input()
  eventData?: string;

  constructor() {
    console.log(this.eventData);
  }

  close() {
    this.onClose.emit(true);
  }

}
