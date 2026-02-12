import { render } from '@testing-library/react-native';
import React from 'react';
import Home from '../../app/index';
import { useMarkedCells } from '../../app/store/useMarkedCells';
import { SHUFFLED_VALUES } from '../../constants/challenge';
import { ThemeProvider } from '../../contexts/ThemeContext';

describe('Home screen', () => {
  beforeEach(() => {
    useMarkedCells.setState({ markedCells: [] });
  });

  it('exibe total e lista de depositos com base nas celulas marcadas', () => {
    useMarkedCells.setState({
      markedCells: [
        { index: 0, dateISO: '2026-02-01T10:00:00.000Z' },
        { index: 1, dateISO: '2026-02-01T10:01:00.000Z' },
      ],
    });

    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );

    const expectedTotal = SHUFFLED_VALUES[0] + SHUFFLED_VALUES[1];
    expect(
      getAllByText(`R$ ${expectedTotal.toLocaleString('pt-BR')}`)[0]
    ).toBeTruthy();
    expect(getByText('Depositos Realizados')).toBeTruthy();
  });
});
