export default function validateId(req, res, next) {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({ 
      erreur: 'Paramètres invalides.', 
      champs: { id: 'L’identifiant doit être un nombre entier positif.' } 
    });
  }

  req.params.id = id;
  next();
}
