import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebase';
import type { Client } from '../types/client';

const clientsRef = collection(db, 'clients');

export const clientService = {
  getAll: async (): Promise<Client[]> => {
    const snapshot = await getDocs(clientsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Client[];
  },

  create: async (data: Omit<Client, 'id'>): Promise<string> => {
    const docRef = await addDoc(clientsRef, data);
    return docRef.id;
  },

  update: async (id: string, data: Partial<Client>): Promise<void> => {
    const docRef = doc(db, 'clients', id);
    await updateDoc(docRef, data);
  },

  delete: async (id: string): Promise<void> => {
    const docRef = doc(db, 'clients', id);
    await deleteDoc(docRef);
  }
};