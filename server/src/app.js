import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import routes from './routes/index.js';
import { notFound, errorHandler } from './middlewares/errorHandler.js';

// Configuration indispensable pour simuler __dirname en ES6 Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());

app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')));

app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

export default app;
