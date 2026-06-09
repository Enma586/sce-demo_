import { motion } from 'framer-motion'

export interface Column<T> {
  key: keyof T | string
  label: string
  render?: (item: T) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  keyExtractor: (item: T) => string
  loading?: boolean
  emptyMessage?: string
  emptyDescription?: string
  onEdit?: (item: T) => void
  onDelete?: (item: T) => void
}

function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-5 doodle-border bg-cream/50 animate-pulse">
      <div className="h-5 w-48 bg-navy-200 rounded-md" />
      <div className="h-4 w-28 bg-navy-200 rounded-md ml-auto" />
      <div className="h-6 w-20 bg-navy-200 rounded-full" />
    </div>
  )
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  loading = false,
  emptyMessage = 'No hay registros',
  emptyDescription = 'Aún no hay datos disponibles en esta sección.',
  onEdit,
  onDelete,
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-20 px-6 text-center"
      >
        <div className="w-16 h-16 rounded-2xl bg-navy-100 flex items-center justify-center mb-4">
          <span className="text-2xl text-navy-400">◇</span>
        </div>
        <p className="text-lg font-semibold text-navy-900">{emptyMessage}</p>
        <p className="text-sm text-navy-500 mt-1 max-w-xs">{emptyDescription}</p>
      </motion.div>
    )
  }

  const showActions = Boolean(onEdit || onDelete)

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-4 px-5 py-2">
        {columns.map((col) => (
          <div key={String(col.key)} className={col.className ?? ''}>
            <span className="text-[10px] font-semibold tracking-widest uppercase text-navy-400">
              {col.label}
            </span>
          </div>
        ))}
        {showActions && (
          <div className="ml-auto w-16">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-navy-400">
              Acciones
            </span>
          </div>
        )}
      </div>
      {data.map((item, index) => (
        <motion.div
          key={keyExtractor(item)}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.035, type: 'spring', stiffness: 300, damping: 25 }}
          whileHover={{ y: -2, scale: 1.003 }}
          className="flex items-center gap-4 px-5 py-4 bg-white doodle-border hover:border-navy-400 transition-all duration-200"
        >
          {columns.map((col) => (
            <div key={String(col.key)} className={col.className ?? ''}>
              {col.render
                ? col.render(item)
                : String(item[col.key as keyof T] ?? '')}
            </div>
          ))}

          {showActions && (
            <div className="flex items-center gap-1 ml-auto">
              {onEdit && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onEdit(item) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-blue-accent hover:bg-blue-50 transition-all cursor-pointer"
                  title="Editar"
                >
                  ✎
                </button>
              )}
              {onDelete && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onDelete(item) }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-navy-400 hover:text-red-accent hover:bg-red-50 transition-all cursor-pointer"
                  title="Eliminar"
                >
                  ✕
                </button>
              )}
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
