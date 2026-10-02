const CONFIG = {
  disponible: ['Disponible', 'badge-dispo'],
  occupe: ['Occupé', 'badge-occupe'],
  verifie: ['✓ Bien vérifié', 'badge-verifie'],
  incomplet: ['Annonce incomplète', 'badge-incomplet'],
};

export default function Badge({ type }) {
  const [texte, classe] = CONFIG[type];
  return <span className={`badge ${classe}`}>{texte}</span>;
}
