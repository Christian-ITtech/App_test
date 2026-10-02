import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import LogementCard from '../components/LogementCard';
import { fetchTous } from '../api/logements';

export default function HomePage() {
  const [verifies, setVerifies] = useState([]);

  // /logements/tous : un seul appel, on garde 3 biens vérifiés et disponibles
  useEffect(() => {
    fetchTous()
      .then((liste) => setVerifies(liste.filter((l) => l.verifie && !l.occupe).slice(0, 3)))
      .catch(() => setVerifies([]));
  }, []);

  return (
    <>
      <section className="hero">
        <div className="container hero-contenu">
          <span className="hero-badge">Brazzaville · Pointe-Noire</span>
          <h1>Trouvez votre <span>logement idéal</span></h1>
          <p className="hero-texte">
            Des annonces à Brazzaville et Pointe-Noire. Loyer transparent, aucune commission.
          </p>
          <SearchForm />
        </div>
      </section>

      {verifies.length > 0 && (
        <section className="section">
          <div className="container">
            <h2 className="section-titre">Annonces vérifiées</h2>
            <p className="section-sous-titre">Logements contrôlés par notre équipe</p>
            <div className="grille-logements">
              {verifies.map((l) => <LogementCard key={l.id} logement={l} />)}
            </div>
          </div>
        </section>
      )}

      <section className="section section-blanche">
        <div className="container">
          <h2 className="section-titre">Comment ça marche ?</h2>
          <p className="section-sous-titre">Simple, transparent, sans commission.</p>
          <div className="etapes">
            <div className="etape">
              <div className="etape-icone">🔍<span className="etape-numero">1</span></div>
              <h3>Recherchez</h3>
              <p>Choisissez une ville, un quartier et votre budget.</p>
            </div>
            <div className="etape">
              <div className="etape-icone">🏠<span className="etape-numero">2</span></div>
              <h3>Consultez</h3>
              <p>Photos, loyer réel, équipements et statut daté.</p>
            </div>
            <div className="etape">
              <div className="etape-icone">📞<span className="etape-numero">3</span></div>
              <h3>Contactez</h3>
              <p>Appelez ou écrivez directement au gestionnaire. Aucun intermédiaire.</p>
            </div>
          </div>

          <div className="bandeau-proprio">
            <div>
              <h3>Vous êtes propriétaire ?</h3>
              <p>Publiez votre bien et touchez des locataires.</p>
            </div>
            <Link to="/publier" className="bouton bouton-orange">Publier une annonce →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
