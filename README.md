# Oncoria · mockup della dashboard

Mockup cliccabile della dashboard Oncoria per la farmacia ospedaliera. Lo scenario è la rete oncologica della provincia di Salerno, vista dalla farmacia dell’AOU San Giovanni di Dio e Ruggi d’Aragona.

Il sito è statico (HTML, CSS e JavaScript senza build) e funziona così com’è su GitHub Pages.

## Pagine

| File | Schermata |
| --- | --- |
| `index.html` | Panoramica: KPI, mappa della rete, fabbisogno, suggerimento, trasferimenti |
| `fabbisogno.html` | Fabbisogno previsto: giacenza giorno per giorno, dettaglio per farmaco, somministrazioni programmate |
| `rete.html` | Rete presidi: mappa interattiva per farmaco, matrice presidi × farmaci, qualità dei dati |
| `suggerimenti.html` | Suggerimenti di riallocazione: motivazioni, vincoli, confronto nuovo ordine vs rete, registro |
| `trasferimenti.html` | Trasferimenti: stato, tracciabilità, temperatura durante il trasporto |
| `ordini.html` | Ordini: arrivo dell’ordine rispetto alla data del bisogno |
| `kpi.html` | KPI di validazione del pilota |
| `regole.html` | Regole e vincoli definiti dagli operatori |

### App del paziente

Si apre dalla dashboard con **App paziente** nella barra laterale (sezione “Altre viste”), oppure da `paziente/index.html`.

| File | Schermata |
| --- | --- |
| `paziente/index.html` | Home: prossima seduta, cosa fare prima, percorso, notifica del farmaco pronto |
| `paziente/seduta.html` | Dettaglio della seduta, preparazione della terapia, conferma o richiesta di spostamento |
| `paziente/calendario.html` | Calendario di settembre, ottobre e novembre con sedute, esami e visite |
| `paziente/percorso.html` | Cicli di terapia, prossime tappe, chi ti segue |
| `paziente/documenti.html` | Referti e documenti, con filtro |
| `paziente/notifiche.html` | Notifiche |
| `paziente/contatti.html` | Contatti del Day Hospital e messaggio al team |

Sul computer l’app si vede dentro la cornice di un telefono, con i link alle schermate e il ritorno alla dashboard; sul telefono occupa tutto lo schermo. Checklist, conferma di presenza e notifiche lette restano salvate nel browser di chi prova la demo.

### Tema

Il tema predefinito è quello chiaro. Il pulsante con la luna in alto a destra passa al tema notturno blu; la scelta vale per dashboard e app paziente e resta memorizzata nel browser.

I link diretti funzionano anche con l’ancora, per esempio `fabbisogno.html#pembro`, `rete.html#tortora`, `suggerimenti.html#S-0233`, `trasferimenti.html#TR-0144`.

## Pubblicare su GitHub Pages

1. Crea un repository su GitHub, per esempio `oncoria-mockup`.
2. Carica tutto il contenuto di questa cartella nella radice del repository, file `.nojekyll` compreso.
3. Vai in **Settings → Pages**, scegli **Deploy from a branch**, branch `main`, cartella `/ (root)`, e salva.
4. Dopo un minuto il sito è online su `https://<utente>.github.io/oncoria-mockup/`.

Da terminale:

```bash
git init && git add . && git commit -m "Mockup dashboard Oncoria"
git branch -M main
git remote add origin https://github.com/<utente>/oncoria-mockup.git
git push -u origin main
```

Per provarlo in locale basta aprire `index.html` nel browser, oppure lanciare `python3 -m http.server` nella cartella.

## Struttura

- `assets/css/tokens.css`: colori, spazi, raggi e font del design system Oncoria (tema chiaro e scuro).
- `assets/css/components.css`: componenti (badge, KPI, barre di copertura, tracker, card suggerimento).
- `assets/css/app.css`: layout dell’applicazione, mappa, responsive.
- `assets/js/data.js`: presidi, farmaci, giacenze e trasferimenti simulati, confini della provincia.
- `assets/js/sched.js`: somministrazioni e ordini dei prossimi 14 giorni all’AOU Ruggi.
- `assets/js/map.js`, `charts.js`, `app.js`: mappa, grafici, tema e interazioni.
- `assets/css/paziente.css`, `assets/js/paziente.js`: stile e interazioni dell’app del paziente.

Per cambiare i numeri modifica `data.js` e `sched.js`: mappa e grafici si aggiornano da soli. I testi delle pagine sono nei file HTML.

## Note

- I presidi sono reali (AOU Ruggi e presidi ospedalieri dell’ASL Salerno). Persone, giacenze, fabbisogni, ordini, trasferimenti e KPI sono inventati a scopo dimostrativo.
- I confini dei comuni vengono dai dati ISTAT distribuiti da [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy).
- I font League Spartan e Barlow vengono caricati da Google Fonts.
