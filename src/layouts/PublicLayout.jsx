import { Outlet } from 'react-router-dom';
import PublicNavbar from '../components/layouts/PublicNavbar';
import PublicFooter from '../components/layouts/PublicFooter';

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <PublicNavbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
