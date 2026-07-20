/* index.js — page d'accueil : grille minimale, recherche, filtres, export/import. */
(function () {
  "use strict";

  var T = window.Tubbz;

  var state = T.loadState();
  var catalog = { meta: {}, figurines: [] };

  // Éléments du DOM
  var elGrid = document.getElementById("grid");
  var elCount = document.getElementById("result-count");
  var elWarning = document.getElementById("storage-warning");
  var elSearch = document.getElementById("search");
  var elFranchise = document.getElementById("filter-franchise");
  var elSize = document.getElementById("filter-size");
  var elPackaging = document.getElementById("filter-packaging");
  var elStatus = document.getElementById("filter-status");

  /* ---------------------------------------------------------------- */
  /* Filtrage                                                         */
  /* ---------------------------------------------------------------- */

  function matches(fig) {
    var q = elSearch.value.trim().toLowerCase();
    if (q) {
      var hay = (fig.name + " " + fig.franchise + " " + (fig.category || "")).toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    if (elFranchise.value && fig.franchise !== elFranchise.value) return false;

    var variants = fig.variants || [];
    if (elSize.value && !variants.some(function (v) { return v.size === elSize.value; })) return false;
    if (elPackaging.value && !variants.some(function (v) { return v.packaging === elPackaging.value; })) return false;

    if (elStatus.value) {
      var owned = T.ownedCountOf(state, fig).owned > 0;
      if (elStatus.value === "wishlist") {
        if (!T.isWished(state, fig.id)) return false;
      } else if (elStatus.value === "owned") {
        if (!owned) return false;
      } else if (elStatus.value === "not-owned") {
        if (owned) return false;
      }
    }
    return true;
  }

  /* ---------------------------------------------------------------- */
  /* Rendu de la grille                                               */
  /* ---------------------------------------------------------------- */

  function statusBadge(owned) {
    return owned
      ? '<span class="badge badge-owned">✔ Possédé</span>'
      : '<span class="badge badge-none">Non possédé</span>';
  }

  function cardHTML(fig) {
    var owned = T.ownedCountOf(state, fig).owned > 0;
    var wished = T.isWished(state, fig.id);
    var img = fig.image || T.PLACEHOLDER;
    var url = "duck.html?id=" + encodeURIComponent(fig.id);

    return (
      '<a class="card" href="' + url + '" data-owned="' + (owned ? "1" : "0") + '">' +
        '<div class="card-media">' +
          '<img loading="lazy" src="' + T.esc(img) + '" alt="' + T.esc(fig.name) + '" ' +
            'onerror="this.onerror=null;this.src=\'' + T.PLACEHOLDER + '\'" />' +
          (wished ? '<span class="heart" title="Dans votre wishlist" aria-label="Wishlist">❤</span>' : '') +
        '</div>' +
        '<div class="card-body">' +
          '<h3 class="card-name">' + T.esc(fig.name) + '</h3>' +
          '<p class="card-franchise">' + T.esc(fig.franchise) + '</p>' +
          '<div class="card-status">' + statusBadge(owned) + '</div>' +
        '</div>' +
      '</a>'
    );
  }

  function render() {
    var list = catalog.figurines.filter(matches);

    var ownedTotal = catalog.figurines.reduce(function (n, fig) {
      return n + (T.ownedCountOf(state, fig).owned > 0 ? 1 : 0);
    }, 0);
    elCount.textContent =
      list.length + (list.length > 1 ? " figurines" : " figurine") +
      " · " + ownedTotal + " possédé" + (ownedTotal > 1 ? "s" : "");

    if (list.length === 0) {
      elGrid.innerHTML = '<p class="empty">Aucune figurine ne correspond à votre recherche.</p>';
    } else {
      elGrid.innerHTML = list.map(cardHTML).join("");
    }
    elGrid.setAttribute("aria-busy", "false");
  }

  /* ---------------------------------------------------------------- */
  /* Filtres : peupler la liste des licences                          */
  /* ---------------------------------------------------------------- */

  function populateFranchises() {
    var names = {};
    catalog.figurines.forEach(function (f) { names[f.franchise] = true; });
    Object.keys(names).sort(function (a, b) { return a.localeCompare(b, "fr"); })
      .forEach(function (name) {
        var opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        elFranchise.appendChild(opt);
      });
  }

  /* ---------------------------------------------------------------- */
  /* Export / Import de sauvegarde                                    */
  /* ---------------------------------------------------------------- */

  function exportBackup() {
    var payload = JSON.stringify(state, null, 2);
    var blob = new Blob([payload], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    var stamp = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = "tubbz-collection-" + stamp + ".json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function importBackup(file) {
    var reader = new FileReader();
    reader.onload = function () {
      try {
        var parsed = JSON.parse(reader.result);
        var incoming = T.normalizeState(parsed);
        var ok = window.confirm(
          "Importer cette sauvegarde ?\n\n" +
          "Elle REMPLACERA votre collection actuelle dans ce navigateur."
        );
        if (!ok) return;
        state = incoming;
        T.saveState(state);
        render();
        alert("Sauvegarde importée avec succès.");
      } catch (e) {
        alert("Fichier invalide : impossible de lire cette sauvegarde.");
      }
    };
    reader.onerror = function () { alert("Impossible de lire le fichier."); };
    reader.readAsText(file);
  }

  /* ---------------------------------------------------------------- */
  /* Événements                                                       */
  /* ---------------------------------------------------------------- */

  function bindEvents() {
    [elSearch, elFranchise, elSize, elPackaging, elStatus].forEach(function (el) {
      el.addEventListener("input", render);
      el.addEventListener("change", render);
    });

    document.getElementById("btn-reset").addEventListener("click", function () {
      elSearch.value = "";
      elFranchise.value = "";
      elSize.value = "";
      elPackaging.value = "";
      elStatus.value = "";
      render();
    });

    document.getElementById("btn-export").addEventListener("click", exportBackup);

    var fileInput = document.getElementById("import-file");
    document.getElementById("btn-import").addEventListener("click", function () {
      fileInput.click();
    });
    fileInput.addEventListener("change", function () {
      if (fileInput.files && fileInput.files[0]) importBackup(fileInput.files[0]);
      fileInput.value = ""; // permet de réimporter le même fichier
    });

    // Rafraîchit l'état si l'utilisateur revient depuis duck.html (coches modifiées).
    window.addEventListener("pageshow", function () {
      state = T.loadState();
      render();
    });
  }

  /* ---------------------------------------------------------------- */
  /* Démarrage                                                        */
  /* ---------------------------------------------------------------- */

  function checkStorage() {
    if (T.storageAvailable()) return;
    elWarning.hidden = false;
    elWarning.innerHTML =
      '⚠ Votre navigateur bloque l\'enregistrement local sur cette page. ' +
      'Vos coches ne seront pas sauvegardées. ' +
      'Ouvrez le site depuis un hébergement (http://) plutôt qu\'en double-clic (fichier local), ' +
      'ou autorisez les données de site pour ce fichier.';
  }

  T.loadCatalog()
    .then(function (data) {
      catalog = data;
      checkStorage();
      populateFranchises();
      bindEvents();
      render();
    })
    .catch(function (err) {
      elGrid.setAttribute("aria-busy", "false");
      elGrid.innerHTML =
        '<div class="error">' +
          '<p><strong>Impossible de charger le catalogue.</strong></p>' +
          '<p class="muted">' + T.esc(err.message) + '</p>' +
          '<p class="muted">Vérifiez que le fichier <code>data.js</code> est bien présent à côté ' +
          'de <code>index.html</code>.</p>' +
        '</div>';
      console.error(err);
    });
})();
