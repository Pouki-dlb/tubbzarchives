# Tubbz Archives

Application web **statique** (HTML/CSS/JS purs — aucun framework, aucun backend, aucune base de
données) pour **archiver les figurines Tubbz** et **suivre sa collection**. Le suivi est enregistré
uniquement dans le navigateur du visiteur (`localStorage`) — **pas de compte**.

## Lancer le site

Aucun serveur, aucun outil : **il suffit de double-cliquer sur `index.html`** (ou de le déposer
dans un navigateur). Le catalogue est chargé via une balise `<script src="data.js">`, ce qui
fonctionne directement depuis `file://`.

Pour l'héberger en ligne (gratuitement) : GitHub Pages, Netlify ou Cloudflare Pages — déposer le
dossier tel quel, aucune étape de build.

## Structure

| Fichier            | Rôle                                                                  |
|--------------------|-----------------------------------------------------------------------|
| `index.html` / `index.js` | Grille minimale des canards : recherche, filtres, stats, export/import. |
| `duck.html` / `duck.js`   | Fiche d'un canard (`duck.html?id=<id>`) : photos par variante, coches, wishlist, note. |
| `common.js`        | Code partagé : chargement catalogue, `localStorage`, helpers.         |
| `styles.css`       | Style, responsive, thème clair/sombre automatique.                    |
| `data.js`          | **Le catalogue** (voir schéma ci-dessous). À alimenter par vos soins. |
| `images/`          | Images des figurines (+ `placeholder.svg` par défaut).                |

## Schéma de `data.js`

C'est le seul fichier à alimenter (par exemple avec la sortie de votre scraping). Le contenu est du
JSON normal, simplement enveloppé dans `window.TUBBZ_DATA = { … };` :

```js
window.TUBBZ_DATA = {
  "meta": {
    "sizes": ["classic", "mini", "xl"],
    "packaging": ["first-edition", "boxed"],
    "labels": {
      "sizes": { "classic": "Classique", "mini": "Mini", "xl": "XL" },
      "packaging": { "first-edition": "First Edition", "boxed": "Boxed" }
    }
  },
  "figurines": [
    {
      "id": "fallout-vault-boy",
      "name": "Vault Boy",
      "franchise": "Fallout",
      "category": "Jeux vidéo",
      "releaseDate": "2020-05-01",
      "image": "images/fallout-vault-boy.png",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/fallout-vault-boy-classic-fe.png" },
        { "size": "classic", "packaging": "boxed",         "image": "images/fallout-vault-boy-classic-box.png" },
        { "size": "mini",    "packaging": "boxed",         "image": "images/fallout-vault-boy-mini-box.png" }
      ]
    }
  ]
};
```

> Concrètement : générez votre JSON, puis ajoutez `window.TUBBZ_DATA = ` devant et `;` à la fin.

### Champs d'une figurine

| Champ         | Obligatoire | Description                                                              |
|---------------|-------------|-------------------------------------------------------------------------|
| `id`          | ✅          | Identifiant **unique et stable**. Sert de clé pour les coches du visiteur — **ne jamais le modifier** ensuite, sinon les collections se décalent. |
| `name`        | ✅          | Nom du personnage.                                                       |
| `franchise`   | ✅          | Licence (sert au regroupement, aux filtres et aux stats).               |
| `category`    | ⬜          | Catégorie libre (« Jeux vidéo », « Films », « Séries »…).                |
| `releaseDate` | ⬜          | Date ISO `AAAA-MM-JJ`.                                                   |
| `image`       | ⬜          | Vignette affichée sur la grille. Repli : `images/placeholder.svg`.      |
| `variants`    | ✅          | Liste des combinaisons **réellement existantes** (voir ci-dessous).     |

### Champs d'une variante

| Champ       | Obligatoire | Valeurs                                            |
|-------------|-------------|----------------------------------------------------|
| `size`      | ✅          | `classic` \| `mini` \| `xl`                         |
| `packaging` | ✅          | `first-edition` (baignoire) \| `boxed` (boîte)     |
| `image`     | ⬜          | Photo de cette version précise. Repli : `image` de la figurine, puis `placeholder.svg`. |

> N'ajoutez que les variantes qui existent vraiment. La clé interne d'une variante est
> `"<size>|<packaging>"` (ex. `classic|first-edition`).

## Données personnelles du visiteur (`localStorage`)

Stockées sous la clé `tubbz-collection`, **uniquement** côté navigateur :

```json
{
  "version": 1,
  "owned":    { "fallout-vault-boy": { "classic|first-edition": true } },
  "wishlist": { "fallout-vault-boy": true },
  "notes":    { "fallout-vault-boy": "payé 15€" }
}
```

Le bouton **Exporter** télécharge exactement cet objet en `.json` ; **Importer** le restaure
(remplacement, après confirmation). C'est le seul moyen de sauvegarder / transférer une collection
(pas de compte, pas de serveur).

## Note

Tubbz™ est une marque de Numskull Designs. Ce projet est un outil de collection non officiel ; les
images ajoutées dans `images/` sont sous la responsabilité de la personne qui les fournit.
