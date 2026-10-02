import { Link } from 'react-router-dom';
import Badge from './Badge';
import { formatLoyer, formatDate, libelleType } from '../utils/format';

export default function LogementCard({ logement: l }) {
  const date = formatDate(l.dateMaj);

  return (
    <Link to={`/logements/${l.id}`} className="carte">
      <div className="carte-image">
        {l.photos[0] ? (
          <img src={l.photos[0]} alt={l.titre} loading="lazy" />
        ) : (
          <div className="carte-sans-photo">Pas de photo</div>
        )}
        <div className="badges">
          <Badge type={l.occupe ? 'occupe' : 'disponible'} />
          {l.verifie && <Badge type="verifie" />}
          {l.incomplet && <Badge type="incomplet" />}
        </div>
      </div>

      <div className="carte-corps">
        <p className="carte-loyer">{formatLoyer(l.loyer)}<span> /mois</span></p>
        <p className="carte-type">{libelleType(l.typeBien)}</p>
        <p className="carte-lieu">📍 {l.quartier}, {l.ville}</p>
        <p className="carte-date">{date ? `Statut au ${date}` : 'Date de mise à jour inconnue'}</p>
        <div className="carte-equipements">
          {l.eau && <span>💧 Eau</span>}
          {l.electricite && <span>⚡ Électricité</span>}
        </div>
      </div>
    </Link>
  );
}
