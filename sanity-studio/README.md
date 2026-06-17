# Atzengold Sanity Schema (Entwurf)

Schema gespiegelt aus der bestehenden Admin-CMS (Vercel KV): `venue`, `storyNode`, `merchItem`, `testimonial`, `beerProfile` (Singleton), `brandHub` (Singleton).

## Status

- Schema-Code fertig, **noch nicht deployed** — die Sanity-MCP-OAuth-Anbindung schlägt aktuell wiederholt fehl ("No OAuth flow is in progress"), auch bei sofortigem Callback. Bug auf Plattform-Seite, nicht auf deiner.
- Es existiert noch kein Sanity-Projekt/Dataset für Atzengold.

## Bewusst ausgeschlossen

- **Orders**: transaktionale Stripe-Daten, kein Editorial-Content — bleibt in Vercel KV.
- **Settings/API-Keys**: Secrets gehören nicht in ein CMS.
- Translations/Brand-Guidelines/Dashboard: noch nicht modelliert (nicht im bestätigten Scope).

## Nächste Schritte (sobald Verbindung steht)

1. Sanity-Projekt anlegen (`sanity init` in diesem Ordner, oder manuell über sanity.io/manage → Projekt-ID in `sanity.config.ts` eintragen).
2. `npm install` in `sanity-studio/`.
3. `npm run dev` zum lokalen Testen des Studios, dann `npm run deploy`.
4. Bestehende Daten aus Vercel KV migrieren (separater Schritt — noch nicht Teil dieses Scopes).

## Alternative falls MCP-Auth weiter blockiert

Du kannst mir auch direkt eine `SANITY_PROJECT_ID` + ein API-Token (Editor-Rechte) geben — dann deploye ich das Schema ohne den MCP-OAuth-Flow.
