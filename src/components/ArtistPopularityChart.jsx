import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

// Recharts è una libreria che trasforma array di dati in grafici SVG. 
// Il concetto base è sempre lo stesso: gli dai un array di oggetti e gli dici quale campo rappresentare.

const COLORS = [
  '#1DB954', '#1ED760', '#2EE871', '#3EF082',
  '#4EF893', '#6EFFA4', '#8EFFB5', '#AEFFC6',
  '#CEFFD7', '#EEFFE8',
]

function ArtistPopularityChart({ tracks }) {
  const data = tracks.map((track) => ({
    name: track.name.length > 15
      ? track.name.slice(0, 15) + '...'
      : track.name,
    fullName: track.name,
    artist: track.artists.map((a) => a.name).join(', '),
    duration: +(track.duration_ms / 60000).toFixed(2),
// Qui trasformiamo l'array di brani Spotify in un array di oggetti "puliti" per il grafico. 
// Ogni oggetto ha: 

// name (troncato a 15 caratteri per le etichette sull'asse X — altrimenti si sovrapporrebbero)
//fullName (il nome completo, che mostriamo nel tooltip quando passi il mouse)
// artist (gli artisti uniti in stringa)
// duration che è la parte importante.

// track.duration_ms / 60000 converte i millisecondi in minuti (60000ms = 1 minuto). 

// toFixed(2) arrotonda a 2 decimaliil 
// + davanti converte la stringa risultante di nuovo in un numero

  }))

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.[0]) {
// Il tooltip è quello che appare quando passi il mouse su una barra. 

// Recharts ti passa active (se il mouse è sopra una barra) e payload (i dati di quella barra). 
// payload[0].value è il valore numerico (la durata in minuti decimali, tipo 2.32)
// payload[0].payload è l'intero oggetto dati originale (dove troviamo fullName e artist).
      const mins = Math.floor(payload[0].value)
      const secs = Math.round((payload[0].value - mins) * 60)
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-white font-medium">{payload[0].payload.fullName}</p>
          <p className="text-gray-400 text-sm">{payload[0].payload.artist}</p>
          <p className="text-green-400 text-sm">
            Durata: {mins}:{String(secs).padStart(2, '0')}

{/*La conversione mins e secs trasforma 2.32 minuti in "2:19": Math.floor(2.32) = 2 minuti
(2.32 - 2) * 60 = 19.2, arrotondato a 19 secondi. */}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">

{/* // ResponsiveContainer è un wrapper che fa adattare il grafico alla dimensione del suo contenitore. Senza di esso, dovresti dare dimensioni fisse in pixel e il grafico non sarebbe responsivo. */}
        
        <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 40 }}>
{/*Il margin crea spazio attorno al grafico — il bottom: 40 è più grande degli altri perché le etichette sull'asse X sono ruotate e hanno bisogno di spazio.*/}
          <XAxis
            dataKey="name"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            angle={-35}
            textAnchor="end"
            axisLine={{ stroke: '#374151' }}
            tickLine={false}

// dataKey="name" dice all'asse X di usare il campo name per le etichette. 
// tick personalizza l'aspetto del testo (colore grigio, dimensione piccola). 
// angle={-35} ruota le etichette di 35 gradi per evitare che si sovrappongano 
// textAnchor="end" allinea il testo ruotato in modo che finisca vicino alla barra. 
// tickLine={false} rimuove le lineette verticali sotto ogni etichetta per un look più pulito.

          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            unit=" min"
// L'asse Y è più semplice: niente linea dell'asse, niente tick, e unit=" min" 
// Si aggiunge " min" dopo ogni numero (1 min, 2 min, 3 min...).
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
{/* // Il tooltip è quello che appare quando passi il mouse su una barra.  */}
          <Bar dataKey="duration" radius={[6, 6, 0, 0]}>

{/*dataKey="duration" dice alla barra quale campo usare per l'altezza. 
radius={[6, 6, 0, 0]} arrotonda i bordi superiori (top-left, top-right, bottom-right, bottom-left). */}
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
// Il Cell dentro il map è il modo di Recharts per dare un colore diverso a ogni barra
// senza di esso sarebbero tutte dello stesso colore. 

// COLORS[index % COLORS.length] cicla attraverso l'array di colori
// il % (modulo) assicura che se hai più barre che colori, ricomincia da capo.
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default ArtistPopularityChart