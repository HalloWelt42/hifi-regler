// Urheberrecht der öffentlichen Präsentation (nur dort, praesentation.py legt die Datei bei): ein Hinweis beim ersten
// Besuch als Overlay im Stil der Vorlage (kein Dialog des Browsers) und eine Zeile am Fuß jeder Seite. Gemerkt wird nur,
// dass der Hinweis bestätigt ist, in diesem Browser; über "Hinweis zeigen" im Fuß kommt er jederzeit wieder.

(() => {
  "use strict";
  const SCHLUESSEL = "hifi-regler-rechte";
  const JAHR = "2026";
  const LIZENZ = "https://github.com/HalloWelt42/hifi-regler/blob/main/LICENSE";
  const lesen = () => { try { return localStorage.getItem(SCHLUESSEL) === "bestaetigt"; } catch { return false; } };
  const merken = () => { try { localStorage.setItem(SCHLUESSEL, "bestaetigt"); } catch { /* ohne Speicher kommt der Hinweis beim nächsten Besuch wieder */ } };

  const inhalt = document.querySelector(".hf-inhalt");
  inhalt?.insertAdjacentHTML("beforeend", `<footer class="hf-rechte-fuss"><span>© ${JAHR} HalloWelt42. Alle Rechte vorbehalten.</span>
    <span>Ansehen und Ausprobieren erlaubt, jede weitere Nutzung nur mit schriftlicher Erlaubnis.</span>
    <a href="${LIZENZ}">Lizenz</a><button type="button" class="hf-rechte-link" data-rechte-zeigen>Hinweis zeigen</button></footer>`);

  function zeigen() {
    if (document.querySelector(".hf-rechte")) return;
    const vorher = document.activeElement;
    document.body.insertAdjacentHTML("beforeend", `<div class="hf-rechte" role="dialog" aria-modal="true" aria-labelledby="hf-rechte-titel">
      <div class="ak-geraet hf-rechte-geraet" data-bauform="inspektor" data-modul="U">
        <span class="ak-schraube lo" style="--dreh:14deg"></span><span class="ak-schraube ro" style="--dreh:58deg"></span>
        <span class="ak-schraube lu" style="--dreh:-22deg"></span><span class="ak-schraube ru" style="--dreh:37deg"></span>
        <div class="ak-geraet-kopf"><span class="ak-schild">©</span><b id="hf-rechte-titel">Urheberrecht</b><ak-led farbe="bernstein" zustand="atmet"></ak-led></div>
        <div class="ak-glas ak-schirmtext" style="--farbe:var(--led-bernstein)"><b>© ${JAHR} HalloWelt42</b><span>Alle Rechte vorbehalten</span></div>
        <p>Diese Präsentation mit Quelltext, Gestaltung, Texten und Bildern ist urheberrechtlich geschützt.</p>
        <ul class="hf-rechte-liste">
          <li><ak-led farbe="gruen" zustand="an"></ak-led><span><b>Erlaubt:</b> ansehen, ausprobieren und darauf verlinken.</span></li>
          <li><ak-led farbe="rot" zustand="an"></ak-led><span><b>Nur mit schriftlicher Erlaubnis:</b> kopieren, verändern, weitergeben und in eigenen Projekten verwenden, auch in Teilen.</span></li>
        </ul>
        <p class="hf-rechte-klein">Mitgelieferte Schriften und Symbole stehen unter ihren eigenen Lizenzen.</p>
        <div class="hf-rechte-knoepfe"><a class="knopf" href="${LIZENZ}"><i class="fa-solid fa-scale-balanced"></i>Lizenz lesen</a>
          <button class="knopf primaer" type="button" data-rechte-ok><i class="fa-solid fa-check"></i>Verstanden</button></div>
      </div></div>`);
    const overlay = document.querySelector(".hf-rechte"), ok = overlay.querySelector("[data-rechte-ok]");
    document.documentElement.classList.add("hf-rechte-offen");
    const schliessen = () => { merken(); overlay.remove(); document.documentElement.classList.remove("hf-rechte-offen"); vorher?.focus?.(); };
    ok.addEventListener("click", schliessen);
    overlay.addEventListener("keydown", (e) => {
      if (e.key === "Escape") { e.preventDefault(); schliessen(); return; }
      if (e.key !== "Tab") return;                       // Fokus bleibt im Hinweis
      const ziele = [...overlay.querySelectorAll("a[href], button")], i = ziele.indexOf(document.activeElement);
      e.preventDefault();
      ziele[(i + (e.shiftKey ? -1 : 1) + ziele.length) % ziele.length].focus();
    });
    ok.focus({ preventScroll: true });
  }

  document.addEventListener("click", (e) => { if (e.target.closest("[data-rechte-zeigen]")) zeigen(); });
  if (!lesen()) zeigen();
})();
