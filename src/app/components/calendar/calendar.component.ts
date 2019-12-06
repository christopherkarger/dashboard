import { Component, AfterContentInit } from "@angular/core";
import Calendar, { IEventObject, ISchedule } from "tui-calendar";
import { Validator } from '../../utilities/validator';

import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements AfterContentInit {
  private calendar?: Calendar;
  calendarForm: FormGroup;
  newEntryData?: ISchedule;
  showNewEntry = false;

  constructor(
    private fb: FormBuilder
  ) {
    this.calendarForm = this.fb.group({
      calendarView: 'week'
    });
  }

  changedView(): void {
    if (this.calendar) {
      this.calendar.changeView(this.calendarForm.value.calendarView, true);
    }
  }

  next(): void {
    if (this.calendar) {
      this.calendar.next();
    }
  }

  prev(): void {
    if (this.calendar) {
      this.calendar.prev();
    }
  }

  today(): void {
    if (this.calendar) {
      this.calendar.today();
    }
  }

  onNewEntryClose(): void {
    this.showNewEntry = false;
  }

  ngAfterContentInit(): void  {
    this.calendar = new Calendar("#calendar", {
      useCreationPopup: false,
      useDetailPopup: false,
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
    this.calendar.on('beforeUpdateSchedule', (event: IEventObject) => {
      const schedule = event.schedule;
      
      if (this.calendar && event.changes) {
        this.calendar.updateSchedule(
          Validator.require(schedule.id),
          Validator.require(schedule.calendarId),
          event.changes
        );
      } else {
        throw new Error('event changes are missing');
      }
    });

    this.calendar.on("beforeCreateSchedule", (event: ISchedule) => {
      this.newEntryData = event;
      this.showNewEntry = true;
    });

    this.calendar.on("clickSchedule", (event: any) => {
      console.log('clickSchedule', event);
    });

  }


  mockFakeDate(): void  {
    const minutes30 = (1000 * 60 * 60);
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + minutes30);

    const date3 = new Date(date2.getTime() + minutes30);
    const date4 = new Date(date3.getTime() + (minutes30 * 2));
    if (this.calendar) {
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
  }
}
