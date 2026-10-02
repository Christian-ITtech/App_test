import { useState } from 'react';
import { TYPES_BIEN, VILLES, libelleType } from '../utils/format';

// EF-12 : vitrine non fonctionnelle. Rien n'est envoyé au serveur.
export default function PublierPage() {
  const [message, setMessage] = useState('');

  function soumettre(e) {
    e.preventDefault();
    setMessage('La publication d\'annonces n\'est pas encore active : elle arrivera après ce sprint. Aucune annonce n\'a été créée.');
  }

  return (
    <div className="section">
      <div className="container">
        <form className="carte-formulaire" onSubmit={soumettre}>
          <h1>Publier une annonce</h1>
          <p className="section-sous-titre">Aperçu du formulaire (démonstration)</p>

          <div className="champ">
            <label htmlFor="p-ville">Ville</label>
            <select id="p-ville" defaultValue="">
              <option value="" disabled>Choisir…</option>
              {VILLES.map((v) => <option key={v}>{v}</option>)}
            </select>
          </div>

          <div className="champ">
            <label htmlFor="p-quartier">Quartier</label>
            <input id="p-quartier" placeholder="Ex. Poto-Poto" />
          </div>

          <div className="champ">
            <label htmlFor="p-type">Type de bien</label>
            <select id="p-type" defaultValue="">
              <option value="" disabled>Choisir…</option>
              {TYPES_BIEN.map((t) => <option key={t} value={t}>{libelleType(t)}</option>)}
            </select>
          </div>

          <div className="champ-ligne">
            <div className="champ">
              <label htmlFor="p-loyer">Loyer mensuel (FCFA)</label>
              <input id="p-loyer" type="number" placeholder="Ex. 85000" />
            </div>
            <div className="champ">
              <label htmlFor="p-caution">Caution (mois de loyer)</label>
              <input id="p-caution" type="number" placeholder="Optionnel" />
            </div>
          </div>

          <div className="cases">
            <label><input type="checkbox" /> 💧 Eau courante</label>
            <label><input type="checkbox" /> ⚡ Compteur électrique</label>
          </div>

          <div className="champ">
            <label htmlFor="p-desc">Description</label>
            <textarea id="p-desc" rows="4" placeholder="Décrivez votre bien…" />
          </div>

          <div className="champ">
            <label htmlFor="p-tel">Numéro de contact</label>
            <input id="p-tel" placeholder="+242 06 XXX XXXX" />
          </div>

          <div className="champ">
            <label htmlFor="p-photos">Photos</label>
            <input id="p-photos" type="file" accept="image/*" multiple />
          </div>

          {message && <p className="notice" role="status">{message}</p>}
          <button type="submit" className="bouton bouton-vert bouton-large">Soumettre l'annonce</button>
        </form>
      </div>
    </div>
  );
}
