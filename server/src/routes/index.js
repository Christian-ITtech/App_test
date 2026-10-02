import express from 'express';
import logementRoute from './logementRoute.js';
import quartierRoute from './quartierRoute.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Bienvenue sur l\'API de l\'application de recherche de logements.',
    version: '1.0.0',
    auteur: 'Christian IT DevOps developpeur Fullstack A AkieniACademy', 
   });
});

// Cette route est un exemple pour tester le serveur depuis React. Elle peut être supprimée ou modifiée selon vos besoins.
router.get('/hello', (req, res) => {
  res.json({ message: 'Bonjour depuis Express !' });
});

router.use('/logements', logementRoute);
router.use('/quartiers', quartierRoute);

export default router;
