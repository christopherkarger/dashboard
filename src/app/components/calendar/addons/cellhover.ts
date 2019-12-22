import { FullCalendarComponent } from "@fullcalendar/angular";
import { IOffset } from "./cellhover.model";

export class CellHover {
  calendarBody: HTMLElement | null;
  calendarElm: any;
  timeGrid: HTMLElement | null;
  tableCells: NodeListOf<Element> | null;
  timeCells: NodeListOf<Element> | null;
  dayHeaderCells: NodeListOf<Element> | null;
  timeSteps?: number;
  daysLength?: number;
  leftPos?: number | null;
  cellHover?: HTMLElement | null;

  constructor(private calendar: FullCalendarComponent) {
    const calendarApi = this.calendar.getApi();
    this.calendarElm = calendarApi.el;
    this.calendarBody = this.calendarElm.querySelector(".fc-body");
    this.timeGrid = this.calendarElm.querySelector(".fc-time-grid");
    this.tableCells = this.calendarElm.querySelectorAll(
      ".fc-slats td:last-child"
    );
    this.timeCells = this.calendarElm.querySelectorAll(
      ".fc-slats td:first-child"
    );
    this.dayHeaderCells = this.calendarElm.querySelectorAll(".fc-day-header");
    if (this.timeCells) {
      this.timeSteps = 60 / (this.timeCells.length / 24);
    }
    if (this.dayHeaderCells) {
      this.daysLength = this.dayHeaderCells.length;
    }
  }

  private cleanUp(): void {
    if (this.cellHover && this.cellHover.parentNode) {
      this.cellHover.parentNode.removeChild(this.cellHover);
      this.cellHover = null;
      this.leftPos = null;
    }
  }

  private offset(el: HTMLElement | Element): IOffset {
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

  create(): void {
    if (
      !this.calendarBody ||
      !this.timeGrid ||
      !this.tableCells ||
      !this.timeCells ||
      !this.calendarElm
    ) {
      throw new Error("Can't select, did HTML change ?");
    }

    this.calendarBody.addEventListener("mouseenter", (event: MouseEvent) => {
      this.cleanUp();

      if (this.timeGrid && this.calendarElm) {
        this.timeGrid.insertAdjacentHTML(
          "beforeend",
          `<div class="cell-hover"></div>`
        );

        this.cellHover = this.calendarElm.querySelector(".cell-hover");
      }
    });

    this.calendarBody.addEventListener("mouseleave", () => {
      this.cleanUp();
    });

    Array.prototype.slice.call(this.timeCells).forEach((elm: HTMLElement) => {
      elm.addEventListener("mouseenter", (event: MouseEvent) => {
        if (this.cellHover) {
          this.cellHover.style.display = "none";
        }
      });
    });

    Array.prototype.slice
      .call(this.tableCells)
      .forEach((elm: HTMLElement, index: number) => {
        elm.addEventListener("mousemove", (event: MouseEvent) => {
          this.setLeftPosition(elm, event);
        });

        elm.addEventListener("mouseenter", (event: MouseEvent) => {
          if (
            !this.daysLength ||
            !this.cellHover ||
            !this.calendarBody ||
            !this.dayHeaderCells
          ) {
            return;
          }

          const width = this.dayHeaderCells[0].scrollWidth;
          const height = elm.scrollHeight;
          let topPos =
            this.offset(elm).top - this.offset(this.calendarBody).top;

          // to show cellhover under the border of 1px
          if (index > 0) {
            topPos += 1;
          }
          this.cellHover.style.display = "block";
          this.cellHover.style.top = `${topPos}px`;
          this.cellHover.style.width = `${width}px`;
          this.cellHover.style.height = `${height}px`;
          this.setLeftPosition(elm, event);
          this.calculateCellTime(index);
        });
      });
  }

  addLeadingZero(num: number): string {
    return `${num < 10 ? 0 : ""}${num}`;
  }

  calculateCellTime(index: number): void {
    if (this.timeSteps) {
      const timeRaw = (index * this.timeSteps) / 60;
      const startMinutes: number | string = 60 * (timeRaw % 1);
      const hour: number | string = Math.floor(timeRaw);
      const startTime = `${this.addLeadingZero(hour)}:${this.addLeadingZero(
        startMinutes
      )}`;

      // const endMinutes = startMinutes + this.timeSteps;
      // const endTime =
      //   endMinutes === 60
      //     ? `${this.addLeadingZero(hour + 1)}:00`
      //     : `${this.addLeadingZero(hour)}:${endMinutes}`;

      if (this.cellHover) {
        this.cellHover.innerHTML = `${startTime}`;
      }
    }
  }

  setLeftPosition(elm: HTMLElement, event: MouseEvent): void {
    if (!this.dayHeaderCells || !this.daysLength) {
      return;
    }
    const clientBound = this.offset(elm);
    const leftPercentage =
      (event.clientX - clientBound.left + 1) / clientBound.width;
    const activeRow = Math.ceil(this.daysLength * leftPercentage);
    const activeDayClientBound = this.offset(
      this.dayHeaderCells[activeRow > 0 ? activeRow - 1 : 0]
    );

    if (activeDayClientBound.left !== this.leftPos) {
      this.leftPos = activeDayClientBound.left;
      if (this.cellHover) {
        this.cellHover.style.left = `${this.leftPos}px`;
      }
    }
  }
}
