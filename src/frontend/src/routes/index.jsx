import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../App.jsx";
import ArtisanRegister from "../pages/ArtisanRegister.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

import ArtisanLayout from "../layouts/ArtisanLayout.jsx";

import ArtisanDashboard from "../pages/ArtisanDashboard";
import ArtisanProfile from "../pages/ArtisanProfile";
import ArtisanAddProduct from "../pages/ArtisanAddProduct";

import { ROUTES } from "./paths.js";

export default function AppRouter() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={ROUTES.LOGIN} element={<Login />} />
      <Route path={ROUTES.REGISTER} element={<Register />} />
      <Route path={ROUTES.ARTISAN_REGISTER} element={<ArtisanRegister />} />

      <Route path="/ArtisanRegister" element={<Navigate to={ROUTES.ARTISAN_REGISTER} replace />} />

        <Route element={<ArtisanLayout />}>
          <Route path={ROUTES.ARTISAN_DASHBOARD} element={<ArtisanDashboard />} />
          <Route path={ROUTES.ARTISAN_PROFILE} element={<ArtisanProfile />} />
          <Route path={ROUTES.ARTISAN_ADD_PRODUCT} element={<ArtisanAddProduct />} />
        </Route>

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
