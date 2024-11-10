import { createBrowserRouter } from "react-router-dom";
import { MainLayout } from "@/components/layout/main-layout";
import { HomePage } from "@/pages/home";
import { GradeCalculatorPage } from "@/pages/grade-calculator";
import { RosterGeneratorPage } from "@/pages/roster-generator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "grade-calculator",
        element: <GradeCalculatorPage />,
      },
      {
        path: "roster-generator",
        element: <RosterGeneratorPage />,
      },
    ],
  },
]); 