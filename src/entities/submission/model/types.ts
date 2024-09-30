export enum PreferredPosition {
  InBegin,
  DoesNotMatter,
  InEnd,
  OtherSubgroup
}

export interface ISubmissionStudent {
  id: number;
  submissionWorkId: number;
  studentId: number;
  submissionsConfigId: number;
  preferredPosition: PreferredPosition | number;
  submittedAt: string;
}

export interface ISubmissionWork {
  id: number;
  name: string;
  index: number;
}

export interface ISubmissionsConfig {
  id: number;
  subgroupId?: number;
  subjectId?: number;
  subjectTypeId?: number;
  customType?: string;
  customName?: string;
  submissionWorks: ISubmissionWork[];
  submissionStudents: ISubmissionStudent[];
}