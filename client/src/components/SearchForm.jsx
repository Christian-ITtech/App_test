import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuartiers } from '../api/logements';
import { VILLES } from '../utils/format';

export default function SearchForm({ initial = {} }) {
  const navigate = useNavigate();
  const [ville, setVille] = useState(initial.ville || '');
  const [quartier, setQuartier] = useState(initial.quartier || '');
  const [loyerMax, setLoyerMax] = useState(initial.loyer_max || '');
  const [quartiers, setQuartiers] = useState([]);
  const [erreur, setErreur] = useState('');

  // Le quartier dépend de la ville : on recharge la liste à chaque changement de ville
  useEffect(() => {
    if (!ville) { setQuartiers([]); return; }
    let actif = true;
    fetchQuartiers(ville)
      .then((liste) => actif && setQuartiers(liste))
      .catch(() => actif && setQuartiers([]));
    return () => { actif = false; };
  }, [ville]);

  function changerVille(e) {
    setVille(e.target.value);
    setQuartier('');
    setErreur('');
  }

  function soumettre(e) {
    e.preventDefault();
    if (!ville) return setErreur('Choisissez une ville.');
    if (loyerMax !== '' && (Number.isNaN(Number(loyerMax)) || Number(loyerMax) < 0)) {
      return setErreur('Le loyer maximum doit être un nombre positif.');
    }
    const params = new URLSearchParams({ ville });
    if (quartier) params.set('quartier', quartier);
    if (loyerMax !== '') params.set('loyer_max', loyerMax);
    navigate(`/resultats?${params}`);
  }

  return (
    <form className="recherche" onSubmit={soumettre}>
      <div className="recherche-champs">
        <div className="champ">
          <label htmlFor="ville">Ville</label>
          <select id="ville" value={ville} onChange={changerVille}>
            <option value="">Choisir une ville</option>
            {VILLES.map((v) => <option key={v} value={v}>{v}</option>)}
          </select>
        </div>

        <div className="champ">
          <label htmlFor="quartier">Quartier</label>
          <select id="quartier" value={quartier} onChange={(e) => setQuartier(e.target.value)} disabled={!ville}>
            <option value="">Tous les quartiers</option>
            {quartiers.map((q) => <option key={q} value={q}>{q}</option>)}
          </select>
        </div>

        <div className="champ">
          <label htmlFor="loyer">Loyer maximum (FCFA)</label>
          <input
            id="loyer" type="number" min="0" inputMode="numeric" placeholder="Ex. 100000"
            value={loyerMax} onChange={(e) => setLoyerMax(e.target.value)}
          />
        </div>
      </div>

      {erreur && <p className="champ-erreur" role="alert">{erreur}</p>}
      <button type="submit" className="bouton bouton-vert bouton-large">Rechercher un logement</button>
    </form>
  );
}
