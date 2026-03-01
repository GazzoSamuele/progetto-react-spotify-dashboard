import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function RecentActivityChart({ recentTracks }) {
  // Raggruppa gli ascolti per ora
  const hourCounts = {}
  recentTracks.forEach((item) => {
    const hour = new Date(item.played_at).getHours()
    hourCounts[hour] = (hourCounts[hour] || 0) + 1
// Stesso pattern di conteggio frequenze, ma questa volta contiamo per ora del giorno. 
// new Date(item.played_at).getHours() estrae l'ora (0-23) dalla data di ascolto.
  })

  // Crea dati per tutte le 24 ore
  const data = Array.from({ length: 24 }, (_, i) => ({
    hour: `${String(i).padStart(2, '0')}:00`,
    ascolti: hourCounts[i] || 0,
// Array.from({ length: 24 }) crea un array di 24 elementi (uno per ogni ora). 
// Per ogni ora creiamo 

// un oggetto con l'etichetta formattata ("00:00", "01:00", ... "23:00") 
// il conteggio (o 0 se non hai ascoltato nulla in quell'ora).

// Questo è importante: senza le ore vuote il grafico avrebbe dei "buchi"
// di conseguenza non mostrerebbe correttamente il pattern temporale.
  }))

  const CustomTooltip = ({ active, payload }) => {
{/* // Il tooltip è quello che appare quando passi il mouse su una barra.  */}
    if (active && payload?.[0]) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3">
          <p className="text-white font-medium">{payload[0].payload.hour}</p>
          <p className="text-green-400 text-sm">
            {payload[0].value} brani
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1DB954" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#1DB954" stopOpacity={0} />
            </linearGradient>
{/*Questo è SVG puro. defs definisce elementi riutilizzabili. 

Il linearGradient crea un gradiente verticale (da y1="0" in alto a y2="1" in basso) 
che va dal verde fino semi-trasparente (opacità 0.3) al trasparente completo (opacità 0). 

Lo applichiamo come riempimento dell'area sotto la linea con fill="url(#greenGradient)". 
L'effetto è quel fading verde che rende il grafico molto più elegante di un semplice riempimento pieno.*/}
          </defs>
          <XAxis
            dataKey="hour"
            tick={{ fill: '#9CA3AF', fontSize: 11 }}
            axisLine={{ stroke: '#374151' }}
            tickLine={false}
            interval={3}
          />
          <YAxis
            tick={{ fill: '#9CA3AF', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
{/* // Il tooltip è quello che appare quando passi il mouse su una barra.  */}
          <Area
            type="monotone"
            dataKey="ascolti"
            stroke="#1DB954"
            strokeWidth={2}
            fill="url(#greenGradient)"

// type="monotone" crea curve morbide tra i punti (invece di linee spezzate). 
// stroke è il colore della linea
// strokeWidth il suo spessore
// fill usa il gradiente che abbiamo definito sopra. 

// interval={3} sull'asse X mostra un'etichetta ogni 3 ore per evitare sovraffollamento.
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RecentActivityChart