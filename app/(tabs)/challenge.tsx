// app/(tabs)/challenge.tsx

import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { useDeposits } from '../store/useDeposits';
const CELLS = [5,10,20,100,200]; // embaralhe/repita até 200

export default function Challenge() {
  const deposits = useDeposits(s => s.deposits);
  const add = useDeposits(s => s.add);
  const remove = useDeposits(s => s.remove);
  const total = deposits.reduce((sum, d) => sum + d.value, 0);
  const GOAL = 10000;
  // Conta quantas vezes cada valor foi depositado e armazena os ids
  const depositCount: Record<number, number> = {};
  const depositIds: Record<number, string[]> = {};
  deposits.forEach(d => {
    depositCount[d.value] = (depositCount[d.value] || 0) + 1;
    if (!depositIds[d.value]) depositIds[d.value] = [];
    depositIds[d.value].push(d.id);
  });

  // Para cada célula, verifica se já foi depositada aquela quantidade de vezes
  const cellData = Array.from({length:200}, (_,i)=>({
    value: CELLS[i%CELLS.length],
    index: i
  }));

  // Para marcar, precisamos saber se o valor já foi usado N vezes
  const usedCells: Record<number, number> = {};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Tabuleiro Cofre dos 10 mil</Text>
        <View style={styles.progressCard}>
          <Text style={styles.label}>Total guardado</Text>
          <Text style={styles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
          <Text style={styles.label}>Falta para a meta</Text>
          <Text style={styles.value}>R$ {(GOAL-total).toLocaleString('pt-BR')}</Text>
        </View>
      </View>
      <FlatList
        data={cellData}
        numColumns={5}
        keyExtractor={(_,i)=>String(i)}
        contentContainerStyle={styles.grid}
        style={{ width: '100%' }}
        renderItem={({item, index}) => {
          usedCells[item.value] = (usedCells[item.value] || 0);
          const isMarked = usedCells[item.value] < (depositCount[item.value] || 0);
          const depositId = isMarked && depositIds[item.value] ? depositIds[item.value][usedCells[item.value]] : undefined;
          usedCells[item.value]++;
          return (
            <Pressable
              onPress={() => {
                if (isMarked && depositId) {
                  remove(depositId);
                } else if (!isMarked) {
                  add(item.value);
                }
              }}
              style={[styles.cell, isMarked && styles.cellMarked]}
            >
              <Text style={[styles.cellText, isMarked && styles.cellTextMarked]}>{item.value}</Text>
                {isMarked && (
                  <Feather name="check" size={18} color="#1a2236" style={styles.checkIcon} />
                )}
            </Pressable>
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7fa',
    padding: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1a2236',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 1,
    alignItems: 'center',
    width: '90%',
  },
  label: {
    fontSize: 14,
    color: '#6c7a93',
    marginTop: 4,
    marginBottom: 2,
  },
  value: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a2236',
    marginBottom: 4,
  },
  grid: {
    paddingBottom: 24,
    alignItems: 'center',
  },
  cell: {
    margin: 6,
    paddingVertical: 18,
    borderWidth: 1,
    borderColor: '#ececf0',
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: '#fff',
    justifyContent: 'center',
    width: 60,
    elevation: 1,
    flexDirection: 'row',
  },
  cellMarked: {
    backgroundColor: '#e6eaf3',
    borderColor: '#b5b9c9',
    opacity: 0.7,
  },
  cellText: {
    fontSize: 16,
    color: '#1a2236',
    fontWeight: '500',
  },
  cellTextMarked: {
    color: '#6c7a93',
    fontWeight: '700',
  },
  checkIcon: {
    marginLeft: 6,
    fontSize: 16,
    color: '#1a2236',
    fontWeight: 'bold',
  },
});

