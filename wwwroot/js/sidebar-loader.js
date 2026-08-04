"use strict";

(function () {
  var PARTIAL_URL = "/wwwroot/views/components/sidebar.html";
  var SIDEBAR_SCRIPT_URL = "/wwwroot/js/sidebar.js";

  // Oculta el body hasta que el layout esté armado, para evitar el
  // parpadeo de "contenido sin sidebar" un instante antes de inyectar.
  document.documentElement.style.visibility = "hidden";

  function run() {
    fetch(PARTIAL_URL)
      .then(function (res) {
        if (!res.ok) {
          throw new Error("No se pudo cargar " + PARTIAL_URL + " (HTTP " + res.status + ")");
        }
        return res.text();
      })
      .then(injectLayout)
      .then(loadSidebarScript)
      .catch(function (err) {
        console.error("[sidebar-loader]", err);
        document.documentElement.style.visibility = "visible";
      });
  }

  function injectLayout(partialHtml) {
    // 1. Guardamos el contenido que la página ya tenía en el body.
    var pageContent = Array.prototype.slice.call(document.body.childNodes);

    // 2. Parseamos el partial en un contenedor temporal (no está en el DOM todavía).
    var temp = document.createElement("div");
    temp.innerHTML = partialHtml;

    var aside = temp.querySelector(".admin-sidebar");
    var backdrop = temp.querySelector(".sidebar-backdrop");
    var adminMain = temp.querySelector(".admin-main");

    if (!aside || !backdrop || !adminMain) {
      throw new Error("El partial no tiene la estructura esperada (.admin-sidebar / .sidebar-backdrop / .admin-main)");
    }

    // 3. Vaciamos el body y reconstruimos en el orden correcto.
    document.body.innerHTML = "";
    document.body.appendChild(aside);
    document.body.appendChild(backdrop);

    // 4. El contenido original de la página va DENTRO de .admin-main,
    //    después del navbar (así hereda el margin-left del layout).
    pageContent.forEach(function (node) {
      adminMain.appendChild(node);
    });

    document.body.appendChild(adminMain);
    document.documentElement.style.visibility = "visible";
  }

  function loadSidebarScript() {
    return new Promise(function (resolve, reject) {
      var script = document.createElement("script");
      script.src = SIDEBAR_SCRIPT_URL;
      script.onload = resolve;
      script.onerror = function () {
        reject(new Error("No se pudo cargar " + SIDEBAR_SCRIPT_URL));
      };
      document.body.appendChild(script);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();