import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

// Cadre commun à toutes les pages : <Outlet /> est l'endroit où la page de la route courante s'insère
export default function Layout() {
  return (
    <div className="app">
      <Navbar />
      <main className="app-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
