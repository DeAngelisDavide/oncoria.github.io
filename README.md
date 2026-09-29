# Oncoria · mockup della dashboard

Mockup cliccabile della dashboard Oncoria per la farmacia ospedaliera. Lo scenario è la rete oncologica della provincia di Salerno, vista dalla farmacia dell’AOU San Giovanni di Dio e Ruggi d’Aragona.

Oncoria è una piattaforma predittiva per i farmaci oncologici ad alto valore: prevede il fabbisogno di ogni presidio, confronta deficit ed eccedenze nella rete e suggerisce al farmacista se riallocare o fare un nuovo ordine. La decisione resta sempre al farmacista.

> Non ottimizziamo il magazzino del singolo ospedale. Ottimizziamo la disponibilità della rete, senza compromettere il fabbisogno di nessun presidio.

## Hackathon

Progetto sviluppato per l’**Hackathon 2026 della Summer School D3 4 Health**.

## Team

| Nome | Area | Profilo | Organizzazione |
| --- | --- | --- | --- |
| Michele Picariello | Dominio sanitario · coordinamento del progetto | Dottorando in Ingegneria Industriale · prodotto, processi, KPI, B2G/B2B | Università degli Studi della Campania “Luigi Vanvitelli” |
| Carlo Sorrentino | Management e sicurezza | Dottorando in Cyber Intelligence for Civil Infrastructure | Università degli Studi di Salerno |
| Davide De Angelis | Software e dati | Dottorando in Informatica · Smart Biometric | Università degli Studi di Salerno |
| Guido Immediata | Software e dati | Dottorando in Informatica · AI in Automotive | Università degli Studi di Salerno |
| Francesca Santoriello | Dominio farmaceutico | Laureanda magistrale · Scienze Politiche e Chimica e Tecnologia Farmaceutica | Università degli Studi di Salerno |
| Elena Martucci | Dominio farmaceutico | Laureanda magistrale · Chimica e Tecnologia Farmaceutica | Università degli Studi di Salerno |

## Pagine

Il sito è statico: HTML, CSS e JavaScript, senza passaggi di build.

| File | Schermata |
| --- | --- |
| `index.html` | Panoramica: KPI, mappa della rete, fabbisogno, suggerimento, trasferimenti |
| `fabbisogno.html` | Fabbisogno previsto: giacenza giorno per giorno, dettaglio per farmaco, somministrazioni programmate |
| `rete.html` | Rete presidi: mappa interattiva per farmaco (di default quello con un trasferimento in viaggio), matrice presidi × farmaci, qualità dei dati |
| `suggerimenti.html` | Suggerimenti di riallocazione: motivazioni, vincoli, confronto nuovo ordine vs rete, registro |
| `trasferimenti.html` | Trasferimenti: stato, tracciabilità, temperatura durante il trasporto |
| `ordini.html` | Ordini: arrivo dell’ordine rispetto alla data del bisogno |
| `kpi.html` | KPI di validazione del pilota |
| `regole.html` | Regole e vincoli definiti dagli operatori |

### Brand identity

`brand.html` (voce **Brand identity** nella barra laterale) mostra il PDF `assets/docs/oncoria-brand-identity.pdf` con un visualizzatore a pagine: frecce, miniature, schermo intero e download. Per aggiornarlo basta sostituire quel file con uno nuovo con lo stesso nome; titolo e numero di pagine si leggono dal PDF. Il visualizzatore usa PDF.js (Mozilla, licenza Apache 2.0), incluso in `assets/vendor/pdfjs/`, e funziona quando il sito è servito da un server web; aprendo `brand.html` direttamente dal disco compare il lettore PDF del browser.

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

I link diretti funzionano anche con l’ancora, per esempio `fabbisogno.html#pembro`, `rete.html#tortora`, `suggerimenti.html#S-0233`, `trasferimenti.html#TR-0144`, `brand.html#p6`.

## Struttura

- `assets/css/tokens.css`: colori, spazi, raggi e font del design system Oncoria (tema chiaro e scuro).
- `assets/css/components.css`: componenti (badge, KPI, barre di copertura, tracker, card suggerimento).
- `assets/css/app.css`: layout dell’applicazione, mappa, responsive.
- `assets/js/data.js`: presidi, farmaci, giacenze e trasferimenti simulati, confini della provincia.
- `assets/js/sched.js`: somministrazioni e ordini dei prossimi 14 giorni all’AOU Ruggi.
- `assets/js/map.js`, `charts.js`, `app.js`: mappa, grafici, tema e interazioni.
- `assets/css/paziente.css`, `assets/js/paziente.js`: stile e interazioni dell’app del paziente.
- `assets/docs/`: il PDF della brand identity; `assets/vendor/pdfjs/`: il visualizzatore PDF.

Per cambiare i numeri modifica `data.js` e `sched.js`: mappa e grafici si aggiornano da soli. I testi delle pagine sono nei file HTML.

## Note

- I presidi sono reali (AOU Ruggi e presidi ospedalieri dell’ASL Salerno). Le persone che compaiono nei mockup (farmacista, paziente, medici), le giacenze, i fabbisogni, gli ordini, i trasferimenti e i KPI sono inventati a scopo dimostrativo.
- I confini dei comuni vengono dai dati ISTAT distribuiti da [openpolis/geojson-italy](https://github.com/openpolis/geojson-italy).
- I font League Spartan e Barlow vengono caricati da Google Fonts.