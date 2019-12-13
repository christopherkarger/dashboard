import { Component, AfterContentInit } from "@angular/core";
import Calendar, { IEventObject, ISchedule } from "tui-calendar";
import { Validator } from "../../utilities/validator";

import { FormBuilder, FormGroup } from "@angular/forms";
import { INewEntry, IEntryData } from "src/app/models/new-entry.model";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements AfterContentInit {
  calendar?: Calendar;
  calendarForm: FormGroup;
  newEntryData?: IEntryData;
  showNewEntry = false;

  constructor(private fb: FormBuilder) {
    this.calendarForm = this.fb.group({
      calendarView: "week"
    });
  }

  changedView(): void {
    Validator.require(this.calendar).changeView(
      this.calendarForm.value.calendarView,
      true
    );
  }

  next(): void {
    Validator.require(this.calendar).next();
  }

  prev(): void {
    Validator.require(this.calendar).prev();
  }

  today(): void {
    Validator.require(this.calendar).today();
  }

  onNewEntryClose(): void {
    this.showNewEntry = false;
    this.clearGuide();
  }

  clearGuide() {
    Validator.require(
      Validator.require(this.newEntryData).guide
    ).clearGuideElement();
  }

  ngAfterContentInit(): void {
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
        daynames: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
        startDayOfWeek: 1
      },
      theme: {
        "week.timegridOneHour.height": "100px"
      }
    });

    this.mockFakeDate();
    this.calendar.on("beforeUpdateSchedule", (event: IEventObject) => {
      const schedule = event.schedule;

      if (this.calendar && event.changes) {
        this.calendar.updateSchedule(
          Validator.require(schedule.id),
          Validator.require(schedule.calendarId),
          event.changes
        );
      } else {
        throw new Error("event changes are missing");
      }
    });

    this.calendar.on("beforeCreateSchedule", (event: ISchedule) => {
      this.newEntryData = event;
      this.showNewEntry = true;
    });

    this.calendar.on("clickSchedule", (event: any) => {
      console.log("clickSchedule", event);
    });
  }

  onAddEvent(event: INewEntry) {
    Validator.require(this.calendar).createSchedules([
      {
        // id: "3",
        //calendarId: "1",
        title: "added",
        category: "time",
        //dueDateClass: "",
        start: event.date.toISOString(),
        end: new Date(event.date.getTime() + 3000000).toISOString()
      }
    ]);

    this.clearGuide();
  }

  mockFakeDate(): void {
    const minutes30 = 1000 * 60 * 60;
    const date1 = new Date();
    const date2 = new Date(date1.getTime() + minutes30);

    const date3 = new Date(date2.getTime() + minutes30);
    const date4 = new Date(date3.getTime() + minutes30 * 2);
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
