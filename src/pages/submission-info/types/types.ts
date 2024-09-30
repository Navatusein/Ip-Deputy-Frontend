import {PreferredPosition} from "@/entities/submission";

export interface ISubmissionItem {
  id: number;
  studentId: number;
  name: string;
  index: number;
  submittedAt: string;
}

export interface ISubmissionListItem {
  studentId: number;
  student: string;
  fistSubmittedAt: string;
  lastSubmittedAt: string;
  preferredPosition: PreferredPosition;
  submissions: ISubmissionItem[];
  submissionConfigId: number;
}

export interface IFilterOptions {
  subgroupId: number;
  search: string;
}