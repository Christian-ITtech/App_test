import pool from '../config/database.js';

// Tris autorisés (liste blanche : on n'insère jamais une valeur utilisateur dans ORDER BY)
const TRIS = {
  loyer_asc: 'l.loyer ASC, l.id ASC',
  recent: 'l.date_mise_a_jour DESC NULLS LAST, l.id ASC',
};

/**
 * Tous les logements, quel que soit leur statut.
 */
export async function listerTous() {
  const { rows } = await pool.query(`
    SELECT
      l.id,
      l.titre,
      l.ville,
      l.quartier,
      l.type_bien,
      l.loyer::float8 AS loyer,
      l.eau_courante,
      l.compteur_electrique,
      l.statut,
      l.verifie,
      l.date_mise_a_jour,
      (SELECT p.url FROM photo p WHERE p.logement_id = l.id ORDER BY p.ordre LIMIT 1) AS photo_principale
    FROM logement l
    -- WHERE l.statut = 'disponible'  -- décommenter pour exclure les biens occupés (RG-01)
    ORDER BY l.date_mise_a_jour DESC NULLS LAST, l.id
  `);
  return rows;
}


export async function rechercher({ ville, quartier, type_bien, eau_courante,compteur_electrique,  loyerMax, tri }) {
  const conditions = ["l.statut = 'disponible'", 'LOWER(l.ville) = LOWER(\$1)'];
  const params = [ville];


  if (quartier) {
    params.push(quartier);
    conditions.push(`LOWER(l.quartier) = LOWER($${params.length})`);
  }

  if (type_bien !== null && type_bien !== undefined) {
    params.push(type_bien);
    conditions.push(`l.type_bien = $${params.length}`);
  }

  if (eau_courante !== null && eau_courante !== undefined) {
    params.push(eau_courante);
    conditions.push(`l.eau_courante = $${params.length}`);
  }
  
  if (compteur_electrique !== null && compteur_electrique !== undefined) {
    params.push(compteur_electrique);
    conditions.push(`l.compteur_electrique = $${params.length}`);
  }

  if (loyerMax !== null && loyerMax !== undefined) {
    params.push(loyerMax);
    conditions.push(`l.loyer <= $${params.length}`);
  }

  const orderBy = TRIS[tri] || TRIS.recent;

  const sql = `
    SELECT
      l.id,
      l.titre,
      l.ville,
      l.quartier,
      l.type_bien,
      l.loyer::float8 AS loyer,
      l.statut,
      l.verifie,
      l.date_mise_a_jour,
      (SELECT p.url FROM photo p WHERE p.logement_id = l.id ORDER BY p.ordre LIMIT 1) AS photo_principale
    FROM logement l
    WHERE ${conditions.join(' AND ')}
    ORDER BY ${orderBy}
  `;

  const { rows } = await pool.query(sql, params);
  return rows;
}

/**
 * F3 : fiche complète d'un bien (quel que soit son statut), avec photos et gestionnaire.
 */
export async function trouverParId(id) {
  const { rows } = await pool.query(
    `SELECT
       l.id, l.titre, l.description, l.ville, l.quartier, l.adresse, l.type_bien,
       l.loyer::float8 AS loyer,
       l.caution_mois,
       l.eau_courante, l.compteur_electrique,
       l.statut, l.verifie, l.date_mise_a_jour,
       u.nom AS gestionnaire_nom,
       u.prenom AS gestionnaire_prenom,
       u.telephone AS gestionnaire_telephone
     FROM logement l
     JOIN utilisateur u ON u.id = l.user_id
     WHERE l.id = $1`,
    [id]
  );
  if (rows.length === 0) return null;

  const photos = await pool.query(
    'SELECT url FROM photo WHERE logement_id = \$1 ORDER BY ordre',
    [id]
  );

  return { ...rows[0], photos: photos.rows.map((p) => p.url) };
}

/**
 * Quartiers connus d'une ville (pour la liste déroulante de la recherche).
 */
export async function quartiersParVille(ville) {
  const { rows } = await pool.query(
    `SELECT DISTINCT quartier
     FROM logement
     WHERE LOWER(ville) = LOWER($1) AND quartier IS NOT NULL
     ORDER BY quartier`,
    [ville]
  );
  return rows.map((r) => r.quartier);
}
