export function formatLoyer(montant) {
  return `${new Intl.NumberFormat('fr-FR').format(montant)} FCFA`;
}

export function formatDate(date) {
  if (!date) return null;
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
}

export function libelleType(type) {
  return type ? type.charAt(0).toUpperCase() + type.slice(1) : '';
}

export const TYPES_BIEN = ['appartement', 'maison', 'studio', 'chambre', 'villa', 'autre'];
export const VILLES = ['Brazzaville', 'Pointe-Noire'];
