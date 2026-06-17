import { Route, Routes, useParams } from 'react-router-dom';
import { locales, type Locale } from './lib/i18n';
import { LocaleProvider } from './lib/locale';
import BaseLayout from './layouts/BaseLayout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ProgramsPage from './pages/ProgramsPage';
import MediaPage from './pages/MediaPage';
import ContactPage from './pages/ContactPage';
import EnrollPage from './pages/EnrollPage';
import NotFound from './pages/NotFound';

import RequireAuth from './components/admin/RequireAuth';
import Login from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminEnrollments from './pages/admin/Enrollments';
import AdminPosts from './pages/admin/Posts';
import AdminMedia from './pages/admin/Media';
import AdminSettings from './pages/admin/Settings';
import AdminUsers from './pages/admin/Users';

/**
 * Public site chrome. Reads the optional `:lang` route param; an unknown first
 * segment that isn't a supported locale renders a 404 inside the site chrome.
 */
function PublicShell() {
  const { lang } = useParams();
  if (lang !== undefined && !locales.includes(lang as Locale)) {
    return (
      <LocaleProvider lang={undefined}>
        <BaseLayout>
          <NotFound />
        </BaseLayout>
      </LocaleProvider>
    );
  }
  return (
    <LocaleProvider lang={lang}>
      <BaseLayout />
    </LocaleProvider>
  );
}

/** The same public pages are mounted at the root and under the `:lang` prefix. */
function publicRoutes() {
  return (
    <>
      <Route index element={<HomePage />} />
      <Route path="about" element={<AboutPage />} />
      <Route path="programs" element={<ProgramsPage />} />
      <Route path="media" element={<MediaPage />} />
      <Route path="contact" element={<ContactPage />} />
      <Route path="enroll" element={<EnrollPage />} />
      <Route path="*" element={<NotFound />} />
    </>
  );
}

export default function App() {
  return (
    <Routes>
      {/* Public — English (no prefix) */}
      <Route element={<PublicShell />}>{publicRoutes()}</Route>

      {/* Public — /my and /th */}
      <Route path=":lang" element={<PublicShell />}>
        {publicRoutes()}
      </Route>

      {/* Admin */}
      <Route path="/admin/login" element={<Login />} />
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/enrollments" element={<AdminEnrollments />} />
        <Route path="/admin/posts" element={<AdminPosts />} />
        <Route path="/admin/media" element={<AdminMedia />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}
