export interface IAdditionalCouple {
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
  link?: string;
}