import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { clientService } from '../services/clients.service.ts'
import DataTable from '../components/DataTable.tsx'
import CrudModal from '../components/CrudModal.tsx'
import ConfirmModal from '../components/ConfirmModal.tsx'
import type { Column } from '../components/DataTable.tsx'
import type { FieldConfig } from '../components/CrudModal.tsx'
import type { Client } from '../types/client.ts'

const statusLabel: Record<string, string> = {
  active: 'Activo',
  inactive: 'Inactivo',
}

const statusStyle: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  inactive: 'bg-navy-100 text-navy-500',
}

const formFields: FieldConfig[] = [
  { name: 'name', label: 'Nombre', type: 'text', required: true, placeholder: 'Ej: María García' },
  { name: 'email', label: 'Correo', type: 'email', required: true, placeholder: 'maria@ejemplo.com' },
  { name: 'phone', label: 'Teléfono', type: 'text', required: true, placeholder: '+52 55 1234 5678' },
  {
    name: 'status',
    label: 'Estado',
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Activo' },
      { value: 'inactive', label: 'Inactivo' },
    ],
  },
]

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Client | null>(null)
  const [saving, setSaving] = useState(false)

  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    clientService
      .getAll()
      .then(setClients)
      .catch(() => setClients([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = (client: Client) => {
    setEditing(client)
    setModalOpen(true)
  }

  const handleSave = async (data: Record<string, string>) => {
    setSaving(true)
    try {
      if (editing?.id) {
        await clientService.update(editing.id, data)
      } else {
        await clientService.create(data as Omit<Client, 'id'>)
      }
      setModalOpen(false)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRequest = (client: Client) => {
    setDeleteTarget(client)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return
    setDeleting(true)
    try {
      await clientService.delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Client>[] = [
    {
      key: 'name',
      label: 'Nombre',
      className: 'flex-1',
      render: (c) => (
        <div>
          <p className="text-base font-bold text-navy-900 leading-tight">{c.name}</p>
          <p className="text-xs text-navy-500 mt-0.5">{c.email}</p>
        </div>
      ),
    },
    {
      key: 'phone',
      label: 'Teléfono',
      className: 'w-40 text-sm text-navy-600',
    },
    {
      key: 'status',
      label: 'Estado',
      className: 'w-28',
      render: (c) => (
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[c.status] ?? 'bg-navy-100 text-navy-500'}`}
        >
          {statusLabel[c.status] ?? c.status}
        </span>
      ),
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-navy-900 doodle-underline mb-1">Clientes</h1>
          <p className="text-sm text-navy-500 mt-2">
            {clients.length} cliente{clients.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          + Nuevo Cliente
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={clients}
        keyExtractor={(c) => c.id ?? ''}
        loading={loading}
        emptyMessage="Aún no hay clientes"
        emptyDescription="Los clientes registrados aparecerán aquí. Usa el botón superior para agregar el primero."
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
      />

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={formFields}
        initialValues={
          editing
            ? { name: editing.name, email: editing.email, phone: editing.phone, status: editing.status }
            : undefined
        }
        title={editing ? 'Editar Cliente' : 'Nuevo Cliente'}
        saving={saving}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar cliente"
        message={`¿Estás seguro de eliminar a "${deleteTarget?.name}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </motion.div>
  )
}
