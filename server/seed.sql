-- Données de démonstration (F0) : Brazzaville et Pointe-Noire
-- À exécuter APRÈS schema.sql : psql -d ma_base -f seed.sql
-- Attention : vide les tables avant de les remplir (relançable à volonté).

TRUNCATE signalement, photo, logement, utilisateur RESTART IDENTITY CASCADE;

-- Gestionnaires (numéros fictifs)
INSERT INTO utilisateur (nom, prenom, telephone) VALUES
  ('Mabiala', 'Jean',    '+242060000001'),
  ('Ngoma',   'Grâce',   '+242060000002'),
  ('Mouanda', 'Patrick', '+242060000003');

-- Logements
-- Cas couverts : vérifié, occupé, sans photo, caution inconnue, date inconnue
INSERT INTO logement
  (user_id, titre, description, ville, quartier, adresse, type_bien, loyer,
   caution_mois, eau_courante, compteur_electrique, statut, verifie, date_mise_a_jour)
VALUES
-- ===== Brazzaville =====
((SELECT id FROM utilisateur WHERE telephone = '+242060000001'),
 'Studio meublé Bacongo', 'Studio meublé, proche des transports.',
 'Brazzaville', 'Bacongo', 'Rue des Palmiers', 'studio', 75000,
 2, TRUE, TRUE, 'disponible', TRUE, now() - interval '2 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000002'),
 'Appartement 3 pièces Poto-Poto', 'Appartement lumineux au 1er étage.',
 'Brazzaville', 'Poto-Poto', 'Avenue de la Paix', 'appartement', 150000,
 3, TRUE, TRUE, 'disponible', FALSE, now() - interval '5 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000003'),
 'Chambre simple Talangaï', 'Chambre dans une parcelle calme.',
 'Brazzaville', 'Talangaï', NULL, 'chambre', 30000,
 1, TRUE, FALSE, 'disponible', FALSE, now() - interval '10 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000001'),
 'Maison 4 pièces Moungali', 'Maison avec cour fermée.',
 'Brazzaville', 'Moungali', NULL, 'maison', 220000,
 2, TRUE, TRUE, 'occupe', FALSE, now() - interval '20 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000002'),
 'Villa standing Plateau des 15 ans', 'Villa avec jardin et gardien.',
 'Brazzaville', 'Plateau des 15 ans', NULL, 'villa', 600000,
 3, TRUE, TRUE, 'disponible', TRUE, now() - interval '1 day'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000003'),
 'Studio Ouenzé (sans photo)', 'Studio simple, photos à venir.',
 'Brazzaville', 'Ouenzé', NULL, 'studio', 55000,
 NULL, TRUE, TRUE, 'disponible', FALSE, now() - interval '3 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000001'),
 'Chambre Makélékélé', 'Chambre indépendante.',
 'Brazzaville', 'Makélékélé', NULL, 'chambre', 25000,
 1, FALSE, TRUE, 'disponible', FALSE, NULL),  -- date inconnue

-- ===== Pointe-Noire =====
((SELECT id FROM utilisateur WHERE telephone = '+242060000002'),
 'Appartement 2 pièces Tié-Tié', 'Appartement récent, proche du marché.',
 'Pointe-Noire', 'Tié-Tié', NULL, 'appartement', 120000,
 2, TRUE, TRUE, 'disponible', TRUE, now() - interval '4 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000003'),
 'Studio Loandjili', 'Studio carrelé avec petite cour.',
 'Pointe-Noire', 'Loandjili', NULL, 'studio', 60000,
 2, TRUE, TRUE, 'disponible', FALSE, now() - interval '6 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000001'),
 'Maison Mongo-Mpoukou', 'Maison familiale de 3 chambres.',
 'Pointe-Noire', 'Mongo-Mpoukou', NULL, 'maison', 180000,
 3, TRUE, TRUE, 'occupe', TRUE, now() - interval '15 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000002'),
 'Chambre Lumumba', 'Chambre au rez-de-chaussée.',
 'Pointe-Noire', 'Lumumba', NULL, 'chambre', 35000,
 1, TRUE, FALSE, 'disponible', FALSE, now() - interval '2 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000003'),
 'Villa Ngoyo', 'Grande villa proche de la plage.',
 'Pointe-Noire', 'Ngoyo', NULL, 'villa', 450000,
 2, TRUE, TRUE, 'disponible', FALSE, now() - interval '7 days'),

((SELECT id FROM utilisateur WHERE telephone = '+242060000001'),
 'Appartement Mvou-Mvou', 'Appartement 2 chambres, caution à discuter.',
 'Pointe-Noire', 'Mvou-Mvou', NULL, 'appartement', 140000,
 NULL, TRUE, TRUE, 'disponible', FALSE, now() - interval '8 days');

-- Photos : fichiers placés dans server/public/images, servis par Express sur /images/...
-- Seul le chemin est stocké en base (jamais l'image elle-même).
-- Le logement « Studio Ouenzé (sans photo) » n'en a volontairement aucune.
-- Pour changer une image : modifier le nom de fichier dans cette liste.
INSERT INTO photo (logement_id, url, ordre)
SELECT l.id, '/images/' || p.fichier, p.ordre
FROM (VALUES
  ('Studio meublé Bacongo',               'studio-bacongo-1.jpg',            0),
  ('Studio meublé Bacongo',               'studio-bacongo-2.jpg',            1),

  ('Appartement 3 pièces Poto-Poto',      'appartement-poto-poto-1.jpg',     0),
  ('Appartement 3 pièces Poto-Poto',      'appartement-poto-poto-2.jpg',     1),
  ('Appartement 3 pièces Poto-Poto',      'appartement-poto-poto-3.jpg',     2),

  ('Chambre simple Talangaï',             'chambre-talangai-1.jpg',          0),

  ('Maison 4 pièces Moungali',            'maison-moungali-1.jpg',           0),
  ('Maison 4 pièces Moungali',            'maison-moungali-2.jpg',           1),

  ('Villa standing Plateau des 15 ans',   'villa-plateau-1.jpg',             0),
  ('Villa standing Plateau des 15 ans',   'villa-plateau-2.jpg',             1),
  ('Villa standing Plateau des 15 ans',   'villa-plateau-3.jpg',             2),

  ('Chambre Makélékélé',                  'chambre-makelekele-1.jpg',        0),

  ('Appartement 2 pièces Tié-Tié',        'appartement-tie-tie-1.jpg',       0),
  ('Appartement 2 pièces Tié-Tié',        'appartement-tie-tie-2.jpg',       1),

  ('Studio Loandjili',                    'studio-loandjili-1.jpg',          0),
  ('Studio Loandjili',                    'studio-loandjili-2.jpg',          1),

  ('Maison Mongo-Mpoukou',                'maison-mongo-mpoukou-1.jpg',      0),
  ('Maison Mongo-Mpoukou',                'maison-mongo-mpoukou-2.jpg',      1),

  ('Chambre Lumumba',                     'chambre-lumumba-1.jpg',           0),

  ('Villa Ngoyo',                         'villa-ngoyo-1.jpg',               0),
  ('Villa Ngoyo',                         'villa-ngoyo-2.jpg',               1),
  ('Villa Ngoyo',                         'villa-ngoyo-3.jpg',               2),

  ('Appartement Mvou-Mvou',               'appartement-mvou-mvou-1.jpg',     0),
  ('Appartement Mvou-Mvou',               'appartement-mvou-mvou-2.jpg',     1)
) AS p(titre, fichier, ordre)
JOIN logement l ON l.titre = p.titre;

-- Vérification : doit afficher 24 photos et 12 logements avec photo (le 13e n'en a pas)
-- SELECT count(*) AS photos, count(DISTINCT logement_id) AS logements_avec_photo FROM photo;
