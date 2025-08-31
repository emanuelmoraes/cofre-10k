// app/store/useDeposits.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import uuid from 'react-native-uuid';
import { create } from 'zustand';



type Deposit = { id: string; value: number; dateISO: string; note?: string; };
type State = {
  deposits: Deposit[];
  add: (value:number, note?:string)=>void;
  remove:(id:string)=>void;
  total:number;
  hydrate: () => void;
};

export const useDeposits = create<State>((set, get) => ({
  deposits: [],
  add: (value, note) => {
  const newDeposits = [...get().deposits, { id: uuid.v4() as string, value, dateISO: new Date().toISOString(), note }];
    set({ deposits: newDeposits });
    AsyncStorage.setItem('deposits', JSON.stringify(newDeposits));
  },
  remove: (id) => {
    const newDeposits = get().deposits.filter(d => d.id !== id);
    set({ deposits: newDeposits });
    AsyncStorage.setItem('deposits', JSON.stringify(newDeposits));
  },
  get total() { return get().deposits.reduce((acc, d) => acc + d.value, 0); },
  hydrate: async () => {
    const saved = await AsyncStorage.getItem('deposits');
    if (saved) set({ deposits: JSON.parse(saved) });
  }
}));

// Hidratar depósitos ao iniciar o app
export function useDepositsHydration() {
  const hydrate = useDeposits(s => s.hydrate);
  useEffect(() => { hydrate(); }, []);
}
