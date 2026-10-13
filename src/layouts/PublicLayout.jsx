import { Outlet, useLocation } from 'react-router-dom';
import PublicNavbar from '../components/layouts/PublicNavbar';
import PublicFooter from '../components/layouts/PublicFooter';

export default function PublicLayout() {
  const location = useLocation();
  // Remove public footer from booking receipt and confirmation pages
  const isReceiptPage = location.pathname.startsWith('/booking/confirmation');

  return (
    <div className="app-shell">
      <PublicNavbar />
      <main id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
      {!isReceiptPage && <PublicFooter />}
    </div>
  );
}
