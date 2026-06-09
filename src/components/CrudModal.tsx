import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface FieldConfig {
  name: string
  label: string
  type: 'text' | 'email' | 'number' | 'select' | 'date'
  required?: boolean
  options?: { value: string; label: string }[]
  placeholder?: string
}

interface CrudModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: Record<string, string>) => Promise<void>
  fields: FieldConfig[]
  initialValues?: Record<string, string>
  title: string
  saving?: boolean
}

export default function CrudModal({
  open,
  onClose,
  onSave,
  fields,
  initialValues,
  title,
  saving = false,
}: CrudModalProps) {
  useEffect(() => {
    if (!open) return
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data: Record<string, string> = {}
    const fd = new FormData(e.currentTarget)
    for (const field of fields) {
      const val = fd.get(field.name)
      data[field.name] = typeof val === 'string' ? val : ''
    }
    await onSave(data)
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-navy-900/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="relative w-full max-w-lg bg-white doodle-border p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-navy-900">{title}</h3>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-navy-700 hover:bg-navy-50 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {fields.map((field) => (
                <div key={field.name}>
                  <label className="block text-sm font-semibold text-navy-700 mb-1">
                    {field.label}
                    {field.required && <span className="text-red-accent ml-0.5">*</span>}
                  </label>
                  {field.type === 'select' && field.options ? (
                    <select
                      name={field.name}
                      defaultValue={initialValues?.[field.name] ?? ''}
                      required={field.required}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 bg-cream text-navy-900 text-sm outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 transition-all"
                    >
                      <option value="">Seleccionar...</option>
                      {field.options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      defaultValue={initialValues?.[field.name] ?? ''}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded-xl border border-navy-200 bg-cream text-navy-900 text-sm outline-none focus:border-blue-accent focus:ring-2 focus:ring-blue-accent/20 transition-all"
                    />
                  )}
                </div>
              ))}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl border border-navy-200 text-navy-700 font-semibold text-sm hover:bg-navy-50 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold text-sm transition-colors disabled:opacity-60 cursor-pointer"
                >
                  {saving ? 'Guardando...' : 'Guardar'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
