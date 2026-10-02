import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchForm from '../components/SearchForm';
import LogementCard from '../components/LogementCard';
import { fetchRecherche } from '../api/logements';

export default function ResultatsPage() {
  const [params, setParams] = useSearchParams();
  const ville = params.get('ville') || '';
  const quartier = params.get('quartier') || '';
  const loyerMax = params.get('loyer_max') || '';
  const tri = params.get('tri') || '';

  const [logements, setLogements] = useState([]);
  const [chargement, setChargement] = useState(false);
  const [message, setMessage] = useState('');
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    if (!ville) return;
    let actif = true;
    setChargement(true);
    setErreur('');
    fetchRecherche({ ville, quartier, loyer_max: loyerMax, tri })
      .then((r) => {
        if (!actif) return;
        setLogements(r.logements);
        setMessage(r.message || '');
      })
      .catch((err) => actif && setErreur(err.message))
      .finally(() => actif && setChargement(false));
    return () => { actif = false; };
  }, [ville, quartier, loyerMax, tri]);

  function changerTri(e) {
    const suivant = new URLSearchParams(params);
    if (e.target.value) suivant.set('tri', e.target.value);
    else suivant.delete('tri');
    setParams(suivant);
  }

  return (
    <div className="section">
      <div className="container">
        <h1 className="section-titre">Résultats de recherche</h1>
        <p className="section-sous-titre">Modifiez vos critères ci-dessous</p>

        <SearchForm key={`${ville}|${quartier}|${loyerMax}`} initial={{ ville, quartier, loyer_max: loyerMax }} />

        {!ville && <p className="message-vide">Choisissez une ville pour lancer la recherche.</p>}
        {chargement && <p className="message-vide">Chargement…</p>}
        {erreur && <p className="message-vide champ-erreur">{erreur}</p>}

        {ville && !chargement && !erreur && logements.length === 0 && (
          <p className="message-vide">
            {message || 'Aucun logement ne correspond à vos critères.'}
          </p>
        )}

        {logements.length > 0 && (
          <>
            <div className="resultats-entete">
              <p>{logements.length} logement{logements.length > 1 ? 's' : ''} trouvé{logements.length > 1 ? 's' : ''}</p>
              <select value={tri} onChange={changerTri} aria-label="Trier les résultats">
                <option value="">Tri par défaut</option>
                <option value="loyer_asc">Loyer croissant</option>
              </select>
            </div>
            <div className="grille-logements">
              {logements.map((l) => <LogementCard key={l.id} logement={l} />)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
