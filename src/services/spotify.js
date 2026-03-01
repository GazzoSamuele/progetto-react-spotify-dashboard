// Qui metteremo tutta la logica per comunicare con Spotify
const CLIENT_ID = '17c8a20472434c6a9328ae3719fef4f4'
const REDIRECT_URI = window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:5173/callback'
  : `${window.location.origin}/callback`
const SCOPES = [
  'user-top-read',
  'user-read-recently-played',
  'user-read-private',
  'user-read-email',
].join(' ')

// === PKCE HELPERS ===

// Genera una stringa casuale per la sicurezza
function generateRandomString(length) {
  const possible = 'qazwsxedcrfvtgbyhnujmikolpPLOMKINJUBHYVGTCFRXDEZSWAQ1928374650'
  const values = crypto.getRandomValues(new Uint8Array(length))
  return values.reduce((acc, x) => acc + possible[x % possible.length], '')
}

// Crea l'hash SHA-256 (richiesto dal flusso PKCE)
async function sha256(plain) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  return window.crypto.subtle.digest('SHA-256', data)
}

// Converte l'hash in base64 URL-safe
function base64encode(input) {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
}

// === FUNZIONI PRINCIPALI ===

// Avvia il login: genera il code verifier, lo salva, e redirige a Spotify
export async function redirectToSpotify() {
  const codeVerifier = generateRandomString(64)
  const hashed = await sha256(codeVerifier)
  const codeChallenge = base64encode(hashed)

  // Salva il code verifier — ci servirà dopo nel callback
  window.localStorage.setItem('code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    scope: SCOPES,
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
  })

  window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`
}

// Scambia il codice ricevuto da Spotify per un access token
export async function getAccessToken(code) {
  const codeVerifier = localStorage.getItem('code_verifier')

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      grant_type: 'authorization_code',
      code,
      redirect_uri: REDIRECT_URI,
      code_verifier: codeVerifier,
    }),
  })

  const data = await response.json()

  if (data.access_token) {
    localStorage.setItem('access_token', data.access_token)
    localStorage.setItem('refresh_token', data.refresh_token)
  }

  return data
}

// Chiama qualsiasi endpoint dell'API Spotify
export async function fetchFromSpotify(endpoint) {
  const token = localStorage.getItem('access_token')

  const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    throw new Error(`Spotify API error: ${response.status}`)
  }

  return response.json()
}

// Controlla se l'utente è già loggato
export function isLoggedIn() {
  return localStorage.getItem('access_token') !== null
}

// Logout
export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('code_verifier')
}
// === FUNZIONI PER I DATI ===

// Queste funzioni sono dei "wrapper": 

// avvolgono la funzione "fetchFromSpotify"rendendola più comoda da usare. 

export async function getTopArtists(timeRange = 'medium_term', limit = 10) {

    // Invece di dover ricordare ogni volta l'URL esatto dell'API Spotify, 
    // nel resto dell'app scrivi semplicemente getTopArtists().

  return fetchFromSpotify(`me/top/artists?time_range=${timeRange}&limit=${limit}`)
    
    //I parametri hanno dei valori di default (timeRange = 'medium_term'). 
    // Questo significa che se chiami getTopArtists() senza argomenti, usa automaticamente 
    // "ultimi 6 mesi" e limite 10. Ma puoi anche chiamarla con getTopArtists('short_term', 5) 
    // per avere i top 5 delle ultime 4 settimane.
}
    //L'API di Spotify funziona con delle query string nell'URL: ?time_range=medium_term&limit=10. 
    // È il modo standard in cui le API REST ricevono parametri — li aggiungi nell'URL 
    // dopo il ?, separati da &. 

export async function getTopTracks(timeRange = 'medium_term', limit = 10) {
  return fetchFromSpotify(`me/top/tracks?time_range=${timeRange}&limit=${limit}`)
}


export async function getRecentlyPlayed(limit = 20) {
  return fetchFromSpotify(`me/player/recently-played?limit=${limit}`)
}


export async function getUserProfile() {
  return fetchFromSpotify('me')
}

export async function getArtistsDetails(artistIds) {
  const ids = artistIds.join(',')
  return fetchFromSpotify(`artists?ids=${ids}`)
}