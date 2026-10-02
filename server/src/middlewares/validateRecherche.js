const VILLES = ['Brazzaville', 'Pointe-Noire'];
const TYPES_BIEN = ['appartement', 'maison', 'studio', 'chambre', 'villa', 'autre'];
const TRIS_VALIDES = ['loyer_asc'];

// Renvoie une chaîne nettoyée, ou '' si la valeur n'est pas une chaîne
const texte = (v) => (typeof v === 'string' ? v.trim() : '');

// Retrouve le nom officiel d'une ville sans tenir compte de la casse
export function trouverVille(valeur) {
  const v = texte(valeur).toLowerCase();
  return VILLES.find((ville) => ville.toLowerCase() === v) || null;
}

export function trouverTypeBien(valeur) {
  const t = texte(valeur).toLowerCase();
  return TYPES_BIEN.find((type) => type.toLowerCase() === t) || null;
} 

export default function validateRecherche(req, res, next) {
  const erreurs = {};

  // Ville : obligatoire
  const ville = trouverVille(req.query.ville);
  if (!texte(req.query.ville)) {
    erreurs.ville = 'Veuillez choisir une ville.';
  } else if (!ville) {
    erreurs.ville = `Ville non prise en charge. Choisissez : ${VILLES.join(' ou ')}.`;
  }

  // Loyer maximum : optionnel (ignoré s'il est vide), sinon nombre positif
  let loyerMax = null;
  const loyerBrut = texte(req.query.loyer_max);
  if (loyerBrut !== '') {
    const n = Number(loyerBrut.replace(/\s/g, ''));
    if (!Number.isFinite(n) || n <= 0) {
      erreurs.loyer_max = 'Le loyer maximum doit être un nombre positif.';
    } else {
      loyerMax = n;
    }
  }

  // Eau courante : optionnel
  let eau_courante = null;
  const eauCourante = texte(req.query.eau_courante);
  if (eauCourante) {
    eau_courante = eauCourante === 'true';
  } else if (eauCourante === 'false') {
    erreurs.eau_courante = 'Ce logement n\'a pas d\'eau courante.';
  }

  // Compteur électrique : optionnel
  let compteur_electrique = null;
  const compteurElectrique = texte(req.query.compteur_electrique);
  if (compteurElectrique) {
    compteur_electrique = compteurElectrique === 'true';
  } else if (compteurElectrique === 'false') {
    erreurs.compteur_electrique = 'Ce logement n\'a pas de compteur électrique.';
  }

  let type_bien = null;
  const typeBien = texte(req.query.type_bien);
  if (typeBien) {
    type_bien = trouverTypeBien(typeBien);
    if (!type_bien) {
      erreurs.type_bien = `Type de bien non reconnu. Valeurs possibles : ${TYPES_BIEN.join(', ')}.`;
    }
  }

  // Tri : optionnel, liste blanche
  const tri = texte(req.query.tri);
  if (tri && !TRIS_VALIDES.includes(tri)) {
    erreurs.tri = `Tri non reconnu. Valeurs possibles : ${TRIS_VALIDES.join(', ')}.`;
  }

  if (Object.keys(erreurs).length > 0) {
    return res.status(400).json({ erreur: 'Paramètres invalides.', champs: erreurs });
  }
  
  req.filtres = {
    ville ,
    quartier: texte(req.query.quartier) || null, // optionnel => toute la ville
    loyerMax,
    tri: tri || null,
    type_bien,
      // typeBien: texte(req.query.type_bien) || null, // optionnel => tous les types
    eau_courante,
    compteur_electrique
  };
  next();
}
