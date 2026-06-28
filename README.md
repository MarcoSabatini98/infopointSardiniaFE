# infopoint Sardegna — Front End

## Descrizione

Front end della dashboard **infopoint Sardegna**: monitoraggio regionale in tempo (quasi) reale su
mappa interattiva. Mostra meteo, incendi, allagamenti/allerte, traffico stradale, voli, navi, news
ed eventi della Sardegna, con dettaglio per provincia.

- Frontend: Angular 21 (standalone, signals) → `infopointSardiniaFE`
- Backend: Node.js + Express → `infopointSardiniaBE`

---

## Tecnologie utilizzate

- **Framework:** Angular 21 (standalone components, signals, control-flow `@if`/`@for`)
- **Mappa:** Leaflet (+ GeoJSON province)
- **HTTP/API:** `HttpClient` + interceptor JWT, REST verso `/api/v1`
- **Stile:** CSS custom (design system in `src/styles.css`, font Manrope, OKLCH)
- **Test:** Vitest + @testing-library/angular
- **Qualità:** ESLint (angular-eslint) + Prettier

---

## Prerequisiti

| Strumento | Versione |
| --------- | -------- |
| Node.js | 18.x+ |
| npm | 9.x+ |
| Backend infopointSardiniaBE attivo | http://localhost:3000 |

---

## Installazione

```bash
git clone https://github.com/MarcoSabatini98/infopointSardiniaFE.git
cd infopointSardiniaFE
npm install
npm start          # ng serve → http://localhost:4200
```

La base API è in `src/environments/environment.ts` (`apiBase`, default `http://localhost:3000/api/v1`).

---

## Accesso ai servizi

| Servizio | URL |
| -------- | --- |
| Frontend | http://localhost:4200 |
| Backend | http://localhost:3000 |

### Login admin (per la sezione Gestione)

| Email | Password |
| ----- | -------- |
| `admin@infopoint.sardegna.it` | `ChangeMe_123!` |

---

## Script

| Comando | Azione |
| --- | --- |
| `npm start` | Dev server (`ng serve`) |
| `npm run build` | Build di produzione |
| `npm test` | Test (Vitest) |
| `npm run lint` | ESLint (`ng lint`) |

---

## Funzionalità

- **Dashboard**: mappa Leaflet con selettore layer (meteo, incendi, voli, navi, traffico, eventi),
  marker a icona con popup di dettaglio, province cliccabili (outline) con vista aggregata
  (toggle Globale / Provincia), pannello allerte + news.
- **Eventi**: elenco eventi ufficiali da SardegnaTurismo (card con immagine).
- **Login + Gestione**: CRUD eventi per l'operatore admin (rotta protetta da guard).

---

## Struttura della directory

```
src/app/
├── core/
│   ├── guards/         # adminGuard
│   ├── interceptors/   # authInterceptor (Bearer + refresh)
│   ├── models/         # tipi (api JSend, eventi, province, feed)
│   └── services/       # auth, session, events, map, feeds, settings
├── features/
│   ├── dashboard/      # mappa + rail dati + selettore layer
│   ├── events/         # lista eventi esterni
│   ├── login/
│   └── admin/          # gestione eventi (CRUD)
└── layout/
    └── header/
```

---

## Git Flow

`feat/xxx` → push → PR su **`develop`** → (dopo verifica) merge su **`main`**.

## Convenzioni

- Componenti **standalone**, **signals** per lo stato, **inject()** per i servizi.
- Control-flow Angular aggiornato (`@if`, `@for`, `@switch`).
- Tag semantici + `aria-label`; focus-visible e `prefers-reduced-motion` gestiti.
- ESLint + Prettier prima del commit. Uno `.spec.ts` per ogni componente/servizio.
