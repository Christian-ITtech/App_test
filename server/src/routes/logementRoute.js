import express from 'express';
import { rechercher, obtenirFiche, listerTous } from '../controllers/logementController.js';
import validateRecherche from '../middlewares/validateRecherche.js';
import validateId from '../middlewares/validateId.js';

const router = express.Router();

// GET /api/logements/tous  (doit rester AVANT /:id)
router.get('/tous', listerTous);

// GET /api/logements?ville=Brazzaville&quartier=Bacongo&loyer_max=100000&tri=loyer_asc
router.get('/', validateRecherche, rechercher);

// GET /api/logements/:id
router.get('/:id', validateId, obtenirFiche);

export default router;