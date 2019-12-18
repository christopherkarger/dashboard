import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Validator } from "../../utilities/validator";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import momentPlugin from "@fullcalendar/moment";
import { DateSpanApi } from "@fullcalendar/core";

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

  calendarForm: FormGroup;
  showNewEntry = false;

  constructor(private fb: FormBuilder) {
    //let calendarApi = Validator.require(this.calendarComponent).getApi();

    this.calendarForm = this.fb.group({
      calendarView: "week"
    });
  }

  onSelect(evt: DateSpanApi) {
    console.log(evt);
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
    if (!this.calendar) {
      return;
    }

    function offset(el: HTMLElement | Element) {
      var rect = el.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      return {
        top: rect.top + scrollTop,
        left: rect.left + scrollLeft,
        width: rect.width,
        height: rect.height
      };
    }

    const calendarApi = this.calendar.getApi();
    const calendarElm = calendarApi.el;
    const calendarBody: HTMLElement | null = calendarElm.querySelector(
      ".fc-body"
    );

    const timeGrid = calendarElm.querySelector(".fc-time-grid");
    const tableCells = calendarElm.querySelectorAll(".fc-slats td:last-child");
    const timeCells = calendarElm.querySelectorAll(".fc-slats td:first-child");
    const dayHeaderCells = calendarElm.querySelectorAll(".fc-day-header");
    const daysLength = dayHeaderCells.length;
    let leftPos: number | null;
    let cellHover: HTMLElement | null;

    if (!calendarBody || !timeGrid || !tableCells || !timeCells) {
      throw new Error("Cant select, did HTML change ?");
    }

    calendarBody.addEventListener("mouseenter", (event: MouseEvent) => {
      timeGrid.insertAdjacentHTML(
        "beforeend",
        `<div class="cell-hover"></div>`
      );

      cellHover = calendarElm.querySelector(".cell-hover");
    });

    calendarBody.addEventListener("mouseleave", () => {
      if (cellHover && cellHover.parentNode) {
        cellHover.parentNode.removeChild(cellHover);
        cellHover = null;
        leftPos = null;
      }
    });

    Array.prototype.slice.call(timeCells).forEach((elm: HTMLElement, index) => {
      elm.addEventListener("mouseenter", (event: MouseEvent) => {
        if (cellHover) {
          cellHover.style.display = "none";
        }
      });
    });

    Array.prototype.slice
      .call(tableCells)
      .forEach((elm: HTMLElement, index) => {
        elm.addEventListener("mousemove", (event: MouseEvent) => {
          const clientBound = offset(elm);
          const leftPercentage =
            (event.clientX - clientBound.left) / clientBound.width;
          const activeRow = Math.ceil(daysLength * leftPercentage);
          const activeDayClientBound = offset(
            dayHeaderCells[activeRow > 0 ? activeRow - 1 : 0]
          );

          if (activeDayClientBound.left !== leftPos) {
            leftPos = activeDayClientBound.left;
            if (cellHover) {
              cellHover.style.left = `${leftPos}px`;
            }
          }
        });

        elm.addEventListener("mouseenter", (event: MouseEvent) => {
          const clientBound = offset(elm);
          const width = Math.ceil(clientBound.width / daysLength);
          const height = clientBound.height;

          if (cellHover) {
            const topPos = offset(elm).top - offset(calendarBody).top;
            cellHover.style.display = "block";
            cellHover.style.top = `${topPos}px`;
            cellHover.style.width = `${width}px`;
            cellHover.style.height = `${height}px`;
          }
        });
      });
  }

  onAddEvent() {}
}
