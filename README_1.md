# 🎵 Spotify Analytics Dashboard

Web app che si collega all'account Spotify e ti mostra le abitudini musicali: i brani che ascolti di più, gli artisti preferiti e a che ora del giorno ascolti musica.

**[🔗 Sito live](https://progetto-react-spotify-dashboard.netlify.app/)**

> **Nota:** L'app è in modalità sviluppo Spotify, quindi solo il mio account può fare il login. Qui sotto ci sono gli screenshot per vedere come funziona.

---

<!-- ## 📸 Screenshots

| Login | Dashboard |
|-------|-----------|
| ![Login](./screenshots/login.png) | ![Dashboard](./screenshots/dashboard.png) |

| Grafici | Tutti i grafici |
|---------|-----------------|
| ![Grafico1](./screenshots/grafico1.png) | ![Grafico2](./screenshots/grafico2.png) |
| ![Grafico3](./screenshots/grafico3.png) | ![Categorie](./screenshots/categorie.png) |

--- -->

## Cosa fa l'app

- **Login con Spotify** — L'utente accede con il suo account Spotify. L'autenticazione usa il flusso PKCE, che permette di fare tutto dal browser senza bisogno di un server backend
- **Grafici interattivi** — Un diagramma a barre per la durata dei brani, un diagramma a torta per gli artisti più ascoltati di recente, e un ideogramma che mostra in quali ore del giorno si ascolta più musica
- **Filtri temporali** — Si possono scegliere diversi filtri di tempo: "ultime 4 settimane", "ultimi 6 mesi" e "di sempre"
- **Classifica artisti e brani** — La top 10 con copertine, nomi e durata
- **Ascolti recenti** — Gli ultimi 20 brani ascoltati con l'orario
- **Responsive** — Funziona su desktop e mobile

---

## Struttura del progetto

```
src/
├── components/                     # I componenti dei grafici
│   ├── ArtistPopularityChart.jsx   # Diagramma a barre (durata brani)
│   ├── GenreChart.jsx              # Diagramma a torta (artisti frequenti)
│   └── RecentActivityChart.jsx     # Ideogramma a barre (ore di ascolto)
├── hooks/
│   └── useSpotifyData.js           # Custom hook che gestisce tutte le chiamate API
├── pages/
│   ├── Login.jsx                   # Pagina di login
│   ├── Callback.jsx                # Gestisce il ritorno da Spotify dopo il login
│   └── Dashboard.jsx               # La dashboard principale
├── services/
│   └── spotify.js                  # Tutte le funzioni per parlare con l'API Spotify
├── App.jsx                         # Le rotte dell'app
└── main.jsx                        # Punto di ingresso
```

Ho organizzato il codice separando la logica API (nella cartella `services/`) dai componenti visivi (`components/` e `pages/`). In questo modo ogni file ha un compito preciso e il codice è più facile da leggere e modificare.

---

## Tecnologie usate

| Tecnologia | A cosa serve |
|-----------|-------------|
| **React** | Libreria per costruire l'interfaccia |
| **Vite** | Tool di sviluppo, avvia il server locale |
| **Tailwind CSS** | Per lo stile, usando classi direttamente nell'HTML |
| **Recharts** | Libreria per creare i grafici |
| **React Router** | Per gestire le diverse pagine dell'app |
| **Spotify Web API** | Da dove arrivano tutti i dati musicali |
| **Netlify** | Dove è hostata l'app online |

---

## Come avviare il progetto in locale

Serve Node.js installato e un account Spotify.

```bash
# Clona il repository
git clone https://github.com/GazzoSamuele/progetto-react-spotify-dashboard.git

# Entra nella cartella
cd progetto-react-spotify-dashboard

# Installa le dipendenze
npm install

# Avvia il server di sviluppo
npm run dev
```

Poi devi creare un'app su [developer.spotify.com/dashboard](https://developer.spotify.com/dashboard), aggiungere `http://127.0.0.1:5173/callback` come Redirect URI e copiare il Client ID dentro `src/services/spotify.js`.

---

## Cosa ho imparato costruendo questo progetto

- Come funziona l'autenticazione OAuth 2.0 e perché il flusso PKCE è adatto per le app che girano nel browser
- Come creare un custom hook in React per separare la logica di fetch dai componenti
- Come trasformare dati grezzi da un'API in grafici leggibili
- Come gestire le chiamate API in parallelo con `Promise.all` per velocizzare il caricamento
- Come adattarmi quando l'API non restituisce i dati che mi aspettavo (ho dovuto cambiare approccio sui grafici perché alcuni campi non erano disponibili in modalità sviluppo)
---

## Cosa migliorerei in futuro

- Aggiungere il refresh automatico del token, così non serve rifare il login ogni ora
- Aggiungere altri grafici, per esempio uno che mostra quanto sono "ballabili" o "energiche" le canzoni che ascolto
- Permettere di scaricare le proprie statistiche come immagine
- Salvare i dati in cache per non rifare le stesse chiamate API quando si cambia filtro

---

