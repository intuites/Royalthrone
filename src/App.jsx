import { BrowserRouter, Routes, Route } from "react-router-dom";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

// Public pages
import Home from "./pages/Home";
import Films from "./pages/Films";
import FilmDetails from "./pages/FilmDetails";
import About from "./pages/About";
import Awards from "./pages/Awards";
import Pitch from "./pages/Pitch";
import Contact from "./pages/Contact";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import ForgotPassword from "./pages/admin/ForgotPassword";
import ResetPassword from "./pages/admin/ResetPassword";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminMovies from "./pages/admin/AdminMovies";
import AdminMovieForm from "./pages/admin/AdminMovieForm";
import AdminMovieDetails from "./pages/admin/AdminMovieDetails";
import AdminAwards from "./pages/admin/AdminAwards";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🌐 PUBLIC WEBSITE */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/films" element={<Films />} />
          <Route path="/films/:id" element={<FilmDetails />} />
          <Route path="/about" element={<About />} />
          <Route path="/awards" element={<Awards />} />
          <Route path="/pitch" element={<Pitch />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* 🔐 ADMIN AUTH (NO LAYOUT, NO TOKEN REQUIRED) */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/admin/reset-password/:token"
          element={<ResetPassword />}
        />

        {/* 🛡️ ADMIN DASHBOARD (TOKEN REQUIRED) */}
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/movies" element={<AdminMovies />} />
          <Route path="/admin/movies/add" element={<AdminMovieForm />} />
          <Route path="/admin/movies/edit/:id" element={<AdminMovieForm />} />
          <Route path="/admin/movies/:id" element={<AdminMovieDetails />} />
          <Route path="/admin/awards" element={<AdminAwards />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
