import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import Challenge from '../../app/challenge';
import { useMarkedCells } from '../../app/store/useMarkedCells';
import { SHUFFLED_VALUES } from '../../constants/challenge';
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
});
