import { useState } from 'react';

// EF-13 : écran de connexion en vitrine. Aucune création de compte, aucune authentification réelle.
export default function InscriptionPage() {
  const [message, setMessage] = useState('');

  function soumettre(e) {
    e.preventDefault();
    setMessage('La connexion n\'est pas encore active ce sprint.');
  }

  return (
    <div className="section">
      <div className="container">
        <form className="carte-formulaire carte-formulaire-etroite" onSubmit={soumettre}>
          <h1>Connexion annonceur</h1>
          <p className="section-sous-titre">Accédez à vos annonces.</p>

          <div className="champ">
            <label htmlFor="c-tel">Téléphone</label>
            <input id="c-tel" type="tel" placeholder="+242 06 XXX XXXX" />
          </div>

          <div className="champ">
            <label htmlFor="c-mdp">Mot de passe</label>
            <input id="c-mdp" type="password" placeholder="••••••••" />
          </div>

          {message && <p className="notice" role="status">{message}</p>}
          <button type="submit" className="bouton bouton-vert bouton-large">Se connecter</button>

          <p className="fiche-note centre">La création de compte arrivera plus tard.</p>
        </form>
      </div>
    </div>
  );
}
