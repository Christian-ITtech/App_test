import 'dotenv/config'; // une seule fois, tout en haut

import app from './app.js';
import pool from './config/database.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
