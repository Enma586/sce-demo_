import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';

const clientsRef = collection(db, 'clients');
const bookingsRef = collection(db, 'bookings');
const paymentsRef = collection(db, 'payments');

const seedClients = [
  { name: 'Ana López', email: 'ana@ejemplo.com', phone: '79012121', status: 'active' },
  { name: 'Carlos Mendoza', email: 'carlos@ejemplo.com', phone: '67908777', status: 'active' },
  { name: 'Sofía Ramírez', email: 'sofia@ejemplo.com', phone: '78123411', status: 'inactive' },
];

const seedBookings = [
  { clientName: 'Ana López', date: '2026-06-15', service: 'Consultoría UX', status: 'confirmed' },
  { clientName: 'Carlos Mendoza', date: '2026-06-20', service: 'Desarrollo Web', status: 'pending' },
  { clientName: 'Sofía Ramírez', date: '2026-06-10', service: 'Branding', status: 'completed' },
];

const seedPayments = [
  { clientName: 'Ana López', amount: 2500, date: '2026-06-15', method: 'Transferencia', status: 'paid' },
  { clientName: 'Carlos Mendoza', amount: 1800, date: '2026-06-20', method: 'Tarjeta', status: 'pending' },
  { clientName: 'Sofía Ramírez', amount: 3200, date: '2026-06-10', method: 'Efectivo', status: 'paid' },
];

async function clearCollection(ref: ReturnType<typeof collection>) {
  const snapshot = await getDocs(ref);
  const deletions = snapshot.docs.map((d) => deleteDoc(doc(ref, d.id)));
  await Promise.all(deletions);
}

export async function resetDemoDatabase(): Promise<void> {
  await Promise.all([
    clearCollection(clientsRef),
    clearCollection(bookingsRef),
    clearCollection(paymentsRef),
  ]);

  const [c1, c2, c3] = await Promise.all(
    seedClients.map((c) => addDoc(clientsRef, c))
  );

  await Promise.all(
    seedBookings.map((b) => addDoc(bookingsRef, b))
  );

  await Promise.all(
    seedPayments.map((p) => addDoc(paymentsRef, p))
  );

  console.info('Demo database reset successfully. Clients created:', [c1.id, c2.id, c3.id]);
}
