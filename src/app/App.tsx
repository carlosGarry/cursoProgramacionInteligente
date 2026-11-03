import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LaunchListPage } from '../pages/LaunchListPage';
import { LaunchDetailPage } from '../pages/LaunchDetailPage';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { AppHeader } from '../components/AppHeader';
import { SessionProvider } from './session-context';

export function App() {
  return (
    <SessionProvider>
      <BrowserRouter>
        <AppHeader />
        <main>
          <Routes>
            <Route path="/" element={<LaunchListPage />} />
            <Route path="/launches/:id" element={<LaunchDetailPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </SessionProvider>
  );
}

