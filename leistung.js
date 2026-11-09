// Leistungsmessung der Vorlage: misst, statt zu raten. Ein Messlauf hält alle Anzeigen in Bewegung
// und dreht alle Regler der Seite in jedem Bild (wie eine abgespielte Automation), je Effektstufe einige Sekunden lang.
// Gemessen wird im Browser selbst:
//   Bildabstand    Zeit zwischen zwei requestAnimationFrame (zeigt verpasste Bilder, auch wenn das Rastern zu lange dauert)
//   Hauptfaden     Zeit vom Beginn des Bildes bis zur nächsten Aufgabe danach (MessageChannel): Skript, Stil, Layout und
//                  das Aufzeichnen des Malens in diesem Bild
//   lange Bilder   Einträge "long-animation-frame" über 50 ms (wo der Browser sie kennt)
// Ergebnis als Zeilen { stufe, bilder, fps, abstand50, abstand95, abstandMax, haupt50, haupt95, verpasst, lang }.

(() => {
  "use strict";
  const quantil = (liste, q) => { const s = [...liste].sort((a, b) => a - b); return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0; };

  async function messlauf(dauerMs, belasten) {
    const abstaende = [], haupt = [];
    let lang = 0, letztes = 0, ende = performance.now() + dauerMs, beginn = 0;
    const kanal = new MessageChannel();
    let bildBeginn = 0;
    kanal.port1.onmessage = () => { if (bildBeginn) haupt.push(performance.now() - bildBeginn); };
    let po = null;
    try { po = new PerformanceObserver((l) => { lang += l.getEntries().filter((e) => e.duration > 50).length; }); po.observe({ type: "long-animation-frame" }); } catch { po = null; }
    const regler = [...document.querySelectorAll("ak-dreh, ak-schieber")];
    await new Promise((fertig) => {
      const bild = (t) => {
        bildBeginn = performance.now();
        if (!beginn) beginn = t;
        if (letztes) abstaende.push(t - letztes);
        letztes = t;
        if (belasten) regler.forEach((r, i) => { r.anteil = 0.5 + 0.45 * Math.sin(t / 700 + i * 0.7); });
        kanal.port2.postMessage(0);
        if (performance.now() < ende) requestAnimationFrame(bild); else fertig();
      };
      requestAnimationFrame(bild);
    });
    po?.disconnect();
    const takt = quantil(abstaende, 0.5) || 16.7;
    return { bilder: abstaende.length, fps: (abstaende.length / ((letztes - beginn) / 1000)) || 0,
             abstand50: takt, abstand95: quantil(abstaende, 0.95), abstandMax: Math.max(0, ...abstaende),
             haupt50: quantil(haupt, 0.5), haupt95: quantil(haupt, 0.95), verpasst: abstaende.filter((a) => a > takt * 1.5).length, lang: po ? lang : null };
  }

  // Gegenprobe: dieselbe Seite, wie man Leuchten und Glas oft baut (Weichzeichner statt Schatten); zeigt, was die Regeln
  // der Vorlage sparen. Nur für die Messung, nie in der Vorlage.
  const GEGENPROBE = `.ak-led-licht::after, .ak-segmente-glas svg, .ak-dreh-skala, .ak-glas canvas, .ak-zeiger-nadel { filter: drop-shadow(0 0 6px currentColor) drop-shadow(0 0 14px currentColor); }
    .hf-muster, .ak-geraet, .hf-kopf { backdrop-filter: blur(10px) saturate(1.4); }`;

  /** Alle Stufen nacheinander messen (dazu auf Wunsch "gegenprobe": kräftig mit Weichzeichnern); danach die Stufe der Seite wiederherstellen */
  async function alleStufen({ dauerMs = 4000, stufen = ["flach", "mittel", "kraeftig"], belasten = true, melden = () => {} } = {}) {
    const wurzel = document.documentElement, vorher = wurzel.dataset.effekte;
    const zeilen = [];
    for (const stufe of stufen) {
      const probe = stufe === "gegenprobe" ? Object.assign(document.createElement("style"), { textContent: GEGENPROBE }) : null;
      if (probe) document.head.append(probe);
      wurzel.dataset.effekte = probe ? "kraeftig" : stufe;
      melden(`misst ${stufe}`);
      await new Promise((r) => setTimeout(r, 400));   // Stil und Rastern der neuen Stufe einschwingen lassen
      zeilen.push({ stufe, ...(await messlauf(dauerMs, belasten)) });
      probe?.remove();
    }
    wurzel.dataset.effekte = vorher;
    return zeilen;
  }
  window.HiFiLeistung = { messlauf, alleStufen };
})();
