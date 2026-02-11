// app/challenge.tsx

import { Feather } from '@expo/vector-icons';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GOAL, SHUFFLED_VALUES } from '../constants/challenge';
import { useAppTheme } from '../contexts/ThemeContext';
import { createStyles } from './shared/materialStyles';
import { useMarkedCells, useMarkedIndexes, useTotal } from './store/useMarkedCells';

export default function Challenge() {
  const toggle = useMarkedCells((s) => s.toggle);
  const markedIndexes = useMarkedIndexes();
  const total = useTotal();
  
  const { isDark, toggleTheme, theme } = useAppTheme();
  const styles = createStyles(theme);

  const cellData = SHUFFLED_VALUES.map((value, index) => ({
    value,
    index,
  }));

  const isCompleted = total >= GOAL;
  const progress = (total / GOAL) * 100;

  return (
    <SafeAreaView style={styles.containerChallenge}>
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
                  { width: `${Math.min(progress, 100)}%` },
                ]}
              />
            </View>

            {isCompleted && (
              <Text style={styles.successText}>Parabens! Meta alcancada!</Text>
            )}
          </Card.Content>
        </Card>

        <Card style={[styles.surface, { padding: 12 }]}>
          <Card.Content>
            <FlatList
              data={cellData}
              numColumns={6}
              keyExtractor={(item) => item.index.toString()}
              contentContainerStyle={styles.grid}
              scrollEnabled={false}
              renderItem={({ item }) => {
                const pressed = markedIndexes.has(item.index);
                return (
                  <Pressable
                    style={[styles.cell, pressed && styles.cellMarked]}
                    onPress={() => toggle(item.index)}
                  >
                    <Text
                      style={[styles.cellText, pressed && styles.cellTextMarked]}
                    >
                      {item.value}
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
    </SafeAreaView>
  );
}
