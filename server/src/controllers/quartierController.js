import { quartiersParVille } from '../models/logementModel.js';

async function listerQuartiers(req, res, next) {
  try {
    const { trouverVille } = await import('../middlewares/validateRecherche.js');
    const ville = trouverVille(req.query.ville);
    if (!ville) {
      return res.status(400).json({
        erreur: 'Paramètres invalides.',
        champs: { ville: 'Veuillez choisir une ville valide.' },
      });
    }
    // Appel direct à la fonction nommée extraite du modèle
    const quartiers = await quartiersParVille(ville);
    res.json({ ville, quartiers });
  } catch (err) {
    next(err);
  }
}

export default { listerQuartiers };
