import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Challenge from '../../app/challenge';
import { useMarkedCells } from '../../app/store/useMarkedCells';
import { GOAL, SHUFFLED_VALUES } from '../../constants/challenge';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Challenge screen', () => {
  beforeEach(() => {
    useMarkedCells.setState({ markedCells: [] });
  });

  it('marca e desmarca uma celula ao tocar', () => {
    const { getAllByText } = render(
      <ThemeProvider>
        <Challenge />
      </ThemeProvider>
    );

    const firstValue = SHUFFLED_VALUES[0].toString();
    const firstCell = getAllByText(firstValue)[0];

    act(() => {
      fireEvent.press(firstCell);
    });

    expect(useMarkedCells.getState().markedCells[0].index).toBe(0);

    act(() => {
      fireEvent.press(firstCell);
    });

    expect(useMarkedCells.getState().markedCells).toHaveLength(0);
  });

  it('marca e desmarca varias celulas em sequencia', () => {
    const { getByTestId } = render(
      <ThemeProvider>
        <Challenge />
      </ThemeProvider>
    );

    const targetCells = Array.from({ length: 20 }, (_, index) =>
      getByTestId(`cell-${index}`)
    );

    act(() => {
      targetCells.forEach((cell) => {
        fireEvent.press(cell);
      });
    });

    expect(useMarkedCells.getState().markedCells).toHaveLength(20);

    act(() => {
      targetCells.forEach((cell) => {
        fireEvent.press(cell);
      });
    });

    expect(useMarkedCells.getState().markedCells).toHaveLength(0);
  });

  it('exibe progresso completo ao marcar todas as celulas', () => {
    const allMarkedCells = SHUFFLED_VALUES.map((_, index) => ({
      index,
      dateISO: '2026-02-01T10:00:00.000Z',
    }));

    useMarkedCells.setState({ markedCells: allMarkedCells });

    const { getByText } = render(
      <ThemeProvider>
        <Challenge />
      </ThemeProvider>
    );

    expect(getByText('Parabens! Meta alcancada!')).toBeTruthy();
    expect(
      getByText(`R$ ${GOAL.toLocaleString('pt-BR')} / R$ ${GOAL.toLocaleString('pt-BR')}`)
    ).toBeTruthy();
  });
});
