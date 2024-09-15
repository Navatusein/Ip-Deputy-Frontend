import {submissionConfigApi} from "./api/submission-config-api";
import {submissionStudentApi} from "./api/submission-student-api";
import {ISubmissionStudent, PreferredPosition, ISubmissionWork, ISubmissionsConfig} from "./model/types";

export type {ISubmissionStudent, ISubmissionWork, ISubmissionsConfig};
export {submissionStudentApi, submissionConfigApi, PreferredPosition};