import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LaunchListPage } from '../pages/LaunchListPage';
import { LaunchDetailPage } from '../pages/LaunchDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { MyBookingsPage } from '../pages/MyBookingsPage';
import { AppHeader } from '../components/AppHeader';
import { RequireAuth } from '../components/RequireAuth';
import { SessionProvider } from './session-context';
import { ToastProvider } from './toast-context';

export function App() {
  return (
    <SessionProvider>
      <ToastProvider>
        <BrowserRouter>
          <AppHeader />
          <main>
            <Routes>
              <Route path="/" element={<LaunchListPage />} />
              <Route path="/launches/:id" element={<LaunchDetailPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/bookings"
                element={
                  <RequireAuth>
                    <MyBookingsPage />
                  </RequireAuth>
                }
              />
            </Routes>
          </main>
        </BrowserRouter>
      </ToastProvider>
    </SessionProvider>
  );
}

