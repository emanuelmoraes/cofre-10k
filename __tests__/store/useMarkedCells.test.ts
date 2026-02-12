import AsyncStorage from '@react-native-async-storage/async-storage';
import { act } from '@testing-library/react-native';
import { useMarkedCells } from '../../app/store/useMarkedCells';
import { SHUFFLED_VALUES } from '../../constants/challenge';

describe('useMarkedCells', () => {
  beforeEach(async () => {
    useMarkedCells.setState({ markedCells: [] });
    await AsyncStorage.clear();
  });

  it('adiciona e remove uma celula ao alternar', () => {
    act(() => {
      useMarkedCells.getState().toggle(0);
    });
    expect(useMarkedCells.getState().markedCells).toHaveLength(1);
    expect(useMarkedCells.getState().markedCells[0].index).toBe(0);

    act(() => {
      useMarkedCells.getState().toggle(0);
    });
    expect(useMarkedCells.getState().markedCells).toHaveLength(0);
  });

  it('filtra indices invalidos na hidratacao', async () => {
    const invalidIndex = SHUFFLED_VALUES.length + 10;
    const payload = [
      { index: 0, dateISO: '2026-02-01T10:00:00.000Z' },
      { index: invalidIndex, dateISO: '2026-02-01T10:01:00.000Z' },
      { index: -1, dateISO: '2026-02-01T10:02:00.000Z' },
    ];

    jest.spyOn(AsyncStorage, 'getItem').mockResolvedValueOnce(
      JSON.stringify(payload)
    );

    await act(async () => {
      await useMarkedCells.getState().hydrate();
    });

    const state = useMarkedCells.getState().markedCells;
    expect(state).toHaveLength(1);
    expect(state[0].index).toBe(0);
  });
});
