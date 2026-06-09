import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type{ Booking } from '../types/booking';

const bookingsRef = collection(db, 'bookings');

export const bookingService = {
  getAll: async (): Promise<Booking[]> => {
    const q = query(bookingsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Booking[];
  },

  create: async (data: Omit<Booking, 'id'>): Promise<string> => {
    const docRef = await addDoc(bookingsRef, data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Booking>): Promise<void> => {
    const docRef = doc(db, 'bookings', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'bookings', id);
    await deleteDoc(docRef);
  }
};