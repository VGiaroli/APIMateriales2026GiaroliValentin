"use strict";

(function () {
  var PARTIAL_URL = "/wwwroot/views/components/sidebar.html";
  var SIDEBAR_SCRIPT_URL = "/wwwroot/js/sidebar.js";


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
    var pageContent = Array.prototype.slice.call(document.body.childNodes);

    var temp = document.createElement("div");
    temp.innerHTML = partialHtml;

    var aside = temp.querySelector(".admin-sidebar");
    var backdrop = temp.querySelector(".sidebar-backdrop");
    var adminMain = temp.querySelector(".admin-main");

    if (!aside || !backdrop || !adminMain) {
      throw new Error("El partial no tiene la estructura esperada (.admin-sidebar / .sidebar-backdrop / .admin-main)");
    }

    document.body.innerHTML = "";
    document.body.appendChild(aside);
    document.body.appendChild(backdrop);


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