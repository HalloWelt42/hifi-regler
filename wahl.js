// Wahl von Thema, Effektstufe und Vorlage: eine Stelle für alle Seiten des Entwurfs, auch für die in
// der Schale des Appkerns (studio.html). Gemerkt je Browser; das Thema unter demselben Schlüssel wie in den übrigen
// Entwürfen (rahmen.js), damit die Ansichtsprüfung es setzen kann. Die Adresse geht vor:
// ?thema=hell|dunkel, ?effekte=flach|mittel|kraeftig, ?vorlage=hifi|klassisch.

(() => {
  "use strict";
  const WAHL = {
    thema: { name: "Thema", schluessel: "msk-entwurf-thema", ziel: "theme", vorgabe: "dunkel", optionen: [["dunkel", "Dunkel", "fa-moon"], ["hell", "Hell", "fa-sun"]] },
    effekte: { name: "Effektstufe", schluessel: "msk-hifi-effekte", ziel: "effekte", vorgabe: "kraeftig",
               optionen: [["flach", "Flach", "fa-square"], ["mittel", "Mittel", "fa-circle-half-stroke"], ["kraeftig", "Kräftig", "fa-wand-magic-sparkles"]] },
    vorlage: { name: "Vorlage", schluessel: "msk-hifi-vorlage", ziel: "vorlage", vorgabe: "hifi", optionen: [["hifi", "HiFi", "fa-compact-disc"], ["klassisch", "Klassisch", "fa-table-columns"]] },
  };
  const adresse = new URLSearchParams(location.search);
  const lesen = (k) => { try { return localStorage.getItem(k); } catch { return null; } };
  const merken = (k, v) => { try { localStorage.setItem(k, v); } catch { /* ohne Speicher gilt die Vorgabe */ } };
  const stand = (art) => adresse.get(art) || lesen(WAHL[art].schluessel) || WAHL[art].vorgabe;
  function anwenden(art, wert, dauerhaft = false) {
    const w = WAHL[art];
    if (art === "vorlage" && wert === "klassisch") delete document.documentElement.dataset.vorlage;
    else document.documentElement.dataset[w.ziel] = wert;
    document.querySelectorAll(`[data-wahl-art="${art}"] button`).forEach((b) => b.classList.toggle("aktiv", b.dataset.wert === wert));
    if (dauerhaft) merken(w.schluessel, wert);
  }
  /** Knöpfe der Wahl als Segmente des Appkerns (für den Kopf einer Seite) */
  const knoepfe = () => Object.entries(WAHL).map(([art, w]) => `<div class="segment" data-wahl-art="${art}" role="group" aria-label="${w.name}">
      ${w.optionen.map(([wert, name, sym]) => `<button type="button" data-wert="${wert}" title="${w.name}: ${name}"><i class="fa-solid ${sym}" aria-hidden="true"></i><span>${name}</span></button>`).join("")}</div>`).join("");
  function binden(wurzel) {
    wurzel.querySelectorAll("[data-wahl-art] button").forEach((k) => k.addEventListener("click", () => anwenden(k.closest("[data-wahl-art]").dataset.wahlArt, k.dataset.wert, true)));
    for (const art of Object.keys(WAHL)) anwenden(art, stand(art));
  }
  for (const art of Object.keys(WAHL)) anwenden(art, stand(art));
  window.HiFiWahl = { WAHL, anwenden, knoepfe, binden };
})();
