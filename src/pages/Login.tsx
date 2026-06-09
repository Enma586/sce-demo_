import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext.tsx'
import { resetDemoDatabase } from '../services/seed.service.ts'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email] = useState('demo@scestudio.com')
  const [password] = useState('123456')
  const [error, setError] = useState('')
  const [seeding, setSeeding] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSeeding(true)
    try {
      await resetDemoDatabase()
      const ok = await login(email, password)
      if (ok) navigate('/dashboard', { replace: true })
      else setError('Credenciales inválidas')
    } catch {
      setError('Error al inicializar la base de datos')
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="min-h-screen doodle-dots flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 24 }}
        className="w-full max-w-md doodle-border bg-white p-10"
      >
        <div className="flex flex-col items-center mb-8">
          <img
            src="/logo.jpeg"
            alt="SCE Studio"
            className="w-20 h-20 rounded-2xl object-cover mb-4"
          />
          <h1 className="text-2xl font-bold text-navy-900 doodle-underline">
            SCE Studio
          </h1>
          <p className="text-sm text-navy-500 mt-3">Panel de administración</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1.5">
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-navy-50 text-navy-900 text-sm outline-none cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-navy-700 mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              readOnly
              className="w-full px-4 py-2.5 rounded-xl border border-navy-200 bg-navy-50 text-navy-900 text-sm outline-none cursor-not-allowed"
            />
          </div>

          {error && (
            <p className="text-sm text-red-accent font-medium">{error}</p>
          )}

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={seeding}
            className="w-full py-2.5 rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
          >
            {seeding ? 'Preparando demo...' : 'Entrar al Demo'}
          </motion.button>
        </form>

        <p className="text-xs text-navy-500 text-center mt-6">
          Demo · los datos se reinician automáticamente
        </p>
      </motion.div>
    </div>
  )
}
