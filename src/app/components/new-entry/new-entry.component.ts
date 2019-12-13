import { Component, Output, EventEmitter, Input } from "@angular/core";
import { ISchedule, DateType, TZDate } from "tui-calendar";
import { FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { INewEntry, IEntryData } from "../../models/new-entry.model";
import { Validator } from "../../utilities/validator";
@Component({
  selector: "new-entry",
  templateUrl: "./new-entry.component.html",
  styleUrls: ["./new-entry.component.scss"]
})
export class NewEntryComponent {
  appointmentDate?: DateType;
  appointmentForm: FormGroup;

  @Output()
  onClose = new EventEmitter<boolean>();

  @Output()
  addEvent = new EventEmitter<INewEntry>();

  @Input()
  entryData?: IEntryData;

  constructor(private fb: FormBuilder) {
    const timeInputControl = new FormControl("", []);

    this.appointmentForm = this.fb.group({
      timeInput: timeInputControl
    });
  }

  ngOnInit(): void {
    this.appointmentDate = <TZDate>Validator.require(this.entryData).start;

    if (this.appointmentDate && "getTime" in this.appointmentDate) {
      const startTime = new Date(this.appointmentDate.getTime());
      const hours = startTime.getHours();
      const minutes = startTime.getMinutes();

      this.appointmentForm.patchValue({
        timeInput: `${hours < 10 ? "0" + hours : hours}:${
          minutes < 10 ? "0" + minutes : minutes
        }`
      });
    }
  }

  onAddEvent() {
    const timeValue = this.appointmentForm.value.timeInput;
    const date = <TZDate>this.appointmentDate;
    const eventDate = new Date(date.getTime());
    eventDate.setHours(timeValue.split(":")[0]);
    eventDate.setMinutes(timeValue.split(":")[1]);

    this.addEvent.emit({
      date: eventDate
    });
    this.onClose.emit(true);
  }

  changedStartTime(): void {
    console.log("changed time");
  }

  close(): void {
    this.onClose.emit(true);
  }
}
