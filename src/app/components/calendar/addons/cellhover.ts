import { FullCalendarComponent } from "@fullcalendar/angular";

interface IOffset {
  width: number;
  height: number;
  left: number;
  top: number;
}

export class CellHover {
  constructor(private calendar: FullCalendarComponent) {}

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
          const clientBound = this.offset(elm);
          const leftPercentage =
            (event.clientX - clientBound.left) / clientBound.width;
          const activeRow = Math.ceil(daysLength * leftPercentage);
          const activeDayClientBound = this.offset(
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
          const clientBound = this.offset(elm);
          const width = Math.ceil(clientBound.width / daysLength);
          const height = clientBound.height;

          if (cellHover) {
            const topPos = this.offset(elm).top - this.offset(calendarBody).top;
            cellHover.style.display = "block";
            cellHover.style.top = `${topPos}px`;
            cellHover.style.width = `${width}px`;
            cellHover.style.height = `${height}px`;
          }
        });
      });
  }
}
