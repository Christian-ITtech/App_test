export function notFound(req, res) {
  res.status(404).json({ erreur: 'Route introuvable.' });
}

// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  console.error('Erreur serveur :', err);
  res.status(500).json({
    erreur: 'Une erreur est survenue sur le serveur.',
    ...(process.env.NODE_ENV !== 'production' && { detail: err.message }),
  });
}
