// Rahmen der Kitchensink-Seiten: baut den stehenden Kopf mit Reitern zu allen Seiten, der Wahl von
// Thema, Effektstufe und Vorlage (wahl.js) und der Zeile "Zuletzt bedient". Angaben am body: data-titel, data-unter (Zeile
// darunter), data-seite.

(() => {
  "use strict";
  const SEITEN = [
    { datei: "index.html", name: "Übersicht", symbol: "fa-table-cells-large" },
    { datei: "regler.html", name: "Regler", symbol: "fa-sliders" },
    { datei: "anzeigen.html", name: "Anzeigen", symbol: "fa-gauge-high" },
    { datei: "bedienung.html", name: "Bedienelemente", symbol: "fa-hand-pointer" },
    { datei: "material.html", name: "Material und Licht", symbol: "fa-lightbulb" },
    { datei: "skalierung.html", name: "Skalierung", symbol: "fa-up-right-and-down-left-from-center" },
    { datei: "studio.html", name: "Im Studio", symbol: "fa-diagram-project" },
  ];
  const b = document.body;
  const kopf = document.createElement("header");
  kopf.className = "hf-kopf";
  kopf.dataset.seitenkopf = "";
  kopf.innerHTML = `<div class="hf-kopf-zeile">
      <a class="hf-marke" href="index.html" title="Übersicht der Vorlage HiFi"><span class="symbol"><i class="fa-solid fa-compact-disc"></i></span><span><b>Vorlage HiFi</b><span>Entwurf</span></span></a>
      <h1>${b.dataset.titel || ""}${b.dataset.unter ? `<small>${b.dataset.unter}</small>` : ""}</h1>
      <div class="hf-wahl">${HiFiWahl.knoepfe()}</div>
    </div>
    <nav class="hf-reiter" aria-label="Seiten des Entwurfs">${SEITEN.map((s) => `<a href="${s.datei}" class="${s.datei === b.dataset.seite ? "aktiv" : ""}"${s.datei === b.dataset.seite ? ' aria-current="page"' : ""}><i class="fa-solid ${s.symbol}" aria-hidden="true"></i><span>${s.name}</span></a>`).join("")}
      <span class="hf-zuletzt" aria-live="polite"><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i><span>Zuletzt bedient:</span><b id="hf-zuletzt">noch nichts</b></span></nav>`;
  const rollt = document.querySelector(".hf-rollt");
  rollt.prepend(kopf);
  HiFiWahl.binden(kopf);

  // Zuletzt bedient: jede Eingabe eines Instruments meldet sich hier (zeigt, dass Rad, Tasten und Doppelklick wirken)
  const zuletzt = document.getElementById("hf-zuletzt");
  document.addEventListener("ak-eingabe", (e) => {
    const d = e.detail;
    zuletzt.textContent = `${d.name ? `${d.name}: ` : ""}${d.text} · ${d.art}${d.fein ? ", fein" : ""}`;
  });
  window.HiFiSeite = { SEITEN };
})();
