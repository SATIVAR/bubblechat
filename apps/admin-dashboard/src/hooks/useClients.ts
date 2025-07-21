"use client";

import { useState, useEffect } from 'react';
import { collection, onSnapshot, DocumentData, QuerySnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Import from the newly created file
import { Client } from '../types'; // Assuming you have a Client type

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      // Reference to the 'clients' collection in Firestore
      const clientsCollectionRef = collection(db, 'clients');

      // onSnapshot listens for real-time updates
      const unsubscribe = onSnapshot(
        clientsCollectionRef,
        (snapshot: QuerySnapshot<DocumentData>) => {
          const clientsData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Client[];
          setClients(clientsData);
          setIsLoading(false);
        },
        (err) => {
          console.error("Firebase onSnapshot error:", err);
          setError(err);
          setIsLoading(false);
        }
      );

      // Cleanup subscription on component unmount
      return () => unsubscribe();
    } catch (err) {
      console.error("Error setting up Firebase listener:", err);
      setError(err as Error);
      setIsLoading(false);
    }
  }, []);

  return { clients, isLoading, error };
}
