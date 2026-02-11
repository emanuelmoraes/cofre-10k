// app/store/useMarkedCells.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from 'react';
import { create } from 'zustand';
import { calculateTotal, SHUFFLED_VALUES } from '../../constants/challenge';

const STORAGE_KEY = 'markedCells';

type MarkedCell = {
  index: number;
  dateISO: string;
};

type State = {
  markedCells: MarkedCell[];
  toggle: (index: number) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
};

export const useMarkedCells = create<State>((set, get) => ({
  markedCells: [],

  toggle: (index: number) => {
    const current = get().markedCells;
    const existingIndex = current.findIndex((c) => c.index === index);

    let newCells: MarkedCell[];
    if (existingIndex >= 0) {
      // Remove se ja existe
      newCells = current.filter((c) => c.index !== index);
    } else {
      // Adiciona se nao existe
      newCells = [...current, { index, dateISO: new Date().toISOString() }];
    }

    set({ markedCells: newCells });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newCells));
  },

  reset: () => {
    set({ markedCells: [] });
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
  },

  hydrate: async () => {
    const saved = await AsyncStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed: MarkedCell[] = JSON.parse(saved);
      // Filtra indices invalidos (fora do range)
      const valid = parsed.filter(
        (c) => c.index >= 0 && c.index < SHUFFLED_VALUES.length
      );
      set({ markedCells: valid });
    }
  },
}));

// Seletores derivados para uso nos componentes
export const useTotal = () => {
  const markedCells = useMarkedCells((s) => s.markedCells);
  return calculateTotal(markedCells.map((c) => c.index));
};

export const useIsMarked = (index: number) => {
  const markedCells = useMarkedCells((s) => s.markedCells);
  return markedCells.some((c) => c.index === index);
};

export const useMarkedIndexes = () => {
  const markedCells = useMarkedCells((s) => s.markedCells);
  return new Set(markedCells.map((c) => c.index));
};

// Hook de hidratacao para usar no _layout.tsx
export function useMarkedCellsHydration() {
  const hydrate = useMarkedCells((s) => s.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
}
