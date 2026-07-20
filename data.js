/* data.js — LE CATALOGUE des figurines Tubbz.
 *
 * C'est le seul fichier à alimenter (ex. avec la sortie de votre scraping).
 * On utilise un fichier .js (et non .json) pour que le site fonctionne par simple
 * double-clic sur index.html (file://), sans aucun serveur.
 *
 * Le contenu est du JSON normal, simplement affecté à window.TUBBZ_DATA.
 * Voir README.md pour le détail des champs.
 */
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
      "image": "images/placeholder.svg",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/placeholder.svg" },
        { "size": "classic", "packaging": "boxed", "image": "images/placeholder.svg" },
        { "size": "mini", "packaging": "boxed", "image": "images/placeholder.svg" }
      ]
    },
    {
      "id": "darksouls-solaire",
      "name": "Solaire of Astora",
      "franchise": "Dark Souls",
      "category": "Jeux vidéo",
      "releaseDate": "2021-03-15",
      "image": "images/placeholder.svg",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/placeholder.svg" },
        { "size": "classic", "packaging": "boxed", "image": "images/placeholder.svg" }
      ]
    },
    {
      "id": "jaws-great-white-shark",
      "name": "Great White Shark",
      "franchise": "Jaws",
      "category": "Films",
      "releaseDate": "2022-06-20",
      "image": "images/placeholder.svg",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/placeholder.svg" },
        { "size": "xl", "packaging": "boxed", "image": "images/placeholder.svg" }
      ]
    },
    {
      "id": "harrypotter-gryffindor",
      "name": "Harry Potter (Gryffindor)",
      "franchise": "Harry Potter",
      "category": "Films",
      "releaseDate": "2023-09-01",
      "image": "images/placeholder.svg",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/placeholder.svg" },
        { "size": "classic", "packaging": "boxed", "image": "images/placeholder.svg" },
        { "size": "mini", "packaging": "boxed", "image": "images/placeholder.svg" }
      ]
    },
    {
      "id": "tmnt-leonardo",
      "name": "Leonardo",
      "franchise": "Teenage Mutant Ninja Turtles",
      "category": "Séries",
      "releaseDate": "2022-11-10",
      "image": "images/placeholder.svg",
      "variants": [
        { "size": "classic", "packaging": "first-edition", "image": "images/placeholder.svg" },
        { "size": "classic", "packaging": "boxed", "image": "images/placeholder.svg" }
      ]
    }
  ]
};
