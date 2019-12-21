import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Validator } from "../../utilities/validator";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import { Calendar, DateSpanApi } from "@fullcalendar/core";
import { CellHover } from "./addons/cellhover";

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
  calendar?: FullCalendarComponent;

  @ViewChild("calRef", { static: false })
  calRef?: ElementRef;

  calendarApi?: Calendar;
  calendarForm: FormGroup;
  showNewEntry = false;

  constructor(private fb: FormBuilder) {
    this.calendarForm = this.fb.group({
      calendarView: "week"
    });
  }

  onSelect(evt: DateSpanApi) {
    console.log(evt);
    if (this.calendarApi) {
      this.calendarApi.unselect();
    }
  }

  onSelectAllow(evt: DateSpanApi) {
    const start = evt.start.getTime();
    const end = evt.end.getTime();
    const minutes15 = 1000 * 60 * 15;

    // Return if user tries to select more than 15 minutes
    return end - start === minutes15;
  }

  changedView(): void {}

  next(): void {}

  prev(): void {}

  today(): void {}

  onNewEntryClose(): void {
    this.showNewEntry = false;
  }

  ngAfterViewInit(): void {
    if (this.calendar) {
      const cellhover = new CellHover(this.calendar);
      cellhover.create();
      this.calendarApi = this.calendar.getApi();
    }
  }

  onAddEvent() {}
}
