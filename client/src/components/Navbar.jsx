import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  // NavLink ajoute automatiquement la classe "active" sur le lien de la page courante
  const classeLien = ({ isActive }) => (isActive ? 'navbar-lien active' : 'navbar-lien');

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo">
          <span className="logo-icone">N</span>
          <span className="logo-texte">NDAKO<span>TECH</span></span>
        </Link>

        <nav className="navbar-liens">
          <NavLink to="/" end className={classeLien}>Accueil</NavLink>
          <NavLink to="/publier" className={classeLien}>Publier une annonce</NavLink>
          <Link to="/inscription" className="bouton bouton-orange bouton-petit">Connexion</Link>
        </nav>
      </div>
    </header>
  );
}
