import { Component, OnInit, AfterViewInit } from "@angular/core";
import Calendar from "tui-calendar";

@Component({
  selector: "app-calendar",
  templateUrl: "./calendar.component.html",
  styleUrls: ["./calendar.component.scss"]
})
export class CalendarComponent implements OnInit, AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    const calendar = new Calendar("#calendar", {
      useCreationPopup: true,
      defaultView: "day",
      usageStatistics: false,
      taskView: false,
      template: {
        timegridDisplayPrimaryTime: time => {
          return `${time.hour < 10 ? 0 : ""}${time.hour}:${
            time.minutes < 10 ? 0 : ""
          }${time.minutes}`;
        }

      },
      theme: {
      }
    });

    // calendar.createSchedules([
    //   {
    //     id: "1",
    //     calendarId: "1",
    //     title: "my schedule",
    //     category: "time",
    //     dueDateClass: "",
    //     start: "2019-11-22T22:30:00+09:00",
    //     end: "2019-11-22T02:30:00+09:00"
    //   },
    //   {
    //     id: "2",
    //     calendarId: "1",
    //     title: "second schedule",
    //     category: "time",
    //     dueDateClass: "",
    //     start: "2019-11-22T17:30:00+09:00",
    //     end: "2019-11-22T17:31:00+09:00"
    //   }
    // ]);

    calendar.on("beforeCreateSchedule", function(event) {
      // calendar.createSchedules(event);
      console.log(event);
    });
  }

  ngOnInit() {}
}
