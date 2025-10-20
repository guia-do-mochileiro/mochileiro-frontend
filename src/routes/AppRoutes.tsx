// src/routes/AppRoutes.tsx
import { Routes, Route } from "react-router-dom";
import GuestRoute from "#/routes/GuestRoute";
import ProtectedRoute from "#/routes/ProtectedRoute";

import Landing from "#/modules/authentication/pages/LandingPage";
import LoginOverlay from "#/modules/authentication/pages/LoginOverlay";
import RegisterOverlay from "#/modules/authentication/pages/RegisterOverlay";

import GuideHome from "#/modules/guide/pages/GuidePage.tsx"; // exemplo
import GuideQuizPage from "#/modules/guide/pages/GuideQuizPage";


export default function AppRoutes() {
  return (
    <Routes>
      {/* Público (bloqueado se já estiver logado) */}
      <Route element={<GuestRoute />}>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginOverlay />} />
        <Route path="/register" element={<RegisterOverlay />} />
      </Route>

      {/* Logado */}
<Route element={<ProtectedRoute />}>
  <Route path="/guide" element={<GuideHome />} />
  <Route path="/guide/quiz/:stateCode/:missionId" element={<GuideQuizPage />} />
</Route>


      <Route path="*" element={<Landing />} />
    </Routes>
  );
}
