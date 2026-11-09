// Verhalten der allgemeinen Bausteine des Appkerns im Entwurf: in der App sind das die Svelte-Teile (Auswahl,
// Rückfrage, Hilfe, Meldungen); hier genügt so viel, dass man sie im Stil der Vorlage bedienen kann. Keine Dialoge des
// Browsers: Rückfragen stehen an Ort und Stelle, schwebende Fenster und Meldungen hängen am body (nie abgeschnitten).

(() => {
  "use strict";
  // Segment: genau ein Teil gewählt
  document.querySelectorAll(".hf-inhalt .segment").forEach((g) => g.addEventListener("click", (e) => {
    const k = e.target.closest("button"); if (!k) return;
    g.querySelectorAll("button").forEach((x) => { x.classList.toggle("aktiv", x === k); x.setAttribute("aria-pressed", String(x === k)); });
  }));
  // Schalter
  document.querySelectorAll("button.schalter").forEach((s) => s.addEventListener("click", () => {
    const an = !s.classList.contains("an"); s.classList.toggle("an", an); s.setAttribute("aria-pressed", String(an));
  }));
  // Wahlchips
  document.querySelectorAll(".chip.wahl").forEach((c) => c.addEventListener("click", () => c.classList.toggle("an")));
  // Reiter mit Inhalt
  document.querySelectorAll(".reiterleiste").forEach((leiste) => leiste.addEventListener("click", (e) => {
    const k = e.target.closest("button"); if (!k) return;
    leiste.querySelectorAll("button").forEach((x) => { x.classList.toggle("aktiv", x === k); x.setAttribute("aria-selected", String(x === k)); });
    const ziel = leiste.dataset.inhalt && document.querySelectorAll(`[data-reiter-von="${leiste.dataset.inhalt}"]`);
    ziel?.forEach((p) => { p.hidden = p.dataset.reiter !== k.dataset.reiter; });
  }));
  // Listen: eine Zeile gewählt
  document.querySelectorAll(".hf-liste").forEach((l) => l.addEventListener("click", (e) => {
    const z = e.target.closest(".zeile"); if (!z || z.classList.contains("nicht-waehlbar")) return;
    l.querySelectorAll(".zeile").forEach((x) => { x.classList.toggle("gewaehlt", x === z); x.setAttribute("aria-selected", String(x === z)); });
  }));

  // Auswahl (Aufklappliste statt nativer Auswahl), wie teile/Auswahl.svelte
  const schliessenAlle = (ausser) => document.querySelectorAll(".auswahl .auswahl-liste:not([hidden])").forEach((l) => {
    if (l.parentElement !== ausser) { l.hidden = true; l.parentElement.querySelector(".auswahl-knopf").setAttribute("aria-expanded", "false"); } });
  document.querySelectorAll(".auswahl").forEach((a) => {
    const knopf = a.querySelector(".auswahl-knopf"), liste = a.querySelector(".auswahl-liste");
    liste.hidden = true;
    knopf.addEventListener("click", () => { schliessenAlle(a); liste.hidden = !liste.hidden; knopf.setAttribute("aria-expanded", String(!liste.hidden));
      if (!liste.hidden) (liste.querySelector(".aktiv") || liste.querySelector("button"))?.focus(); });
    liste.addEventListener("click", (e) => {
      const o = e.target.closest("button"); if (!o) return;
      liste.querySelectorAll("button").forEach((x) => { x.classList.toggle("aktiv", x === o); x.setAttribute("aria-selected", String(x === o)); });
      a.querySelector(".auswahl-text").textContent = o.dataset.titel || o.textContent.trim();
      liste.hidden = true; knopf.setAttribute("aria-expanded", "false"); knopf.focus();
    });
    liste.addEventListener("keydown", (e) => {
      const alle = [...liste.querySelectorAll("button")], i = alle.indexOf(document.activeElement);
      if (e.key === "ArrowDown") { e.preventDefault(); alle[Math.min(alle.length - 1, i + 1)].focus(); }
      if (e.key === "ArrowUp") { e.preventDefault(); alle[Math.max(0, i - 1)].focus(); }
      if (e.key === "Escape") { liste.hidden = true; knopf.focus(); }
    });
  });
  document.addEventListener("click", (e) => { if (!e.target.closest(".auswahl")) schliessenAlle(null); });

  // Rückfrage an Ort und Stelle
  document.querySelectorAll("[data-rueckfrage]").forEach((k) => k.addEventListener("click", () => {
    const r = document.getElementById(k.dataset.rueckfrage); r.hidden = false; r.querySelector(".knopf.still")?.focus();
  }));
  document.querySelectorAll(".rueckfrage [data-antwort]").forEach((k) => k.addEventListener("click", () => {
    const r = k.closest(".rueckfrage"); r.hidden = true;
    if (k.dataset.antwort === "ja") meldung("Take 3 gelöscht", "fa-trash-can", "Rückgängig");
  }));

  // Meldung: schwebt unten, verschwindet nach fünf Sekunden; am body, damit nichts sie abschneidet
  function meldung(text, symbol = "fa-circle-check", aktion = "") {
    document.querySelector(".hf-meldung")?.remove();
    const m = document.createElement("div");
    m.className = "hf-meldung"; m.setAttribute("role", "status");
    m.innerHTML = `<ak-led farbe="gruen" zustand="an"></ak-led><i class="fa-solid ${symbol}" aria-hidden="true"></i><span>${text}</span>${aktion ? `<button class="knopf klein" type="button">${aktion}</button>` : ""}`;
    document.body.append(m);
    m.querySelector("button")?.addEventListener("click", () => m.remove());
    setTimeout(() => m.remove(), 5000);
  }
  document.querySelectorAll("[data-meldung]").forEach((k) => k.addEventListener("click", () => meldung(k.dataset.meldung, k.dataset.symbol)));

  // Schwebendes Fenster: öffnen, am Kopf ziehen, schließen (Escape)
  document.querySelectorAll("[data-fenster]").forEach((k) => k.addEventListener("click", () => {
    const f = document.getElementById(k.dataset.fenster);
    document.body.append(f); f.hidden = false; f.querySelector("[data-zu]")?.focus();
  }));
  document.querySelectorAll(".hilfe-fenster").forEach((f) => {
    const kopf = f.querySelector(".hilfe-kopf");
    let zug = null;
    kopf.addEventListener("pointerdown", (e) => { if (e.target.closest("button")) return; const r = f.getBoundingClientRect();
      zug = { dx: e.clientX - r.left, dy: e.clientY - r.top, id: e.pointerId }; kopf.setPointerCapture(e.pointerId); });
    kopf.addEventListener("pointermove", (e) => { if (!zug) return;
      f.style.left = `${Math.min(innerWidth - 80, Math.max(0, e.clientX - zug.dx))}px`; f.style.top = `${Math.min(innerHeight - 60, Math.max(0, e.clientY - zug.dy))}px`; });
    kopf.addEventListener("pointerup", () => { zug = null; });
    f.querySelectorAll("[data-zu]").forEach((z) => z.addEventListener("click", () => { f.hidden = true; }));
    f.addEventListener("keydown", (e) => { if (e.key === "Escape") f.hidden = true; });
  });
  window.HiFiMeldung = meldung;
})();
