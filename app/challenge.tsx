// app/challenge.tsx

import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { useAppTheme } from '../contexts/ThemeContext';
import { createStyles } from './shared/materialStyles';
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
  const { isDark, toggleTheme, theme } = useAppTheme();
  const styles = createStyles(theme);
  
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
  const progress = (total / GOAL) * 100;

  return (
    <View style={styles.containerChallenge}>
      {/* Theme Toggle Button */}
      <IconButton
        icon={isDark ? 'white-balance-sunny' : 'moon-waning-crescent'}
        size={24}
        onPress={toggleTheme}
        style={{
          alignSelf: 'flex-end',
          backgroundColor: theme.colors.surfaceVariant,
          marginBottom: 16,
        }}
        iconColor={theme.colors.onSurfaceVariant}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.titleChallenge}>Desafio do Cofre</Text>
          <Text style={[styles.label, { textAlign: 'center', marginBottom: 16 }]}>
            Toque nos valores para depositar no seu cofre
          </Text>
        </View>

        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={styles.labelChallenge}>Progresso</Text>
            <Text style={styles.valueChallenge}>
              R$ {total.toLocaleString('pt-BR')} / R$ {GOAL.toLocaleString('pt-BR')}
            </Text>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progress, 100)}%` }
                ]} 
              />
            </View>
            
            {isCompleted && (
              <Text style={styles.successText}>
                Parabéns! Meta alcançada! 🎉
              </Text>
            )}
          </Card.Content>
        </Card>

        {/* Challenge Grid */}
        <Card style={[styles.surface, { padding: 12 }]}>
          <Card.Content>
            <FlatList
              data={cellData}
              numColumns={6}
              keyExtractor={(item) => item.index.toString()}
              contentContainerStyle={styles.grid}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const pressed = isCellPressed(item.index);
                return (
                  <Pressable
                    style={[
                      styles.cell,
                      pressed && styles.cellMarked
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
                      styles.cellText,
                      pressed && styles.cellTextMarked
                    ]}>
                      R$ {item.value}
                    </Text>
                    {pressed && (
                      <Feather 
                        name="check" 
                        size={12} 
                        color={theme.colors.primary} 
                        style={styles.checkIcon}
                      />
                    )}
                  </Pressable>
                );
              }}
            />
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}
