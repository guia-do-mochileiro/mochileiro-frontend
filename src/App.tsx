import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Bounce, ToastContainer } from "react-toastify";

import LandingPage from "#/modules/authentication/pages/LandingPage";
import LoginOverlay from "#/modules/authentication/pages/LoginOverlay";
import RegisterOverlay from "#/modules/authentication/pages/RegisterOverlay";

import GuidePage from "#/modules/guide/pages/GuidePage.tsx";
import GuideSouthAmericaMapPage from "#/modules/guide/pages/GuideSouthAmericaMapPage";
import GuideRankingPage from "#/modules/guide/pages/GuideRankingPage";
import GuideAchievementsPage from "#/modules/guide/pages/GuideAchievementsPage";
import GuidePatentsPage from "#/modules/guide/pages/GuidePatentsPage";
import GuideQuizPage from "./modules/guide/pages/GuideQuizPage";
import GuestRoute from "#/routes/GuestRoute";
import ProtectedRoute from "#/routes/ProtectedRoute";

import "react-toastify/dist/ReactToastify.css";
import "./App.css";


const router = createBrowserRouter([
  {
    element: <GuestRoute />,
    children: [
      { index: true, element: <LandingPage /> },
      { path: "login", element: <LoginOverlay /> },
      { path: "register", element: <RegisterOverlay /> },
    ],
  },

  {
    element: <ProtectedRoute />,
    children: [
      
      {
        path: "guide",
        element: <GuidePage />,
        children: [
          { index: true, element: <GuideSouthAmericaMapPage /> },
          { path: "ranking", element: <GuideRankingPage /> },
          { path: "conquistas", element: <GuideAchievementsPage /> },
          { path: "patentes", element: <GuidePatentsPage /> },
        ],
      },

      
      { path: "guide/quiz/:stateCode/:missionId", element: <GuideQuizPage /> },
    ],
  },

  { path: "*", element: <Navigate to="/" replace /> },
]);

export default function App() {
  return (
    <>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID!}>
        <RouterProvider router={router} />
      </GoogleOAuthProvider>

      <ToastContainer
        theme="light"
        toastClassName="relative flex p-0 min-h-10 rounded-md overflow-hidden cursor-pointer"
        position="top-right"
        autoClose={5000}
        transition={Bounce}
        pauseOnHover={false}
        closeOnClick
        hideProgressBar
        newestOnTop
      />
    </>
  );
}
