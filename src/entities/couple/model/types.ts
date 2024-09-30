export interface ICoupleDate {
  id: number;
  date: string;
}

export interface ICouple {
  id: number;
  subjectId: number;
  subjectTypeId: number;
  dayOfWeekId: number;
  coupleTimeId: number;
  subgroupId?: number;
  teacherId: number;
  startDate?: string;
  endDate?: string;
  isRolling: boolean;
  additionalInformation?: string;
  cabinet: string;
  link?: string;
  additionalDates: ICoupleDate[];
  removedDates: ICoupleDate[];
}