import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "./lib/supabase";
import { useAppStore } from "./store/appStore";

import Dashboard from "./pages/Dashboard";
import WirdReader from "./pages/WirdReader";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";
import AccountSecurityPage from "./pages/AccountSecurityPage";
import EditProfilePage from "./pages/EditProfilePage";
import MediaLibraryPage from "./pages/MediaLibraryPage";
import AboutPage from "./pages/AboutPage";
import AudioPage from "./pages/AudioPage";
import WirdsPage from "./pages/WirdsPage";

import BottomNav from "./components/BottomNav";

import SuperAdminLoginPage from "./pages/superadmin/SuperAdminLoginPage";
import SuperAdminDashboard from "./pages/superadmin/SuperAdminDashboard";
import UsersManagementPage from "./pages/superadmin/UsersManagementPage";
import WirdsManagementPage from "./pages/superadmin/WirdsManagementPage";
import AddWirdPage from "./pages/superadmin/AddWirdPage";
import EditWirdPage from "./pages/superadmin/EditWirdPage";
import AudiosManagementPage from "./pages/superadmin/AudiosManagementPage";
import AddAudioPage from "./pages/superadmin/AddAudioPage";
import EditAudioPage from "./pages/superadmin/EditAudioPage";
import EbooksManagementPage from "./pages/superadmin/EbooksManagementPage";
import AddEbookPage from "./pages/superadmin/AddEbookPage";
import EditEbookPage from "./pages/superadmin/EditEbookPage";
import AdminRoute from "./components/AdminRoute";
import EbooksPage from './pages/EbooksPage';
import FavoritesPage from './pages/FavoritesPage';

function AppInit() {
  const { login, logout, setAuthLoading } = useAppStore();

  useEffect(() => {
    const syncUser = (user: any) => {
      login({
        email: user.email || "",
        displayName:
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          "Utilisateur",
        age: "",
        gender: "",
        phone: "",
        country: "",
        provider: user.app_metadata?.provider || "email",
      });
    };

    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();

        if (data.session?.user) {
          syncUser(data.session.user);
        }
      } catch (error) {
        console.error("Erreur récupération session:", error);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        syncUser(session.user);
      } else {
        logout();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [login, logout, setAuthLoading]);

  return null;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authLoading } = useAppStore();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mx-auto mb-3" />
          <p className="text-gray-600 dark:text-gray-300">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNav />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppInit />

      <Routes>
        {/* Auth */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <LoginPage />
            </AuthLayout>
          }
        />

        <Route
          path="/register"
          element={
            <AuthLayout>
              <RegisterPage />
            </AuthLayout>
          }
        />

        {/* Dashboard */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Dashboard />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Wird Reader */}
        <Route
          path="/wird/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WirdReader />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/wirds"
          element={
            <ProtectedRoute>
              <MainLayout>
                <WirdsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Audio */}
        <Route
          path="/audio"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AudioPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Media */}
        <Route
          path="/media"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MediaLibraryPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
  path="/ebooks"
  element={
    <ProtectedRoute>
      <MainLayout>
        <EbooksPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/favorites"
  element={
    <ProtectedRoute>
      <MainLayout>
        <FavoritesPage />
      </MainLayout>
    </ProtectedRoute>
  }
/>

        {/* Settings */}
        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <SettingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/edit"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/account-security"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AccountSecurityPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <ProtectedRoute>
              <MainLayout>
                <AboutPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Super Admin Login */}

        <Route path="/superadmin/login" element={<SuperAdminLoginPage />} />

        {/* Dashboard Super Admin */}

        <Route
          path="/superadmin"
          element={
            <AdminRoute>
              <SuperAdminDashboard />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/dashboard"
          element={
            <AdminRoute>
              <SuperAdminDashboard />
            </AdminRoute>
          }
        />

        {/* Gestion Utilisateurs */}

        <Route
          path="/superadmin/users"
          element={
            <AdminRoute>
              <UsersManagementPage />
            </AdminRoute>
          }
        />

        {/* Gestion Wirds */}

        <Route
          path="/superadmin/wirds"
          element={
            <AdminRoute>
              <WirdsManagementPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/wirds/add"
          element={
            <AdminRoute>
              <AddWirdPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/wirds/edit/:id"
          element={
            <AdminRoute>
              <EditWirdPage />
            </AdminRoute>
          }
        />

        {/* Gestion Audios */}

        <Route
          path="/superadmin/audios"
          element={
            <AdminRoute>
              <AudiosManagementPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/audios/add"
          element={
            <AdminRoute>
              <AddAudioPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/audios/edit/:id"
          element={
            <AdminRoute>
              <EditAudioPage />
            </AdminRoute>
          }
        />

        {/* Gestion E-books */}

        <Route
          path="/superadmin/ebooks"
          element={
            <AdminRoute>
              <EbooksManagementPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/ebooks/add"
          element={
            <AdminRoute>
              <AddEbookPage />
            </AdminRoute>
          }
        />

        <Route
          path="/superadmin/ebooks/edit/:id"
          element={
            <AdminRoute>
              <EditEbookPage />
            </AdminRoute>
          }
        />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
