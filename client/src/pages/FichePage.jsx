import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../components/Badge';
import PhotoGallery from '../components/PhotoGallery';
import { fetchLogement } from '../api/logements';
import { formatLoyer, formatDate, libelleType } from '../utils/format';

export default function FichePage() {
  const { id } = useParams();
  const [l, setL] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState('');

  useEffect(() => {
    let actif = true;
    setChargement(true);
    setErreur('');
    fetchLogement(id)
      .then((bien) => actif && setL(bien))
      .catch((err) => actif && setErreur(err.status === 404 ? 'Ce logement est introuvable.' : err.message))
      .finally(() => actif && setChargement(false));
    return () => { actif = false; };
  }, [id]);

  if (chargement) return <p className="page-vide">Chargement…</p>;
  if (erreur) {
    return (
      <div className="page-vide">
        <p>{erreur}</p>
        <Link to="/" className="bouton bouton-vert">Retour à l'accueil</Link>
      </div>
    );
  }

  const date = formatDate(l.dateMaj);
  const message = `Bonjour, je suis intéressé(e) par « ${l.titre} » (réf. ${l.id}) à ${l.quartier}, ${l.ville}, vu sur NdakoTech.`;
  const lienWhatsapp = l.lienWhatsapp ? `${l.lienWhatsapp}?text=${encodeURIComponent(message)}` : null;
  const contactPossible = !l.occupe && l.telephone && lienWhatsapp;

  return (
    <div className="section">
      <div className="container fiche">
        <Link to={-1} className="fiche-retour">← Retour</Link>

        <PhotoGallery photos={l.photos} titre={l.titre} />

        <div className="fiche-corps">
          <div className="badges badges-fiche">
            <Badge type={l.occupe ? 'occupe' : 'disponible'} />
            {l.verifie && <Badge type="verifie" />}
            {l.incomplet && <Badge type="incomplet" />}
          </div>

          <h1>{l.titre}</h1>
          <p className="fiche-lieu">
            📍 {l.quartier || 'Quartier non renseigné'}, {l.ville} · {libelleType(l.typeBien)}
          </p>
          {l.adresse && <p className="fiche-note">Adresse : {l.adresse}</p>}

          <p className="fiche-loyer">{formatLoyer(l.loyer)}<span> /mois</span></p>
          <p className="fiche-note">Loyer ferme : aucun frais caché ni commission ajoutés.</p>

          <p className="fiche-statut">
            {l.occupe ? 'Occupé' : 'Disponible'} · {!l.dateInconnue && date ? `mis à jour le ${date}` : 'date de mise à jour inconnue'}
          </p>

          <h2>Équipements</h2>
          <ul className="fiche-liste">
            <li>{l.eau ? '💧 Eau courante' : '✗ Pas d\'eau courante'}</li>
            <li>{l.electricite ? '⚡ Compteur électrique' : '✗ Pas de compteur électrique'}</li>
            <li>{l.cautionMois != null ? `Caution : ${l.cautionMois} mois de loyer` : l.messageCaution || 'Caution à confirmer'}</li>
            {l.coutEntree != null && <li>Coût d'entrée (loyer + caution) : {formatLoyer(l.coutEntree)}</li>}
          </ul>

          <h2>Description</h2>
          <p>{l.description || 'Description non renseignée.'}</p>

          <h2>Contact</h2>
          {l.gestionnaire && !l.occupe && <p className="fiche-note">Gestionnaire : {l.gestionnaire}</p>}
          {l.occupe && <p className="fiche-note">Ce logement est occupé : le contact est désactivé.</p>}
          <div className="contact-boutons">
            {contactPossible ? (
              <>
                <a className="bouton bouton-vert" target="_blank" rel="noreferrer"
                   href={lienWhatsapp}>WhatsApp</a>
                <a className="bouton bouton-orange" href={`tel:${l.telephone}`}>Appeler</a>
              </>
            ) : (
              <>
                <button className="bouton bouton-vert" disabled>WhatsApp</button>
                <button className="bouton bouton-orange" disabled>Appeler</button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
