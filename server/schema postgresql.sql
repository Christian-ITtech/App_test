-- Schéma PostgreSQL : gestion de logements, photos et signalements
-- À exécuter avec : psql -d ma_base -f schema.sql

-- Types énumérés
CREATE TYPE type_bien AS ENUM (
  'appartement', 'maison', 'studio', 'chambre', 'villa', 'autre'
);

CREATE TYPE statut_logement AS ENUM (
  'disponible', 'occupe'
);

CREATE TYPE statut_signalement AS ENUM (
  'nouveau', 'en_cours', 'traite', 'rejete'
);

CREATE TYPE motif_signalement AS ENUM (
  'fausse_information', 'prix_incorrect', 'logement_inexistant',
  'photo_incorrecte', 'annonce_deja_occupee', 'autre'
);

-- Tables
CREATE TABLE utilisateur (
  id         INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nom        VARCHAR(100) NOT NULL,
  prenom     VARCHAR(100) NOT NULL,
  telephone  VARCHAR(20)  NOT NULL UNIQUE,
  statut     VARCHAR(20)  NOT NULL DEFAULT 'actif'
);

CREATE TABLE logement (
  id                  INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id             INTEGER NOT NULL
                      REFERENCES utilisateur(id) ON DELETE CASCADE,
  titre               VARCHAR(200) NOT NULL,
  description         TEXT,
  ville               VARCHAR(100) NOT NULL,
  quartier            VARCHAR(100),
  adresse             VARCHAR(255),
  type_bien           type_bien NOT NULL DEFAULT 'autre',
  loyer               DECIMAL(12,2) NOT NULL CHECK (loyer >= 0),
  caution_mois        INTEGER CHECK (caution_mois >= 0), -- NULL = caution à confirmer
  eau_courante        BOOLEAN NOT NULL DEFAULT FALSE,
  compteur_electrique BOOLEAN NOT NULL DEFAULT FALSE,
  statut              statut_logement NOT NULL DEFAULT 'disponible',
  verifie             BOOLEAN NOT NULL DEFAULT FALSE,
  date_mise_a_jour    TIMESTAMP,
  created_at          TIMESTAMP NOT NULL DEFAULT now(),
  updated_at          TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE photo (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  logement_id INTEGER NOT NULL
              REFERENCES logement(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  ordre       INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  UNIQUE (logement_id, ordre)
);

CREATE TABLE signalement (
  id          INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  logement_id INTEGER NOT NULL
              REFERENCES logement(id) ON DELETE CASCADE,
  motif       motif_signalement NOT NULL,
  description TEXT,
  statut      statut_signalement NOT NULL DEFAULT 'nouveau',
  created_at  TIMESTAMP NOT NULL DEFAULT now(),
  updated_at  TIMESTAMP NOT NULL DEFAULT now()
);

-- Index
CREATE INDEX idx_logement_user      ON logement(user_id);
CREATE INDEX idx_logement_recherche ON logement(ville, quartier, statut, type_bien);
CREATE INDEX idx_photo_logement     ON photo(logement_id);
CREATE INDEX idx_signalement_log    ON signalement(logement_id, statut);

-- Mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_logement_updated_at
  BEFORE UPDATE ON logement
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_signalement_updated_at
  BEFORE UPDATE ON signalement
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();