import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../App.jsx";
import ArtisanRegister from "../pages/ArtisanRegister.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";

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
      <Route path="/artisan-dashboard" element={<ArtisanDashboard />} />
      <Route path="/artisan-profile" element={<ArtisanProfile />} />
      <Route path="/artisan-add-product" element={<ArtisanAddProduct />} />

      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}
