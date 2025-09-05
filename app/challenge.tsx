// app/challenge.tsx

import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, Text, View } from 'react-native';
import { sharedStyles } from './shared/styles';
import { useDeposits } from './store/useDeposits';

// Array de valores "bagunçados" que soma exatamente 10.000
// Distribuição: 150x R$5 = 750, 195x R$10 = 1950, 180x R$20 = 3600, 33x R$100 = 3300, 2x R$200 = 400
// Total: 750 + 1950 + 3600 + 3300 + 400 = 10.000
const SHUFFLED_VALUES = [
  20,5,10,10,10,100,5,5,20,10,10,20,20,20,5,20,10,100,20,20,20,20,100,10,20,20,20,20,5,10,5,10,10,5,100,20,5,5,200,20,20,10,100,10,5,10,100,10,20,20,20,5,5,20,20,20,10,10,20,20,10,5,20,5,10,100,5,20,10,5,5,20,20,5,10,10,20,5,10,100,20,10,20,20,20,5,10,20,5,20,20,20,10,20,20,5,5,10,20,5,10,5,20,20,10,10,20,20,5,10,5,10,10,20,10,10,10,5,5,10,10,20,20,20,10,5,5,20,20,10,10,5,20,10,5,5,5,10,5,5,20,10,10,10,20,5,20,5,5,5,10,100,10,10,20,10,20,10,10,10,10,10,20,5,20,5,100,100,5,20,10,10,10,10,10,5,5,20,5,20,10,10,20,20,20,10,10,10,20,5,5,5,10,20,20,20,20,10,5,20,5,100,20,5,20,100,10,20,20,10,20,10,10,10,10,20,5,10,20,5,10,10,5,20,5,5,10,5,20,20,5,10,20,5,5,10,10,10,100,20,5,5,10,5,5,10,10,10,10,20,10,10,5,10,5,20,5,10,5,20,10,10,200,10,100,10,20,5,10,10,10,5,10,20,10,5,5,20,5,5,100,20,10,10,20,10,5,10,5,5,100,100,20,10,20,20,5,10,5,5,20,10,10,20,20,20,20,10,10,5,5,10,20,20,20,10,5,10,20,20,5,20,10,20,10,10,10,20,10,10,20,5,20,20,100,10,10,5,20,10,20,20,10,5,10,10,10,20,20,20,5,20,20,10,20,10,5,10,10,5,10,10,10,5,20,10,10,100,10,5,5,5,20,5,10,5,20,5,10,5,100,10,10,5,5,20,20,5,5,5,10,5,20,10,10,10,20,5,5,10,20,10,10,20,20,20,5,10,10,10,20,20,10,10,10,20,10,5,20,10,5,20,5,10,100,5,10,5,5,100,5,100,20,20,5,20,10,20,5,20,10,5,5,20,20,20,10,5,20,10,20,10,5,10,5,10,20,20,5,10,10,100,10,10,100,10,10,20,5,20,5,20,20,5,20,5,10,20,20,10,10,20,5,20,100,20,5,20,5,5,5,20,10,20,5,5,10,5,5,10,20,10,100,5,10,20,5,10,10,10,20,10,20,100,10,20,10,20,10,100,20,5,10,5,100,5,5,10,5,20,10,20,5,20,10,10,5,10,20,20,20,20,5,20,10,10,100,20,20,10,10,5,20,5,20,100,20,5,10,10
];

export default function Challenge() {
  const deposits = useDeposits(s => s.deposits);
  const add = useDeposits(s => s.add);
  const remove = useDeposits(s => s.remove);
  const total = deposits.reduce((sum, d) => sum + d.value, 0);
  const GOAL = 10000;
  
  // Criar dados das células com valores embaralhados
  const cellData = SHUFFLED_VALUES.map((value, index) => ({
    value,
    index
  }));

  // Conta quantas vezes cada valor foi depositado e armazena os ids
  const depositCount: Record<number, number> = {};
  const depositIds: Record<number, string[]> = {};
  
  // Mapa para rastrear qual depósito corresponde a qual índice de célula
  const cellToDepositMap: Record<number, string> = {};
  
  deposits.forEach(d => {
    depositCount[d.value] = (depositCount[d.value] || 0) + 1;
    if (!depositIds[d.value]) depositIds[d.value] = [];
    depositIds[d.value].push(d.id);
    
    // Associa o depósito ao índice da célula (se disponível nos metadados)
    if (d.cellIndex !== undefined) {
      cellToDepositMap[d.cellIndex] = d.id;
    }
  });

  // Função para verificar se uma célula específica está pressionada
  const isCellPressed = (index: number) => {
    return cellToDepositMap[index] !== undefined;
  };

  const isCompleted = total === GOAL;

  return (
    <View style={sharedStyles.container}>
      <View style={sharedStyles.header}>
        <Text style={sharedStyles.title}>Desafio do Cofre</Text>
        <Text style={sharedStyles.subtitle}>
          Toque nos valores para depositar no seu cofre
        </Text>
      </View>

      <FlatList
        data={cellData}
        numColumns={6}
        keyExtractor={(item) => item.index.toString()}
        contentContainerStyle={sharedStyles.challengeGrid}
        renderItem={({ item }) => {
          const pressed = isCellPressed(item.index);
          return (
            <Pressable
              style={[
                sharedStyles.challengeButton,
                pressed && sharedStyles.challengeButtonPressed
              ]}
              onPress={() => {
                if (pressed) {
                  // Remove o depósito específico desta célula
                  const depositId = cellToDepositMap[item.index];
                  if (depositId) {
                    remove(depositId);
                  }
                } else {
                  // Adiciona um novo depósito associado a esta célula específica
                  add(item.value, undefined, item.index);
                }
              }}
            >
              <Text style={[
                sharedStyles.challengeButtonText,
                pressed && sharedStyles.challengeButtonTextPressed
              ]}>
                {item.value}
              </Text>
              {pressed && <Feather name="check" size={16} color="#fff" />}
            </Pressable>
          );
        }}
      />
    </View>
  );
}
