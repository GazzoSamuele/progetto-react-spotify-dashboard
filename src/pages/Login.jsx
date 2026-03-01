import { redirectToSpotify } from '../services/spotify'

function Login() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-950 gap-8">
      <h1 className="text-white text-4xl font-bold">
        Spotify Dashboard
      </h1>
      <p className="text-gray-400 text-lg">
        Analizza le tue abitudini musicali
      </p>
      <button
        onClick={redirectToSpotify}
        className="bg-green-500 hover:bg-green-400 text-black font-semibold py-3 px-8 rounded-full text-lg transition-colors cursor-pointer"
      >
        Accedi con Spotify
      </button>
    </div>
  )
}

export default Login