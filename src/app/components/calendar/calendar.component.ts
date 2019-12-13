import { Component, AfterViewInit, ViewChild } from "@angular/core";
import { Validator } from "../../utilities/validator";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";

//import dayGridPlugin from "@fullcalendar/daygrid";
import { FullCalendarComponent } from "@fullcalendar/angular";

import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements AfterViewInit {
  calendarPlugins = [timeGridPlugin, interactionPlugin, momentPlugin];

  @ViewChild("calendar", { static: false })
  calendarComponent?: FullCalendarComponent;

  calendarForm: FormGroup;
  showNewEntry = false;

  constructor(private fb: FormBuilder) {
    //let calendarApi = Validator.require(this.calendarComponent).getApi();

    this.calendarForm = this.fb.group({
      calendarView: "week"
    });
  }

  dateClick() {
    alert("a day has been clicked!");
  }

  onMouseEnter() {
    console.log("enter");
  }

  onSelect(evt: any) {
    console.log(evt);
  }

  changedView(): void {}

  next(): void {}

  prev(): void {}

  today(): void {}

  onNewEntryClose(): void {
    this.showNewEntry = false;
  }

  ngAfterViewInit(): void {
    console.log(this.calendarComponent);
  }

  onAddEvent() {}
}
