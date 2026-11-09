# HiFi-Regler

Interaktive Präsentation einer Oberfläche im Stil von Effektgeräten und Studiotechnik: Drehregler, Schieber, Taster,
Kippschalter, Segmentanzeigen, Leuchten, Zeigerinstrumente, Pegel, Wellenform und Spektrum, dazu die allgemeinen
Bedienelemente einer App. Alles ist echtes HTML, CSS und SVG, bedienbar mit Maus, Rad, Tastatur und Finger, hell und
dunkel, in drei Effektstufen, von 375 bis 1920 Pixel Breite.

**Ausprobieren:** https://hallowelt42.github.io/hifi-regler/

Gehört zum Artikel über die Vorlage HiFi im Blog [Digitales Leben](https://hallowelt42.github.io/digitales-leben/).
Gebaut auf dem [Appkern](https://github.com/HalloWelt42/appkern), der gemeinsamen Grundlage der Oberflächen meiner Apps.

## Seiten

| Seite | Inhalt |
|---|---|
| `index.html` | Übersicht mit Schaustück, Entscheidungen und Aufbau |
| `regler.html` | Drehregler mit vier Kappen, Drehwahl, Schieber, Taster, Kippschalter, Wahltasten |
| `anzeigen.html` | Leuchten, 7 und 14 Segmente, Punktmatrix, Zeiger, Pegel, Oszilloskop, LFO, Spektrum |
| `bedienung.html` | Knöpfe, Felder, Auswahl, Reiter, Schalter, Liste, Rückfrage, Fenster, Meldungen |
| `material.html` | Aluminium, Lack, Rohblech, Glas, Chrom, drei Effektstufen, Bühne, Messlauf |
| `skalierung.html` | Maßsystem mit Container Queries, ein Gerät von 200 bis 1200 Pixel, Prüfstand |
| `studio.html` | Board mit Knoten, Inspektor und Transport |

## Bedienung der Regler

Ziehen hoch und runter, Mausrad, Pfeiltasten, Bild auf und ab, Pos1 und Ende. Mit gehaltener Umschalttaste geht es
zehnmal feiner. Doppelklick, Doppeltipp oder Entf setzen die Vorgabe, ein Klick auf den Wert öffnet ein Feld zum
Eintippen.

## Aufbau

| Ort | Inhalt |
|---|---|
| `appkern/instrumente.css`, `instrumente.js`, `anzeigen.js` | Regler und Anzeigen als eigene Elemente, Maßsystem, Wertmodell, Takt |
| `appkern/vorlagen/hifi.css` | die Vorlage: Marken für Material, Licht und Stufen, Bausteine im HiFi-Stil |
| `farben.css` | Farben der App je Modul |
| `seite.css`, `seite.js`, `wahl.js`, `bausteine.js`, `leistung.js` | Rahmen der Präsentation, Wahl, Verhalten, Messlauf |
| `rechte.js`, `rechte.css` | Hinweis zum Urheberrecht beim ersten Besuch, Zeile am Fuß jeder Seite |
| `vendor/` | Barlow, Chakra Petch, Font Awesome Free, Stile des Appkerns |

## Lizenz

**Alle Rechte vorbehalten** - Siehe [LICENSE](LICENSE)

Erlaubt: Ansehen und Ausprobieren im Browser, Verlinken

Nur mit schriftlicher Erlaubnis: Kopieren, Verändern, Weitergeben, Verwenden in eigenen Projekten, auch in Teilen

Mitgelieferte Schriften und Symbole in `vendor/` stehen unter ihren eigenen Lizenzen.

---

## Unterstützen

HiFi-Regler ist ein privates Hobby-Projekt. Kein Tracking, keine Werbung, keine Kompromisse.

Wenn dir das Projekt gefällt, kannst du es weitersagen oder einen Stern dalassen - oder direkt hier:

[![Ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/HalloWelt42)

**Crypto:**

| Coin | Adresse |
|------|---------|
| BTC | `bc1qnd599khdkv3v3npmj9ufxzf6h4fzanny2acwqr` |
| DOGE | `DL7tuiYCqm3xQjMDXChdxeQxqUGMACn1ZV` |
| ETH | `0x8A28fc47bFFFA03C8f685fa0836E2dBe1CA14F27` |

Copyright (c) 2026 HalloWelt42. Alle Rechte vorbehalten.
