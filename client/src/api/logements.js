const API_URL = import.meta.env.VITE_API_URL;                 // http://localhost:5000/api
const SERVER_URL = API_URL.replace(/\/api\/?$/, '');          // http://localhost:5000 (pour /images/...)

async function get(chemin, params = {}) {
  const qs = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== '' && v != null)
  ).toString();
  const res = await fetch(`${API_URL}${chemin}${qs ? `?${qs}` : ''}`);
  if (!res.ok) {
    const corps = await res.json().catch(() => ({}));
    const erreur = new Error(corps.erreur || corps.message || 'Erreur serveur');
    erreur.status = res.status;
    throw erreur;
  }
  return res.json();
}

// Transforme une réponse de l'API (liste ou fiche) en objet simple pour React.
// La liste renvoie `photo_principale` (1 photo), la fiche renvoie `photos` (tableau).
function normaliser(b) {
  const sources = b.photos ?? (b.photo_principale ? [b.photo_principale] : []);
  const photos = sources
    .map((p) => (typeof p === 'string' ? p : p.url))
    .filter(Boolean)
    .map((url) => (url.startsWith('http') ? url : `${SERVER_URL}${url}`));

  return {
    id: b.id,
    titre: b.titre,
    description: b.description ?? '',
    ville: b.ville,
    quartier: b.quartier ?? '',
    adresse: b.adresse ?? '',
    typeBien: b.type_bien ?? 'autre',
    loyer: Number(b.loyer),
    cautionMois: b.caution_mois ?? null,
    messageCaution: b.message_caution ?? null,
    coutEntree: b.cout_entree ?? null,
    eau: Boolean(b.eau_courante),
    electricite: Boolean(b.compteur_electrique),
    occupe: b.statut === 'occupe',
    verifie: Boolean(b.verifie),
    dateMaj: b.date_mise_a_jour ?? null,
    dateInconnue: b.date_inconnue ?? b.date_mise_a_jour == null,
    incomplet: b.incomplet ?? photos.length === 0,
    photos,
    gestionnaire: b.gestionnaire ? `${b.gestionnaire.prenom ?? ''} ${b.gestionnaire.nom ?? ''}`.trim() : '',
    // contact = null côté API quand le bien est occupé
    telephone: b.contact?.telephone ?? null,
    lienWhatsapp: b.contact?.whatsapp ?? null,
  };
}

export async function fetchQuartiers(ville) {
  const data = await get('/quartiers', { ville });
  const liste = Array.isArray(data) ? data : data.quartiers ?? data.data ?? [];
  return liste.map((q) => (typeof q === 'string' ? q : q.quartier ?? q.nom));
}

// GET /logements?ville=...  ->  { total, message, resultats }
export async function fetchRecherche(filtres) {
  const data = await get('/logements', filtres);
  return {
    total: data.total ?? data.resultats.length,
    message: data.message ?? null,
    logements: data.resultats.map(normaliser),
  };
}

// GET /logements/tous  ->  { total, resultats }
export async function fetchTous() {
  const data = await get('/logements/tous');
  return data.resultats.map(normaliser);
}

// GET /logements/:id  ->  la fiche
export async function fetchLogement(id) {
  return normaliser(await get(`/logements/${id}`));
}
