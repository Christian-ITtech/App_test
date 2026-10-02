# NdakoTech (Immo-Congo)

Plateforme de mise en relation entre chercheurs de logement et gestionnaires à **Brazzaville** et **Pointe-Noire**. Loyer affiché ferme, aucune commission.

- **Front** : React (Vite), port `5173`
- **Back** : Express (Node.js, ES modules), port `5000`
- **Base de données** : PostgreSQL

```
mon-projet/
├── client/                 # Front React
│   └── src/
│       ├── api/            # Appels vers l'API (logements.js)
│       ├── components/     # Navbar, Footer, Layout, SearchForm, LogementCard, PhotoGallery, Badge
│       ├── pages/          # HomePage, ResultatsPage, FichePage, PublierPage, InscriptionPage
│       └── utils/          # format.js (loyer, dates, listes)
└── server/                 # API Express
    ├── public/images/      # Photos des logements (servies sur /images/...)
    └── src/                # routes, controllers, models, middlewares
```

---

## Installation

Prérequis : **Node.js 20.19+ ou 22.12+** et **PostgreSQL**.

```bash
git clone <url-du-depot>

# 1. Base de données (créer une base vide, puis)
psql -d <nom_base> -f schema_postgresql.sql
psql -d <nom_base> -f seed.sql

# 2. Back
cd server
cp .env.example .env        # puis remplir les valeurs (voir ci-dessous)
npm install
npm run dev                 # http://localhost:5000

# 3. Front (autre terminal)
cd client
cp .env.example .env
npm install
npm run dev                 # http://localhost:5173
```

Après chaque `git pull`, relancer `npm install` si un `package.json` a changé.

### Variables d'environnement

| Fichier | Variable | Rôle | Exemple |
|---|---|---|---|
| `server/.env` | `PORT` | Port de l'API | `5000` |
| `server/.env` | `CLIENT_URL` | Origine autorisée par CORS (sans `/` final) | `http://localhost:5173` |
| `server/.env` | Variables de connexion PostgreSQL | Voir `server/.env.example` | |
| `client/.env` | `VITE_API_URL` | URL de base de l'API | `http://localhost:5000/api` |

Les fichiers `.env` ne sont **jamais** envoyés sur GitHub : seuls les `.env.example` le sont. Redémarrer Vite après toute modification de `client/.env`.

---

## API : vue d'ensemble

URL de base : `http://localhost:5000/api`

| Méthode | Endpoint | Rôle |
|---|---|---|
| GET | `/hello` | Test de communication |
| GET | `/quartiers?ville=` | Quartiers d'une ville |
| GET | `/logements?ville=` | Recherche filtrée (liste) |
| GET | `/logements/tous` | Liste complète, sans filtre |
| GET | `/logements/:id` | Fiche détaillée d'un logement |
| GET | `/images/<fichier>` | Photo d'un logement (fichier statique, hors `/api`) |

L'API est en **lecture seule** pour ce sprint : aucune création, modification, suppression ni authentification.

Villes prises en charge : `Brazzaville`, `Pointe-Noire`.

---

## GET `/api/hello`

Vérifie que le serveur répond.

```json
{ "message": "Bonjour depuis Express !" }
```

---

## GET `/api/quartiers`

Liste les quartiers d'une ville (alimente le champ « Quartier » du formulaire).

| Paramètre | Obligatoire | Description |
|---|---|---|
| `ville` | Oui | `Brazzaville` ou `Pointe-Noire` |

```bash
curl "http://localhost:5000/api/quartiers?ville=Brazzaville"
```

| Code | Cas |
|---|---|
| 200 | Liste des quartiers |
| 400 | `ville` manquante ou inconnue (ex. `Paris`) |

---

## GET `/api/logements`

Recherche de logements (F1, F2, F9).

| Paramètre | Obligatoire | Description |
|---|---|---|
| `ville` | **Oui** | `Brazzaville` ou `Pointe-Noire` |
| `quartier` | Non | Restreint la recherche à un quartier (ex. `Bacongo`, `Tié-Tié`). Sans quartier, la recherche porte sur toute la ville. |
| `loyer_max` | Non | Nombre positif, en FCFA. Exclut tout bien au-dessus du montant. Une valeur vide est ignorée. |
| `tri` | Non | `loyer_asc` (loyer croissant). Toute autre valeur renvoie une erreur 400. |

```bash
curl "http://localhost:5000/api/logements?ville=Pointe-Noire&loyer_max=130000&tri=loyer_asc"
curl "http://localhost:5000/api/logements?ville=Brazzaville&quartier=Bacongo"
```

### Réponse 200

```json
{
  "total": 2,
  "message": null,
  "resultats": [
    {
      "id": 1,
      "titre": "Studio meublé Bacongo",
      "ville": "Brazzaville",
      "quartier": "Bacongo",
      "type_bien": "studio",
      "loyer": 75000,
      "eau_courante": true,
      "compteur_electrique": true,
      "statut": "disponible",
      "verifie": true,
      "date_mise_a_jour": "2026-09-30T10:00:00.000Z",
      "photo_principale": "/images/studio-bacongo-1.jpg",
      "incomplet": false,
      "date_inconnue": false
    }
  ]
}
```

Les champs d'un élément viennent de la table `logement`, plus ces champs calculés :

| Champ | Signification |
|---|---|
| `photo_principale` | Première photo du bien (`null` s'il n'en a aucune) |
| `incomplet` | `true` si le bien n'a aucune photo (RG-03) |
| `date_inconnue` | `true` si `date_mise_a_jour` est `null` (RG-04) |

Le détail exact des colonnes renvoyées en liste dépend de `logementModel.rechercher`.

### Aucun résultat

Le statut reste **200**, avec une liste vide et un message à afficher :

```json
{
  "total": 0,
  "message": "Aucun logement ne correspond à vos critères. Essayez d'élargir votre recherche (autre quartier ou loyer maximum plus élevé).",
  "resultats": []
}
```

### Erreurs 400

| Cas | Exemple |
|---|---|
| `ville` manquante | `/logements` |
| Ville non prise en charge | `/logements?ville=Paris` |
| `loyer_max` non numérique | `loyer_max=abc` |
| `loyer_max` négatif | `loyer_max=-5` |
| `tri` inconnu | `tri=hasard` |

---

## GET `/api/logements/tous`

Liste complète des logements, **sans filtre** et sans `ville` obligatoire (utilisée par la page d'accueil pour les annonces vérifiées).

```bash
curl "http://localhost:5000/api/logements/tous"
```

```json
{
  "total": 13,
  "resultats": [ { "id": 1, "titre": "...", "photo_principale": "...", "incomplet": false, "date_inconnue": false } ]
}
```

Cette route est déclarée **avant** `/:id` dans le routeur : sinon `tous` serait pris pour un identifiant.

---

## GET `/api/logements/:id`

Fiche complète d'un logement (F3, F4, F6). Un bien **occupé** reste consultable, mais sans contact.

| Paramètre | Description |
|---|---|
| `id` | Identifiant numérique du logement |

```bash
curl "http://localhost:5000/api/logements/1"
```

### Réponse 200 (bien disponible)

```json
{
  "id": 1,
  "titre": "Studio meublé Bacongo",
  "description": "Studio meublé, proche des transports.",
  "ville": "Brazzaville",
  "quartier": "Bacongo",
  "adresse": "Rue des Palmiers",
  "type_bien": "studio",
  "loyer": 75000,
  "caution_mois": 2,
  "cout_entree": 225000,
  "message_caution": null,
  "eau_courante": true,
  "compteur_electrique": true,
  "statut": "disponible",
  "verifie": true,
  "date_mise_a_jour": "2026-09-30T10:00:00.000Z",
  "date_inconnue": false,
  "photos": ["/images/studio-bacongo-1.jpg", "/images/studio-bacongo-2.jpg"],
  "incomplet": false,
  "champs_manquants": [],
  "gestionnaire": { "nom": "Mabiala", "prenom": "Jean" },
  "contact": {
    "telephone": "+242060000001",
    "appel": "tel:+242060000001",
    "whatsapp": "https://wa.me/242060000001"
  }
}
```

### Description des champs

| Champ | Description |
|---|---|
| `loyer` | Loyer mensuel en FCFA, ferme : aucun frais ni commission ajoutés |
| `caution_mois` | Caution en nombre de mois de loyer. `null` = caution inconnue |
| `cout_entree` | `loyer × (1 + caution_mois)`, arrondi (RG-07). `null` si la caution est inconnue |
| `message_caution` | Texte « Caution à confirmer… » quand `caution_mois` est `null` (RG-08), sinon `null` |
| `statut` | `disponible` ou `occupe` |
| `verifie` | `true` = badge « Bien vérifié » (simple marquage dans les données, aucun contrôle automatique) |
| `date_mise_a_jour` | Date du dernier changement de statut. `null` = inconnue |
| `photos` | Photos classées par ordre. Tableau vide = fiche incomplète |
| `incomplet` | `true` s'il n'y a aucune photo (RG-03) |
| `champs_manquants` | Parmi `description`, `quartier`, `adresse`, `date_mise_a_jour` : ceux qui sont vides, à afficher « non renseigné » |
| `gestionnaire` | Nom et prénom de la personne à contacter |
| `contact` | Liens de contact. **`null` si le bien est occupé** (boutons désactivés ou masqués) |

Le front complète le lien WhatsApp avec `?text=` pour préremplir un message mentionnant le bien.

### Erreurs

| Code | Cas | Corps |
|---|---|---|
| 400 | Identifiant invalide (ex. `/logements/abc`) | message d'erreur |
| 404 | Logement inexistant (ex. `/logements/999`) | `{ "erreur": "Ce logement n'existe pas." }` |

---

## Images

Les photos sont des fichiers placés dans `server/public/images/`. La base ne stocke que le chemin (`/images/<fichier>`), jamais l'image.

```
http://localhost:5000/images/studio-bacongo-1.jpg
```

Les noms de fichiers doivent correspondre **exactement** à ceux de `seed.sql` (casse et extension comprises). Le logement « Studio Ouenzé (sans photo) » n'en a volontairement aucune.

---

## Erreurs générales

| Code | Cas |
|---|---|
| 404 | Route inexistante (ex. `/api/nimporte-quoi`) |
| 500 | Erreur serveur ou base de données (transmise au gestionnaire d'erreurs via `next(err)`) |

---

## Données de test (`seed.sql`)

13 logements, 3 gestionnaires et 24 photos, avec ces cas particuliers :

| Cas | Logement (id) |
|---|---|
| Vérifié | Studio Bacongo (1), Villa Plateau des 15 ans (5), Appartement Tié-Tié |
| Occupé (pas de contact) | Maison Moungali (4), Maison Mongo-Mpoukou |
| Sans photo (« incomplet ») | Studio Ouenzé (6) |
| Caution inconnue | Studio Ouenzé (6), Appartement Mvou-Mvou |
| Date de mise à jour inconnue | Chambre Makélékélé (7) |

Pour réinitialiser les données : relancer `seed.sql` (il vide les tables avant de les remplir).

---

## Pages du front

| URL | Page | Exigence |
|---|---|---|
| `/` | Accueil : recherche et annonces vérifiées | EF-01, EF-06 |
| `/resultats?ville=...&quartier=...&loyer_max=...&tri=...` | Liste des résultats | EF-01, EF-02, EF-04 |
| `/logements/:id` | Fiche logement, contact WhatsApp / Appeler | EF-03, EF-04, EF-05 |
| `/publier` | Formulaire de publication (démonstration, rien n'est enregistré) | EF-12 |
| `/inscription` | Écran de connexion (démonstration, pas de création de compte) | EF-13 |

---

## Tester l'API

La collection Postman **`NdakoTech_postman_collection.json`** couvre tous les endpoints et les cas d'erreur. L'importer dans Postman : la variable `baseUrl` vaut `http://localhost:5000/api`.

---

## Travail en équipe (Git)

- Ne jamais commiter directement sur `main` : elle est protégée, tout passe par une **Pull Request**.
- Une branche par fonctionnalité : `feature/ef-02-liste-resultats`, `fix/filtre-quartier`.
- Messages de commit : `feat:`, `fix:`, `docs:`, `chore:`.
- Toujours lancer `git status` avant `git commit` et vérifier qu'aucun `.env` n'apparaît.
