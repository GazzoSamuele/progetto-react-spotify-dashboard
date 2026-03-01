import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

const COLORS = [
  '#1DB954', '#1ED760', '#4EF893', '#FF6B6B',
  '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8',
]

function GenreChart({ recentTracks }) {
  // Conta quante volte appare ogni artista negli ascolti recenti
  const artistCounts = {}
  recentTracks.forEach((item) => {
    item.track.artists.forEach((artist) => {
      artistCounts[artist.name] = (artistCounts[artist.name] || 0) + 1
// artistCounts[artist.name] || 0 significa: 

// "se questo artista è già stato contato, prendi il suo conteggio, altrimenti parti da 0". 
// Poi aggiungiamo 1. Alla fine avremo qualcosa tipo { 'St-Amour': 3, 'morisan': 3, 'Amy Gadiaga': 2, ... }.
    })
  })

  const data = Object.entries(artistCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, value]) => ({ name, value }))

// Object.entries() trasforma l'oggetto in array di coppie: [['St-Amour', 3], ['morisan', 3], ...]. 

// .sort((a, b) => b[1] - a[1]) ordina per conteggio decrescente 
// (il [1] accede al secondo elemento di ogni coppia, cioè il numero). 

// .slice(0, 8) prende solo i primi 8 per non sovraffollare il grafico.

// .map() trasforma ogni coppia in un oggetto { name, value } che è il formato che Recharts vuole per il PieChart.

  if (data.length === 0) return <p className="text-gray-500">Nessun dato disponibile</p>

  const CustomTooltip = ({ active, payload }) => {
{/* // Il tooltip è quello che appare quando passi il mouse su una barra.  */}
    if (active && payload?.[0]) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-white font-medium">{payload[0].name}</p>
          <p className="text-green-400 text-sm">
            {payload[0].value} ascolti recenti
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-72 flex items-center">
      <ResponsiveContainer width="50%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={50}
            outerRadius={90}
            dataKey="value"
            stroke="none"
          >
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
{/* // Il tooltip è quello che appare quando passi il mouse su una barra.  */}
        </PieChart>
      </ResponsiveContainer>

      <div className="flex-1 space-y-2 pl-4">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-gray-300 text-sm truncate">
              {item.name}
            </span>
            <span className="text-gray-500 text-xs ml-auto">
              {item.value}
{/*Per ogni artista creiamo una riga con:

 un pallino colorato (lo stesso colore della fetta corrispondente grazie a COLORS[index])

 il nome, e il conteggio allineato a destra con ml-auto. 

 shrink-0 sul pallino impedisce che si rimpicciolisca quando il nome è lungo.*/}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default GenreChart