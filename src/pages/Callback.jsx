import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getAccessToken } from '../services/spotify'

function Callback() {
  const navigate = useNavigate()

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      getAccessToken(code).then((data) => {
        if (data.access_token) {
          navigate('/dashboard')
        }
      })
    }
  }, [navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-950">
      <p className="text-white text-xl">Connessione a Spotify in corso...</p>
    </div>
  )
}

export default Callback