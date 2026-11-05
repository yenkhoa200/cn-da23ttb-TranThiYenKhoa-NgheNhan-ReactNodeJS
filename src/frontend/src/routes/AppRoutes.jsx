import { Navigate, Route, Routes } from "react-router-dom";

import HomePage from "../pages/public/HomePage.jsx";
import TouristHomePage from "../pages/tourist/TouristHome.jsx";
import LoginPage from "../pages/auth/Login.jsx";
import RegisterPage from "../pages/auth/Register.jsx";
import ArtisanRegisterPage from "../pages/artisan/ArtisanRegister.jsx";
import ArtisanDashboardPage from "../pages/artisan/ArtisanDashboard.jsx";
import ArtisanLayout from "../components/layout/ArtisanLayout.jsx";
import ArtisanProfilePage from "../pages/artisan/ArtisanProfile.jsx";
import ArtisanAddProductPage from "../pages/artisan/ArtisanAddProduct.jsx";
import ArtisanStoryPage from "../pages/artisan/ArtisanStory.jsx";
import ExperienceManagerPage from "../pages/artisan/ExperienceManagerPage.jsx";
import ExperienceCreatePage from "../pages/artisan/ExperienceCreatePage.jsx";
import AdminDashboardPage from "../pages/admin/AdminDashboard.jsx";
import AdminOverviewPage from "../pages/admin/AdminOverviewPage.jsx";
import AdminAccountsPage from "../pages/admin/AdminAccountsPage.jsx";
import AdminArtisansPage from "../pages/admin/AdminArtisansPage.jsx";
import AdminCraftsPage from "../pages/admin/AdminCraftsPage.jsx";
import AdminProductsPage from "../pages/admin/AdminProductsPage.jsx";
import AdminStoriesPage from "../pages/admin/AdminStoriesPage.jsx";
import AdminExperiencesPage from "../pages/admin/AdminExperiencesPage.jsx";
import AdminMediaPage from "../pages/admin/AdminMediaPage.jsx";
import AdminReviewsPage from "../pages/admin/AdminReviewsPage.jsx";
import AdminReportsPage from "../pages/admin/AdminReportsPage.jsx";
import { ROUTES } from "./path.js";

function AppRoutes() {
  return (
    <Routes>
      {/* Các route dùng component đang có trong src/pages thay vì file không tồn tại. */}
      <Route path={ROUTES.HOME} element={<HomePage />} />
      <Route path={`${ROUTES.TOURIST}/*`} element={<TouristHomePage />} />
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      <Route path={ROUTES.ARTISAN_LOGIN} element={<LoginPage initialAccountType="artisan" />} />
      <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      <Route path={ROUTES.ARTISAN_REGISTER} element={<ArtisanRegisterPage />} />
      {/* Các trang nghệ nhân dùng chung layout điều hướng và header. */}
      <Route element={<ArtisanLayout />}>
        <Route path={ROUTES.ARTISAN_DASHBOARD} element={<ArtisanDashboardPage />} />
        <Route path={ROUTES.ARTISAN_PROFILE} element={<ArtisanProfilePage />} />
        <Route path={ROUTES.ARTISAN_ADD_PRODUCT} element={<ArtisanAddProductPage />} />
        <Route path={ROUTES.ARTISAN_STORY} element={<ArtisanStoryPage />} />
        <Route path={ROUTES.ARTISAN_EXPERIENCES} element={<ExperienceManagerPage />} />
        <Route path={ROUTES.ARTISAN_EXPERIENCE_CREATE} element={<ExperienceCreatePage />} />
        <Route path="/artisan/dashboard" element={<Navigate to={ROUTES.ARTISAN_DASHBOARD} replace />} />
      </Route>
      <Route path="/admin-dashboard" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
      {/* Shell dùng chung, mỗi chức năng quản trị có route và component riêng. */}
      <Route path="/admin" element={<AdminDashboardPage />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="accounts" element={<AdminAccountsPage />} />
        <Route path="artisans" element={<AdminArtisansPage />} />
        <Route path="crafts" element={<AdminCraftsPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="stories" element={<AdminStoriesPage />} />
        <Route path="experiences" element={<AdminExperiencesPage />} />
        <Route path="media" element={<AdminMediaPage />} />
        <Route path="reviews" element={<AdminReviewsPage />} />
        <Route path="reports" element={<AdminReportsPage />} />
        <Route path="*" element={<Navigate to={ROUTES.ADMIN_DASHBOARD} replace />} />
      </Route>
      {/* Những đường dẫn chưa được khai báo sẽ quay về trang chủ. */}
      <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
    </Routes>
  );
}

export default AppRoutes;