import {createBrowserRouter} from "react-router-dom";
import BaseLayout from "@/app/layouts/base-layout/base-layout.tsx";
import {ErrorPage} from "@/pages/error";
import {LoginPage} from "@/pages/login";
import ProtectedLayout from "@/app/layouts/protected-layout/protected-layout.tsx";
import {DevPage} from "@/pages/dev";
import {StudentInfoPage} from "@/pages/student-info";
import DashboardLayout from "@/app/layouts/dashboard-layout/dashboard-layout.tsx";
import {SchedulePage} from "@/pages/schedule";
import {SubjectInfoPage} from "@/pages/subject-info";
import {SubgroupInfoPage} from "@/pages/subgroup-info";
import {TeacherInfoPage} from "@/pages/teacher-info";
import {TelegramInfoPage} from "@/pages/telegram-info";
import {SubmissionConfigPage} from "@/pages/submission-config";
import BotLayout from "@/app/layouts/bot-layout/bot-layout.tsx";
import SubmissionRegistrationPage
  from "../pages/submission-registration/ui/submission-registration-page/submission-registration-page.tsx";
import {SubmissionStudentPage} from "@/pages/submission-student";
import {SubmissionInfoPage} from "@/pages/submission-info";

export const router = createBrowserRouter([
  {
    element: <BaseLayout/>,
    errorElement: <BaseLayout><ErrorPage/></BaseLayout>,
    hasErrorBoundary: true,
    children: [
      {
        path: "/login",
        element: <LoginPage/>
      },
      {
        element: <BotLayout/>,
        children: [
          {
            path: "/bot-web-app/submission-registration",
            element: <SubmissionRegistrationPage/>
          },
          {
            path: "/bot-web-app/submission-student",
            element: <SubmissionStudentPage/>
          },
        ]
      },
      {
        element: <ProtectedLayout/>,
        children: [
          {
            element: <DashboardLayout/>,
            children: [
              {
                path: "/",
                element: <DevPage/>
              },
              {
                path: "/students-info",
                element: <StudentInfoPage/>
              },
              {
                path: "/subgroups-info",
                element: <SubgroupInfoPage/>
              },
              {
                path: "/telegrams-info",
                element: <TelegramInfoPage/>
              },
              {
                path: "/teachers-info",
                element: <TeacherInfoPage/>
              },
              {
                path: "/subjects-info",
                element: <SubjectInfoPage/>
              },
              {
                path: "/schedule",
                element: <SchedulePage/>
              },
              {
                path: "/submission-configs",
                element: <SubmissionConfigPage/>
              },
              {
                path: "/submission-info",
                element: <SubmissionInfoPage/>
              },
            ]
          }
        ]
      }
    ]
  }
])