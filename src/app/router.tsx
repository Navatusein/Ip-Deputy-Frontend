import {createBrowserRouter, Navigate} from "react-router-dom";
import BaseLayout from "@/app/layouts/base-layout/base-layout";
import {ErrorPage} from "@/pages/error";
import {LoginPage} from "@/pages/login";
import ProtectedLayout from "@/app/layouts/protected-layout/protected-layout";
import {StudentInfoPage} from "@/pages/student-info";
import DashboardLayout from "@/app/layouts/dashboard-layout/dashboard-layout";
import {SchedulePage} from "@/pages/schedule";
import {SubjectInfoPage} from "@/pages/subject-info";
import {SubgroupInfoPage} from "@/pages/subgroup-info";
import {TeacherInfoPage} from "@/pages/teacher-info";
import {TelegramInfoPage} from "@/pages/telegram-info";
import {SubmissionConfigPage} from "@/pages/submission-config";
import BotLayout from "@/app/layouts/bot-layout/bot-layout.tsx";
import {SubmissionStudentPage} from "@/pages/submission-student";
import {SubmissionInfoPage} from "@/pages/submission-info";
import {SubmissionRegistrationPage} from "@/pages/submission-registration";
import {HomePage} from "@/pages/home";
import DevLayout from "@/app/layouts/dev-layout/dev-layout.tsx";
import {DevPage} from "@/pages/dev";

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
                element: <Navigate to="/home" replace/>
              },
              {
                path: "/home",
                element: <HomePage/>
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
              {
                element: <DevLayout/>,
                children: [
                  {
                    path: "/dev",
                    element: <DevPage/>
                  },
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])