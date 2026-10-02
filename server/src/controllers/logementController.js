import * as logementModel from '../models/logementModel.js';

const MSG_AUCUN_RESULTAT =
  'Aucun logement ne correspond à vos critères. Essayez d\'élargir votre recherche (autre quartier ou loyer maximum plus élevé).';
const MSG_CAUTION_ABSENTE = 'Caution à confirmer avec le propriétaire du bien';

// Liste complète des logements
export async function listerTous(req, res, next) {
  try {
    const rows = await logementModel.listerTous();

    const resultats = rows.map((l) => ({
      ...l,
      incomplet: !l.photo_principale,
      date_inconnue: l.date_mise_a_jour === null,
    }));

    res.json({ total: resultats.length, resultats });
  } catch (err) {
    next(err);
  }
}

// F1 + F2 + F9
export async function rechercher(req, res, next) {
  try {
    const rows = await logementModel.rechercher(req.filtres);

    const resultats = rows.map((l) => ({
      ...l,
      incomplet: !l.photo_principale,             // RG-03 : pas de photo => incomplet
      date_inconnue: l.date_mise_a_jour === null, // RG-04 / F4
    }));

    res.json({
      total: resultats.length,
      message: resultats.length === 0 ? MSG_AUCUN_RESULTAT : null,
      resultats,
    });
  } catch (err) {
    next(err);
  }
}

// F3 + F4 + F6
export async function obtenirFiche(req, res, next) {
  try {
    const l = await logementModel.trouverParId(req.params.id);
    if (!l) {
      return res.status(404).json({ erreur: 'Ce logement n\'existe pas.' });
    }

    const disponible = l.statut === 'disponible';
    const tel = l.gestionnaire_telephone;

    // F6 / RG-07 : coût d'entrée = loyer + caution (caution = nombre de mois de loyer)
    const cautionConnue = l.caution_mois !== null;
    const coutEntree = cautionConnue ? Math.round(l.loyer * (1 + l.caution_mois)) : null;

    // F3 : liste des informations manquantes, pour afficher « non renseigné » côté React
    const champsManquants = ['description', 'quartier', 'adresse', 'date_mise_a_jour'].filter(
      (c) => l[c] === null || l[c] === ''
    );

    res.json({
      id: l.id,
      titre: l.titre,
      description: l.description,
      ville: l.ville,
      quartier: l.quartier,
      adresse: l.adresse,
      type_bien: l.type_bien,
      loyer: l.loyer,
      caution_mois: l.caution_mois,
      cout_entree: coutEntree,
      message_caution: cautionConnue ? null : MSG_CAUTION_ABSENTE, // RG-08
      eau_courante: l.eau_courante,
      compteur_electrique: l.compteur_electrique,
      statut: l.statut,
      verifie: l.verifie,
      date_mise_a_jour: l.date_mise_a_jour,
      date_inconnue: l.date_mise_a_jour === null,
      photos: l.photos,
      incomplet: l.photos.length === 0, // RG-03
      champs_manquants: champsManquants,
      gestionnaire: { nom: l.gestionnaire_nom, prenom: l.gestionnaire_prenom },
      // Boutons de contact uniquement si le bien est disponible
      contact: disponible
        ? {
            telephone: tel,
            appel: `tel:${tel}`,
            whatsapp: `https://wa.me/${tel.replace(/\D/g, '')}`,
          }
        : null,
    });
  } catch (err) {
    next(err);
  }
}