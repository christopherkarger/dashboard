import { FullCalendarComponent } from "@fullcalendar/angular";
import { IOffset } from "../../../models/cellhover.model";

type TMouseEvent = (evt: MouseEvent) => void;
export class CellHover {
  calendarBody?: HTMLElement | null;
  calendarElm?: HTMLElement;
  timeGrid?: HTMLElement | null;
  tableCells?: NodeListOf<HTMLElement> | null;
  tableCellsArr?: HTMLElement[];
  timeCells?: NodeListOf<HTMLElement> | null;
  timeCellsArr?: HTMLElement[];
  dayHeaderCells?: NodeListOf<HTMLElement> | null;
  timeSteps?: number;
  daysLength?: number;
  leftPos?: number | null;
  cellHover?: HTMLElement | null;
  calendarBodyEnter?: TMouseEvent;
  calendarBodyLeave?: TMouseEvent;
  timeCellsEnter: TMouseEvent[] = [];
  tableCellsMove: TMouseEvent[] = [];
  tableCellsEnter: TMouseEvent[] = [];

  constructor(private calendar: FullCalendarComponent) {
    this.init();
  }

  private offset(el: HTMLElement): IOffset {
    const rect = el.getBoundingClientRect();
    const scrollLeft =
      window.pageXOffset || document.documentElement.scrollLeft;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {
      top: rect.top + scrollTop,
      left: rect.left + scrollLeft,
      width: rect.width,
      height: rect.height
    };
  }

  init(): void {
    const calendarApi = this.calendar.getApi();
    this.calendarElm = calendarApi.el;
    this.calendarBody = this.calendarElm.querySelector<HTMLElement>(".fc-body");
    this.timeGrid = this.calendarElm.querySelector<HTMLElement>(
      ".fc-time-grid"
    );

    this.tableCells = this.calendarElm.querySelectorAll(
      ".fc-slats td:last-child"
    );
    if (this.tableCells) {
      this.tableCellsArr = this.convertNodeListToArray(this.tableCells);
    }

    this.timeCells = this.calendarElm.querySelectorAll(
      ".fc-slats td:first-child"
    );

    if (this.timeCells) {
      this.timeCellsArr = this.convertNodeListToArray(this.timeCells);
    }

    this.dayHeaderCells = this.calendarElm.querySelectorAll(".fc-day-header");
    if (this.timeCells) {
      this.timeSteps = 60 / (this.timeCells.length / 24);
    }
    if (this.dayHeaderCells) {
      this.daysLength = this.dayHeaderCells.length;
    }
    this.create();
  }

  destroy(): void {
    this.cleanUp();

    if (this.calendarBody) {
      if (this.calendarBodyEnter) {
        this.calendarBody.removeEventListener(
          "mouseenter",
          this.calendarBodyEnter
        );
      }

      if (this.calendarBodyLeave) {
        this.calendarBody.removeEventListener(
          "mouseleave",
          this.calendarBodyLeave
        );
      }

      if (this.timeCellsArr) {
        this.timeCellsArr.forEach((elm: HTMLElement, index: number) => {
          if (this.timeCellsEnter && this.timeCellsEnter[index]) {
            elm.removeEventListener("mouseenter", this.timeCellsEnter[index]);
          }
        });
        this.timeCellsEnter = [];
      }

      if (this.tableCellsArr) {
        this.tableCellsArr.forEach((elm: HTMLElement, index: number) => {
          if (this.tableCellsMove && this.tableCellsMove[index]) {
            elm.removeEventListener("mousemove", this.tableCellsMove[index]);
          }
          if (this.tableCellsEnter && this.tableCellsEnter[index]) {
            elm.removeEventListener("mouseenter", this.tableCellsEnter[index]);
          }
        });

        this.tableCellsMove = [];
        this.tableCellsEnter = [];
      }
    }
  }

  private cleanUp(): void {
    if (this.cellHover && this.cellHover.parentNode) {
      this.cellHover.parentNode.removeChild(this.cellHover);
      this.cellHover = null;
      this.leftPos = null;
    }
  }

  private convertNodeListToArray(list: NodeListOf<HTMLElement>): HTMLElement[] {
    return Array.prototype.slice.call(list);
  }

  private create(): void {
    if (
      !this.calendarBody ||
      !this.timeGrid ||
      !this.tableCellsArr ||
      !this.timeCellsArr ||
      !this.calendarElm
    ) {
      throw new Error("Can't select, did HTML change ?");
    }

    this.calendarBody.addEventListener(
      "mouseenter",
      (this.calendarBodyEnter = () => {
        this.cleanUp();
        if (this.timeGrid && this.calendarElm) {
          this.timeGrid.insertAdjacentHTML(
            "beforeend",
            `<div class="cell-hover"></div>`
          );

          this.cellHover = this.calendarElm.querySelector<HTMLElement>(
            ".cell-hover"
          );
        }
      })
    );

    this.calendarBody.addEventListener(
      "mouseleave",
      (this.calendarBodyLeave = () => {
        this.cleanUp();
      })
    );

    this.timeCellsArr.forEach((elm: HTMLElement) => {
      const enterFunc = () => {
        if (this.cellHover) {
          this.cellHover.style.display = "none";
        }
      };
      this.timeCellsEnter.push(enterFunc);
      elm.addEventListener("mouseenter", enterFunc);
    });

    this.tableCellsArr.forEach((elm: HTMLElement, index: number) => {
      const moveFunc = (event: MouseEvent) => {
        this.setLeftPosition(elm, event);
      };

      this.tableCellsMove.push(moveFunc);
      elm.addEventListener("mousemove", moveFunc);

      const enterFunc = (event: MouseEvent) => {
        if (!this.cellHover || !this.calendarBody || !this.dayHeaderCells) {
          throw new Error("something is not defined");
        }

        const width = this.dayHeaderCells[0].scrollWidth;
        const height = elm.scrollHeight;
        let topPos = this.offset(elm).top - this.offset(this.calendarBody).top;

        // To-Do: Get rid of this
        // to show cellhover under the border of 1px
        topPos += 1;

        this.cellHover.style.display = "block";
        this.cellHover.style.top = `${topPos}px`;
        this.cellHover.style.width = `${width}px`;
        this.cellHover.style.height = `${height}px`;
        this.setLeftPosition(elm, event);
        this.calculateCellTime(index);
      };
      this.tableCellsEnter.push(enterFunc);
      elm.addEventListener("mouseenter", enterFunc);
    });
  }

  private addLeadingZero(num: number): string {
    return `${num < 10 ? 0 : ""}${num}`;
  }

  private calculateCellTime(index: number): void {
    if (this.timeSteps) {
      const timeRaw = (index * this.timeSteps) / 60;
      const startMinutes: number | string = 60 * (timeRaw % 1);
      const hour: number | string = Math.floor(timeRaw);
      const startTime = `${this.addLeadingZero(hour)}:${this.addLeadingZero(
        startMinutes
      )}`;

      if (this.cellHover) {
        this.cellHover.innerHTML = `${startTime}`;
      }
    }
  }

  private setLeftPosition(elm: HTMLElement, event: MouseEvent): void {
    if (!this.calendarElm || !this.dayHeaderCells || !this.daysLength) {
      throw new Error("something is not defined");
    }
    const clientBound = this.offset(elm);
    const leftPercentage =
      (event.clientX - clientBound.left + 1) / clientBound.width;
    const activeRow = Math.ceil(this.daysLength * leftPercentage);
    const activeDayClientBound = this.offset(
      this.dayHeaderCells[activeRow > 0 ? activeRow - 1 : 0]
    );

    if (activeDayClientBound.left !== this.leftPos) {
      this.leftPos =
        activeDayClientBound.left - this.offset(this.calendarElm).left;
      if (this.cellHover) {
        this.cellHover.style.left = `${this.leftPos}px`;
      }
    }
  }
}
