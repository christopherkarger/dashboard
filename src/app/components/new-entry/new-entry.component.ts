import { Component, Output, EventEmitter, Input } from "@angular/core";
import { ISchedule, DateType, TZDate } from 'tui-calendar';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'new-entry',
  templateUrl: './new-entry.component.html',
  styleUrls: ['./new-entry.component.scss']
})
export class NewEntryComponent {
  appointmentDate?: DateType;
  appointmentForm: FormGroup;

  @Output() 
  onClose = new EventEmitter<boolean>();

  @Input()
  eventData?: ISchedule;

  constructor(
    private fb: FormBuilder
  ) {
    const timeInputControl = new FormControl('', []);

    this.appointmentForm = this.fb.group({
      timeInput: timeInputControl
    });

  }

  ngOnInit(): void {
    if (this.eventData) {
      
      this.appointmentDate = this.eventData.start as TZDate;
      
      if (this.appointmentDate && 'getTime' in this.appointmentDate) {
        const startTime = new Date(this.appointmentDate.getTime());
        const hours = startTime.getHours();
        const minutes = startTime.getMinutes();
  
        this.appointmentForm.patchValue({
          timeInput: `${hours < 10 ? ('0' + hours) : hours}:${minutes < 10 ? ('0' + minutes) : minutes}`     
        });
      }
      
      
    
    }
  }

  changedStartTime(): void {
    console.log('changed time')
  }

  close(): void {
    this.onClose.emit(true);
  }

}
