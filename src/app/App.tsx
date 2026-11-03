import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LaunchListPage } from '../pages/LaunchListPage';
import { LaunchDetailPage } from '../pages/LaunchDetailPage';

export function App() {
  return (
    <BrowserRouter>
      <header className="app-header">
        <strong>AstroBookings</strong>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<LaunchListPage />} />
          <Route path="/launches/:id" element={<LaunchDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
