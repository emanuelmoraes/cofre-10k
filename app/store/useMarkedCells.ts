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

const isValidMarkedCell = (value: unknown): value is MarkedCell => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const maybeCell = value as Partial<MarkedCell>;
  return (
    typeof maybeCell.index === 'number' &&
    Number.isInteger(maybeCell.index) &&
    maybeCell.index >= 0 &&
    maybeCell.index < SHUFFLED_VALUES.length &&
    typeof maybeCell.dateISO === 'string'
  );
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
    try {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (!saved) {
        set({ markedCells: [] });
        return;
      }

      const parsed: unknown = JSON.parse(saved);
      if (!Array.isArray(parsed)) {
        set({ markedCells: [] });
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        return;
      }

      const valid = parsed.filter(isValidMarkedCell);
      set({ markedCells: valid });

      if (valid.length !== parsed.length) {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(valid));
      }
    } catch {
      set({ markedCells: [] });
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([]));
    }
  },
}));

// Seletores derivados para uso nos componentes
export const useTotal = () => {
  return useMarkedCells((s) =>
    calculateTotal(s.markedCells.map((cell) => cell.index))
  );
};

export const useIsMarked = (index: number) => {
  return useMarkedCells((s) =>
    s.markedCells.some((cell) => cell.index === index)
  );
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
