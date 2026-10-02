import express from 'express';
import quartierController from '../controllers/quartierController.js';

const router = express.Router();

// GET /api/quartiers?ville=Pointe-Noire
router.get('/', quartierController.listerQuartiers);

export default router;
