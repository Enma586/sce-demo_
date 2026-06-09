import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { clientService } from '../services/clients.service.ts'
import { paymentService } from '../services/payments.service.ts'
import DataTable from '../components/DataTable.tsx'
import CrudModal from '../components/CrudModal.tsx'
import ConfirmModal from '../components/ConfirmModal.tsx'
import type { Column } from '../components/DataTable.tsx'
import type { FieldConfig } from '../components/CrudModal.tsx'
import type { Client } from '../types/client.ts'
import type { Payment } from '../types/payment.ts'

const statusLabel: Record<string, string> = {
  pending: 'Pendiente',
  paid: 'Pagado',
  completed: 'Completado',
  refunded: 'Reembolsado',
}

const statusStyle: Record<string, string> = {
  pending: 'bg-amber-100 text-amber-700',
  paid: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-blue-100 text-blue-700',
  refunded: 'bg-navy-100 text-navy-500',
}

export default function Payments() {
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Payment | null>(null)
  const [saving, setSaving] = useState(false)
  const [clients, setClients] = useState<Client[]>([])

  const [deleteTarget, setDeleteTarget] = useState<Payment | null>(null)
  const [deleting, setDeleting] = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    paymentService
      .getAll()
      .then(setPayments)
      .catch(() => setPayments([]))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

  const loadClients = useCallback(async () => {
    try {
      const data = await clientService.getAll()
      setClients(data)
    } catch {
      setClients([])
    }
  }, [])

  const buildFields = (): FieldConfig[] => [
    {
      name: 'clientName',
      label: 'Cliente',
      type: 'select',
      required: true,
      options: clients.map((c) => ({ value: c.name, label: c.name })),
    },
    { name: 'amount', label: 'Monto', type: 'number', required: true, placeholder: 'Ej: 1500' },
    {
      name: 'method',
      label: 'Método de Pago',
      type: 'select',
      required: true,
      options: [
        { value: 'Tarjeta', label: 'Tarjeta' },
        { value: 'Transferencia', label: 'Transferencia' },
        { value: 'Efectivo', label: 'Efectivo' },
      ],
    },
    { name: 'date', label: 'Fecha', type: 'date', required: true },
    {
      name: 'status',
      label: 'Estado',
      type: 'select',
      required: true,
      options: [
        { value: 'pending', label: 'Pendiente' },
        { value: 'paid', label: 'Pagado' },
        { value: 'completed', label: 'Completado' },
        { value: 'refunded', label: 'Reembolsado' },
      ],
    },
  ]

  const openCreate = async () => {
    await loadClients()
    setEditing(null)
    setModalOpen(true)
  }

  const openEdit = async (payment: Payment) => {
    await loadClients()
    setEditing(payment)
    setModalOpen(true)
  }

  const handleSave = async (data: Record<string, string>) => {
    setSaving(true)
    try {
      const payload = { ...data, amount: parseFloat(data.amount) || 0 }
      if (editing?.id) {
        await paymentService.update(editing.id, payload)
      } else {
        await paymentService.create(payload as Omit<Payment, 'id'>)
      }
      setModalOpen(false)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteRequest = (payment: Payment) => {
    setDeleteTarget(payment)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget?.id) return
    setDeleting(true)
    try {
      await paymentService.delete(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch {
      /* error handled silently */
    } finally {
      setDeleting(false)
    }
  }

  const columns: Column<Payment>[] = [
    {
      key: 'clientName',
      label: 'Cliente',
      className: 'flex-1',
      render: (p) => (
        <p className="text-base font-bold text-navy-900 leading-tight">{p.clientName}</p>
      ),
    },
    {
      key: 'amount',
      label: 'Monto',
      className: 'w-28',
      render: (p) => (
        <span className="text-sm font-semibold text-navy-900">
          ${p.amount.toLocaleString()}
        </span>
      ),
    },
    {
      key: 'method',
      label: 'Método',
      className: 'w-32 text-sm text-navy-600',
    },
    {
      key: 'date',
      label: 'Fecha',
      className: 'w-32 text-sm text-navy-600',
      render: (p) => {
        const d = new Date(p.date)
        return <span>{d.toLocaleDateString('es-MX')}</span>
      },
    },
    {
      key: 'status',
      label: 'Estado',
      className: 'w-28',
      render: (p) => (
        <span
          className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${statusStyle[p.status] ?? 'bg-navy-100 text-navy-500'}`}
        >
          {statusLabel[p.status] ?? p.status}
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
          <h1 className="text-3xl font-bold text-navy-900 doodle-underline mb-1">Pagos</h1>
          <p className="text-sm text-navy-500 mt-2">
            {payments.length} pago{payments.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={openCreate}
          className="px-5 py-2.5 rounded-xl bg-blue-accent hover:bg-blue-hover text-white font-semibold text-sm transition-colors cursor-pointer"
        >
          + Nuevo Pago
        </motion.button>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(p) => p.id ?? ''}
        loading={loading}
        emptyMessage="No hay pagos registrados"
        emptyDescription="Los pagos aparecerán aquí cuando se procesen transacciones. Usa el botón superior para registrar uno."
        onEdit={openEdit}
        onDelete={handleDeleteRequest}
      />

      <CrudModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
        fields={buildFields()}
        initialValues={
          editing
            ? {
                clientName: editing.clientName,
                amount: String(editing.amount),
                method: editing.method,
                date: editing.date,
                status: editing.status,
              }
            : undefined
        }
        title={editing ? 'Editar Pago' : 'Nuevo Pago'}
        saving={saving}
      />

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title="Eliminar pago"
        message={`¿Estás seguro de eliminar el pago de "${deleteTarget?.clientName}"? Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar"
        loading={deleting}
      />
    </motion.div>
  )
}
