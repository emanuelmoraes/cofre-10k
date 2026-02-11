import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmModal } from '../components/ConfirmModal';
import { GOAL, SHUFFLED_VALUES } from '../constants/challenge';
import { useAppTheme } from '../contexts/ThemeContext';
import { createStyles } from './shared/materialStyles';
import { useMarkedCells, useTotal } from './store/useMarkedCells';

export default function Home() {
  const markedCells = useMarkedCells((s) => s.markedCells);
  const reset = useMarkedCells((s) => s.reset);
  const total = useTotal();
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const { isDark, toggleTheme, theme } = useAppTheme();
  const styles = createStyles(theme);

  function handleReset() {
    setShowResetModal(true);
  }

  function confirmReset() {
    reset();
    setShowResetModal(false);
  }

  function cancelReset() {
    setShowResetModal(false);
  }

  const progress = (total / GOAL) * 100;

  return (
    <SafeAreaView style={styles.container}>
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

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: 'center', paddingBottom: 100 }}
      >
        <Text style={styles.title}>Cofre dos 10 mil</Text>
        
        {/* Progress Card */}
        <Card style={styles.progressCard}>
          <Card.Content style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.label}>Progresso da Meta</Text>
            <Text style={styles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { width: `${Math.min(progress, 100)}%` }
                ]} 
              />
            </View>
            
            <Text style={styles.label}>
              {progress >= 100 ? 'Meta atingida!' : `${progress.toFixed(1)}% da meta`}
            </Text>
          </Card.Content>
        </Card>

        {/* Main Stats Card */}
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={styles.label}>Total Guardado</Text>
            <Text style={styles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
            
            <Text style={styles.label}>Falta para a Meta</Text>
            <Text style={[styles.value, { color: theme.colors.secondary }]}>
              R$ {Math.max(GOAL - total, 0).toLocaleString('pt-BR')}
            </Text>

            <Button
              mode="contained"
              onPress={() => router.push('/challenge')}
              style={styles.button}
              labelStyle={styles.buttonText}
              contentStyle={{ paddingVertical: 4 }}
            >
              Ir para o Tabuleiro
            </Button>

            <Button
              mode="contained"
              onPress={handleReset}
              style={styles.buttonSecondary}
              labelStyle={styles.buttonTextSecondary}
              contentStyle={{ paddingVertical: 4 }}
            >
              Resetar Cofre
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.subtitle}>Depositos Realizados</Text>
        <Card style={styles.depositsList}>
          <Card.Content>
            {markedCells.length === 0 ? (
              <Text style={styles.empty}>Nenhum deposito ainda.</Text>
            ) : (
              markedCells.map((cell) => (
                <View key={cell.index} style={styles.depositItem}>
                  <Text style={styles.depositValue}>
                    R$ {SHUFFLED_VALUES[cell.index].toLocaleString('pt-BR')}
                  </Text>
                </View>
              ))
            )}
          </Card.Content>
        </Card>
      </ScrollView>

      <ConfirmModal
        visible={showResetModal}
        title="Confirmar reset"
        message="Tem certeza que deseja apagar todos os depósitos? Esta ação não pode ser desfeita."
        onCancel={cancelReset}
        onConfirm={confirmReset}
        cancelText="Cancelar"
        confirmText="Apagar tudo"
      />
    </SafeAreaView>
  );
}
