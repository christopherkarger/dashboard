import { Component, OnInit, AfterViewInit } from "@angular/core";
import Calendar from "tui-calendar";
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  calendarForm: FormGroup;
  calendar: Calendar;

  constructor(
    private fb: FormBuilder
  ) {
    this.calendarForm = this.fb.group({
      calendarView: 'week'
    });
  }

  changedView(): void {
    this.calendar.changeView(this.calendarForm.value.calendarView, true);
  }

  next(): void {  
    this.calendar.next();
  }

  prev(): void {  
    this.calendar.prev();
  }

  today(): void {  
    this.calendar.today();
  }

  ngAfterViewInit() {
    this.calendar = new Calendar("#calendar", {
      useCreationPopup: true,
      defaultView: "week",
      usageStatistics: false,
      taskView: false,
      template: {
        timegridDisplayPrimaryTime: time => {
          return `${time.hour < 10 ? 0 : ""}${time.hour}:${
            time.minutes < 10 ? 0 : ""
          }${time.minutes}`;
        }
      },
      week: {
        daynames: ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'],
        startDayOfWeek: 1
      },
      theme: {
      }
    });

    this.mockFakeDate();

    this.calendar.on("beforeCreateSchedule", (event) => {
      // calendar.createSchedules(event);
      console.log(event);
    });
    
    this.calendar.on('beforeUpdateSchedule', (event) => {
      const schedule = event.schedule;
      this.calendar.updateSchedule(schedule.id, schedule.calendarId, event.changes);
    });

  }


  mockFakeDate() {
    const minutes30 = (1000*60*60);
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + minutes30);

    const date3 = new Date(date2.getTime() + minutes30);
    const date4 = new Date(date3.getTime() + (minutes30 * 2));

    this.calendar.createSchedules([
      {
        id: "1",
        calendarId: "1",
        title: "my schedule",
        category: "time",
        dueDateClass: "",
        start: date1.toISOString(),
        end: date2.toISOString()
      },
      {
        id: "2",
        calendarId: "1",
        title: "second schedule",
        category: "time",
        dueDateClass: "",
        start: date3.toISOString(),
        end: date4.toISOString()
      }
    ]);
  }
  ngOnInit() {}
}
