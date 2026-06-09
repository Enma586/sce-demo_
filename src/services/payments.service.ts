import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Payment } from '../types/payment';

const paymentsRef = collection(db, 'payments');

export const paymentService = {
  getAll: async (): Promise<Payment[]> => {
    const q = query(paymentsRef, orderBy('date', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payment[];
  },

  create: async (data: Omit<Payment, 'id'>): Promise<string> => {
    const docRef = await addDoc(paymentsRef, data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Payment>): Promise<void> => {
    const docRef = doc(db, 'payments', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'payments', id);
    await deleteDoc(docRef);
  }
};