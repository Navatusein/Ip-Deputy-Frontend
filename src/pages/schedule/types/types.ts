import {ICouple} from "@/entities/couple";
import dayjs from "dayjs";

export interface IScheduleTable {
  id: string;
  index: number;
  time: string;
  couples : ICouple[];
  rowSpan: number;
  isColSpan: boolean;
}

export interface IScheduleDateForm {
  date: dayjs.Dayjs;
}

export interface IScheduleForm {
  id: number;
  subjectId: number;
  subjectTypeId: number;
  dayOfWeekId: number;
  coupleTimeId: number;
  isRolling: boolean;
  subgroupId?: number;
  teacherId: number;
  additionalInformation?: string;
  link?: string;
  startEndDateRange?: dayjs.Dayjs[];
  additionalDates?: IScheduleDateForm[];
  removedDates?: IScheduleDateForm[];
}