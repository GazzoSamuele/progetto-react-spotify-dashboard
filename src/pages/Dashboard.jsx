import { useNavigate } from 'react-router-dom'
import { logout } from '../services/spotify'
import { useSpotifyData } from '../hooks/useSpotifyData'
import ArtistPopularityChart from '../components/ArtistPopularityChart'
import GenreChart from '../components/GenreChart'
import RecentActivityChart from '../components/RecentActivityChart'

const TIME_RANGES = {
  short_term: 'Ultime 4 settimane',
  medium_term: 'Ultimi 6 mesi',
  long_term: 'Di sempre',
}

function Dashboard() {
  const navigate = useNavigate()
// useNavigate() è un hook di React Router che ti dà una funzione per cambiare pagina via codice. 
// Quando chiami navigate('/'), l'utente viene portato alla pagina di Login senza ricaricare il browser.
  const {
    user,
    topArtists,
    topTracks,
    recentTracks,
    timeRange,
    setTimeRange,
    loading,
    error,
// Il blocco con le graffe const { user, topArtists, ... } = useSpotifyData() è il destructuring. 
// Il nostro custom hook restituisce un oggetto con tutte quelle proprietà dentro. 

//Pensa al custom hook come a un cameriere al ristorante: 

// tu (la Dashboard) chiedi "portami tutto", e lui torna con un vassoio pieno di piatti (user, topArtists, topTracks...). 
// Il destructuring è come prendere ogni piatto dal vassoio e appoggiarlo sul tavolo.

} = useSpotifyData()

  const handleLogout = () => {
    logout()
    navigate('/')
  }
// handleLogout è una funzione che fa due cose in sequenza: 
// prima cancella i token dal localStorage (tramite logout())
// successivamente manda l'utente alla pagina di login.

//  La definiamo qui e poi la passiamo come onClick al bottone Logout.

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 gap-4">
        <p className="text-red-400 text-xl">Errore: {error}</p>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Torna al login
        </button>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-950">
        <p className="text-white text-xl">Caricamento...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {console.log('TRACKS:', topTracks.map(t => ({ name: t.name, popularity: t.popularity })))}
      {/* HEADER */}
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {user.images?.[0] && (

//L'optional chaining user.images?.[0] è una protezione: 
// se user.images è undefined o l'array è vuoto, invece di crashare restituisce undefined 
// il && impedisce che l'<img> venga renderizzato. 

// È un pattern difensivo che dovresti usare sempre quando lavori con dati da API esterne, 
// perché non puoi mai essere sicuro al 100% della struttura della risposta.
            <img
              src={user.images[0].url}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <h1 className="text-xl font-bold">Ciao, {user.display_name}!</h1>
            <p className="text-gray-400 text-sm">Account {user.product}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white transition-colors cursor-pointer"
        >
          Logout
        </button>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* FILTRI PERIODI D'ASCOLTO */}
        <div className="flex gap-2 mb-8">
          {Object.entries(TIME_RANGES).map(([value, label]) => (

// TIME_RANGES è un oggetto definito in cima al file: { short_term: 'Ultime 4 settimane', ... }. 

// Object.entries() lo trasforma in un array di coppie [chiave, valore]

// .map() crea un bottone per ciascuna.

            <button
              key={value}
              onClick={() => setTimeRange(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer ${
                timeRange === value
                  ? 'bg-green-500 text-black border-amber-500 border-2'
                  : 'bg-gray-800 text-gray-300 border-green-500 border-2 hover:bg-gray-700'
//I templates literal è il modo in cui si fa lo stile condizionale con Tailwind: 

// se il bottone è quello attivo (timeRange === value), usa il verde; 
// altrimenti usa il grigio. 
// Quando clicchi, setTimeRange(value) aggiorna lo stato nel hook, che fa rieseguire il fetch, che aggiorna le liste.
              }`}
            >
              {label}
            </button>
          ))}
        </div>

      {loading ? (
          <p className="text-gray-400">Caricamento dati...</p>
        ) : (
          <>
            {/* RIGA GRAFICI */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <section className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">
                  Durata Top Brani
                </h2>
                <ArtistPopularityChart tracks={topTracks} />
{/*<ArtistPopularityChart tracks={topTracks} /> passa i brani al grafico a barre,*/}
              </section>

              <section className="bg-gray-900 rounded-2xl p-6">
                <h2 className="text-lg font-bold mb-4">
                  Artisti più ascoltati
                </h2>
                <GenreChart recentTracks={recentTracks} />
{/*<GenreChart recentTracks={recentTracks} /> passa gli ascolti recenti alla ciambella*/}
              </section>
            </div>

            {/* GRAFICO ATTIVITÀ */}
            {recentTracks.length > 0 && (
              <section className="bg-gray-900 rounded-2xl p-6 mb-8">
                <h2 className="text-lg font-bold mb-4">
                  Quando ascolti musica
                </h2>
                <RecentActivityChart recentTracks={recentTracks} />
{/*<RecentActivityChart recentTracks={recentTracks} /> gli stessi dati al grafico timeline.*/}
              </section>
            )}  

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* TOP ARTISTI */}
            <section className="bg-red-950 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">
                Top Artisti
              </h2>
             
              <div className="space-y-3">
                {topArtists.map((artist, index) => (
//.map() itera sull'array e crea un elemento JSX per tutti gli artisti. 

// Il key={artist.id} è obbligatorio in React quando fai .map() — aiuta React a capire 
// quale elemento è cambiato quando l'array si aggiorna, così non deve ricreare tutto da zero.
                  <div
                    key={artist.id}
                    className="flex items-center gap-4"
                  >
                    <span className="text-gray-500 w-6 text-right text-sm">
                      {index + 1}
                    </span>
{/* // index + 1 mostra la posizione in classifica (index parte da 0, ma vuoi mostrare 1, 2, 3...). */}
                    <img
                      src={artist.images?.[2]?.url || artist.images?.[0]?.url}
                      alt={artist.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
{/* // min-w-0 è un trucco necessario per far funzionare truncate dentro un flex container 
// senza di esso, il testo lungo non verrebbe troncato ma allargherebbe il div. */}
                      <p className="font-medium truncate">{artist.name}</p>

{/* truncate aggiunge i tre puntini ... quando il testo è troppo lungo per lo spazio disponibile, 
invece di andare a capo o rompere il layout. */}

                      <p className="text-gray-400 text-sm truncate">
                        {artist.genres?.slice(0, 2).join(', ')}
{/* La riga dei generi fa diverse cose in catena: 

artist.genres è un array tipo ['pop', 'rock', 'indie', 'alternative']. 
Il ?. (optional chaining) protegge dal caso in cui genres non esista. 
.slice(0, 2) prende solo i primi due elementi → ['pop', 'rock']. 
.join(', ') li unisce in una stringa → "pop, rock". 

Senza .slice(0, 2) mostreremmo tutti i generi e il testo diventerebbe troppo lungo. */}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* TOP BRANI */}
            <section className="bg-gray-900 rounded-2xl p-6">
              <h2 className="text-lg font-bold mb-4">
                Top Brani
              </h2>
              <div className="space-y-3">
                {topTracks.map((track, index) => (
                  <div
                    key={track.id}
                    className="flex items-center gap-4"
                  >
                    <span className="text-gray-500 w-6 text-right text-sm">
                      {index + 1}
                    </span>
                    <img
                      src={track.album.images?.[2]?.url}
                      alt={track.album.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{track.name}</p>
                      <p className="text-gray-400 text-sm truncate">
                        {track.artists.map((a) => a.name).join(', ')}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {Math.floor(track.duration_ms / 60000)}:
                      {String(
                        Math.floor((track.duration_ms % 60000) / 1000)
                      ).padStart(2, '0')}
{/* //Spotify restituisce la durata in millisecondi (es. 215000ms). 
// Questa formula la converte in minuti e secondi: 

// 215000 / 60000 = 3 minuti, 215000 % 60000 = 35000 / 1000 = 35 secondi. 

// padStart(2, '0') assicura che i secondi abbiano sempre due cifre (3:05 invece di 3:5). */}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>
            {/* ASCOLTI RECENTI */}
            {recentTracks.length > 0 && (
            <section className="bg-gray-900 rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-lg font-bold mb-4">
                Ascoltati di recente
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recentTracks.map((item, index) => (
                  <div
                    key={`${item.track.id}-${index}`}

// La key qui è speciale: key={item.track.id−{item.track.id}-item.track.id−{index}. 

// Normalmente useresti solo l'id del brano, ma negli ascolti recenti puoi aver ascoltato 
// lo stesso brano due volte. Se due elementi hanno la stessa key, React si confonde. 
// Aggiungendo l'index rendiamo ogni key unica anche con duplicati.

                    className="flex items-center gap-3"
                  >
                    <img
                      src={item.track.album.images?.[0]?.url}

// item.track.album.images?.[2]?.url — qui la struttura dati di Spotify è annidata: 
// ogni "item" contiene un "track", che contiene un "album", che contiene un array "images". 
// L'indice [0] prende la prima immagine
// Il ?. a ogni passaggio protegge da dati mancanti.

                      alt={item.track.album.name}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {item.track.name}
                      </p>
                      <p className="text-gray-400 text-xs truncate">
                        {item.track.artists.map((a) => a.name).join(', ')}

{/*item.track.artists.map((a) => a.name).join(', ') — un brano può avere più artisti 
artists è un array di oggetti tipo [{name: 'Drake'}, {name: 'Rihanna'}]. 
.map((a) => a.name) estrae solo i nomi → ['Drake', 'Rihanna']. 
.join(', ') li unisce → "Drake, Rihanna". */}

                      </p>
                    </div>
                    <span className="text-gray-500 text-xs whitespace-nowrap">
                      {new Date(item.played_at).toLocaleTimeString('it-IT', {

// played_at è una data in formato ISO (tipo 2026-03-01T12:30:00Z). 
// new Date() la converte in un oggetto Date di JavaScript, e toLocaleTimeString('it-IT') 
// la formatta all'italiana mostrando solo ore e minuti.

                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default Dashboard