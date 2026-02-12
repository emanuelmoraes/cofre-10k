import { act, fireEvent, render } from '@testing-library/react-native';
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

  it('reseta apenas apos confirmacao no modal', () => {
    useMarkedCells.setState({
      markedCells: [
        { index: 0, dateISO: '2026-02-01T10:00:00.000Z' },
        { index: 1, dateISO: '2026-02-01T10:01:00.000Z' },
      ],
    });

    const { getByText } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );

    act(() => {
      fireEvent.press(getByText('Resetar Cofre'));
    });

    expect(getByText('Confirmar reset')).toBeTruthy();

    act(() => {
      fireEvent.press(getByText('Cancelar'));
    });

    expect(useMarkedCells.getState().markedCells).toHaveLength(2);

    act(() => {
      fireEvent.press(getByText('Resetar Cofre'));
    });

    act(() => {
      fireEvent.press(getByText('Apagar tudo'));
    });

    expect(useMarkedCells.getState().markedCells).toHaveLength(0);
    expect(getByText('Nenhum deposito ainda.')).toBeTruthy();
    expect(getByText('Cofre resetado com sucesso.')).toBeTruthy();
  });

  it('mostra percentual da meta quando ainda incompleta', () => {
    useMarkedCells.setState({
      markedCells: [{ index: 0, dateISO: '2026-02-01T10:00:00.000Z' }],
    });

    const { getByText } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );

    const total = SHUFFLED_VALUES[0];
    const expectedProgress = ((total / 10000) * 100).toFixed(1);
    expect(getByText(`${expectedProgress}% da meta`)).toBeTruthy();
  });

  it('mostra status de meta atingida ao completar 10 mil', () => {
    const allMarkedCells = SHUFFLED_VALUES.map((_, index) => ({
      index,
      dateISO: '2026-02-01T10:00:00.000Z',
    }));

    useMarkedCells.setState({ markedCells: allMarkedCells });

    const { getByText, getAllByText } = render(
      <ThemeProvider>
        <Home />
      </ThemeProvider>
    );

    expect(getByText('Meta atingida!')).toBeTruthy();
    expect(getByText('Objetivo concluido com sucesso.')).toBeTruthy();
    expect(getAllByText('R$ 10.000')[0]).toBeTruthy();
  });
});
