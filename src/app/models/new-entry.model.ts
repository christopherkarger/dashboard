import { ISchedule } from "tui-calendar";

export interface IEntryData extends ISchedule {
  guide?: {
    clearGuideElement: () => void;
  };
}

export interface INewEntry {
  date: Date;
}
