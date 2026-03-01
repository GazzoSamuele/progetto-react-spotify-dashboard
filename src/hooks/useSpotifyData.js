import { useState, useEffect } from "react";
import {
    getUserProfile,
  getTopArtists,
  getTopTracks,
  getRecentlyPlayed,
} from "../services/spotify";

// un hook è una funzione che ti permette di usare funzionalità di React (stato, effetti, ecc.). 
// Un custom hook è semplicemente una funzione creata da te che al suo interno usa gli hook di React. 
// Per convenzione il nome inizia sempre con use.

//Il vantaggio è che estrai la logica dal componente. 
// Senza il custom hook, tutta la logica di fetch sarebbe dentro Dashboard.jsx, rendendolo enorme e confuso. 
// Con il hook, la Dashboard chiama semplicemente useSpotifyData() 
// ricevendo i dati pronti — non sa e non deve sapere come vengono recuperati.

export function useSpotifyData() {
    const [user, setUser] = useState(null);
    const [topArtists, setTopArtists] = useState([]);
    const [topTracks, setTopTracks] = useState([]);
    const [recentTracks, setRecentTracks] = useState([]);
    const [timeRange, setTimeRange] = useState("medium_term");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

//Ogni useState crea una "scatola" che contiene un dato e una funzione per aggiornarlo. 
// Nota i valori iniziali: 

// null per dati che non esistono ancora, 
// [] (array vuoto) per le liste, 
// true per loading (perché appena la pagina si apre, stiamo già caricando), 
// null per l'errore (nessun errore all'inizio).


// Carica il profilo e i brani recenti

//Questo useEffect ha le dipendenze vuote [], 
// quindi viene eseguito una sola volta quando il componente appare sullo schermo. 
// È il posto giusto per caricare dati che non cambiano (il profilo utente e gli ascolti recenti).
  
    useEffect(() => {
        async function loadInitialData() {
            try {
                const [profileData, recentData] = await Promise.all([
// Promise.all è un trucco fondamentale per le performance. Senza di esso faresti:
                    getUserProfile(),           // parte subito
                    getRecentlyPlayed(),        // parte subito anche questa
                ]);
                setUser(profileData);
                setRecentTracks(recentData.items);
            } catch (err) {
                setError(err);
            }
//Il try/catch gestisce gli errori: se una delle due chiamate fallisce (token scaduto, Spotify offline, ecc.)
// invece di crashare l'app, salviamo il messaggio d'errore nello stato e lo mostriamo all'utente.
        }
        loadInitialData();
    }, []);

    // Carica i brani e gli artisti
    useEffect(() => {
        async function loadTopData() {
            setLoading(true);

// setLoading(true) all'inizio mostra "Caricamento dati..." mentre aspettiamo la risposta.

            try {
                const [artistsData, tracksData] = await Promise.all([
                    getTopArtists(timeRange),
                    getTopTracks(timeRange),

//La differenza chiave: le dipendenze sono [timeRange]. 
// Questo significa che l'effetto si riesegue ogni volta che timeRange cambia. 

// Quando l'utente clicca il bottone "Ultime 4 settimane", setTimeRange('short_term') aggiorna lo stato, 
// React vede che la dipendenza è cambiata e rilancia il fetch con il nuovo periodo.
                ]);
                
                setTopArtists(artistsData.items);
                setTopTracks(tracksData.items);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);

//Il blocco finally è speciale: viene eseguito sia che il try abbia successo, 
// sia che il catch catturi un errore. 
// Così setLoading(false) viene sempre chiamato e la UI non rimane bloccata su "Caricamento..." per sempre.

            }
        }
        loadTopData();
    }, [timeRange]);

    return {
        user,
        topArtists,
        topTracks,
        recentTracks,
        timeRange,
        setTimeRange,
        loading,
        error,
            
        }
    }

//Il hook restituisce un oggetto con tutti i dati e le funzioni utili. 
// Nota che restituisce sia timeRange (il valore corrente) che setTimeRange (la funzione per cambiarlo). 
// Così la Dashboard può sia leggere quale filtro è attivo, sia cambiarlo quando l'utente clicca un bottone.
