import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Button, Card, IconButton, Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ConfirmModal } from '../components/ConfirmModal';
import { GOAL, SHUFFLED_VALUES } from '../constants/challenge';
import { UI_TEXT } from '../constants/strings';
import { useAppTheme } from '../contexts/ThemeContext';
import { createStyles } from './shared/materialStyles';
import { useMarkedCells, useTotal } from './store/useMarkedCells';

export default function Home() {
  const markedCells = useMarkedCells((s) => s.markedCells);
  const reset = useMarkedCells((s) => s.reset);
  const total = useTotal();
  const router = useRouter();
  const [showResetModal, setShowResetModal] = useState(false);
  const [showResetFeedback, setShowResetFeedback] = useState(false);
  const { isDark, toggleTheme, theme } = useAppTheme();
  const styles = createStyles(theme);

  function handleReset() {
    setShowResetModal(true);
  }

  function confirmReset() {
    reset();
    setShowResetModal(false);
    setShowResetFeedback(true);
  }

  function cancelReset() {
    setShowResetModal(false);
  }

  const progress = (total / GOAL) * 100;
  const isCompleted = progress >= 100;

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
        <Text style={styles.title}>{UI_TEXT.app.title}</Text>
        
        {/* Progress Card */}
        <Card style={[styles.progressCard, isCompleted && styles.progressCardCompleted]}>
          <Card.Content style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.label}>{UI_TEXT.home.progressTitle}</Text>
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
              {isCompleted
                ? UI_TEXT.home.goalCompleted
                : `${progress.toFixed(1)}% ${UI_TEXT.home.goalProgressSuffix}`}
            </Text>
            {isCompleted && (
              <Text style={styles.successText}>{UI_TEXT.home.goalCompletedFeedback}</Text>
            )}
          </Card.Content>
        </Card>

        {/* Main Stats Card */}
        <Card style={styles.card}>
          <Card.Content style={{ alignItems: 'center' }}>
            <Text style={styles.label}>{UI_TEXT.home.totalSaved}</Text>
            <Text style={styles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
            
            <Text style={styles.label}>{UI_TEXT.home.remainingToGoal}</Text>
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
              {UI_TEXT.home.goToBoard}
            </Button>

            <Button
              mode="contained"
              onPress={handleReset}
              style={styles.buttonSecondary}
              labelStyle={styles.buttonTextSecondary}
              contentStyle={{ paddingVertical: 4 }}
            >
              {UI_TEXT.home.resetSafe}
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.subtitle}>{UI_TEXT.home.depositsDone}</Text>
        <Card style={styles.depositsList}>
          <Card.Content>
            {markedCells.length === 0 ? (
              <Text style={styles.empty}>{UI_TEXT.home.noDeposits}</Text>
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
        title={UI_TEXT.home.resetModalTitle}
        message={UI_TEXT.home.resetModalMessage}
        onCancel={cancelReset}
        onConfirm={confirmReset}
        cancelText={UI_TEXT.common.cancel}
        confirmText={UI_TEXT.home.resetConfirm}
      />

      <Snackbar
        visible={showResetFeedback}
        onDismiss={() => setShowResetFeedback(false)}
        duration={2500}
      >
        <Text style={styles.resetFeedback}>{UI_TEXT.home.resetSuccess}</Text>
      </Snackbar>
    </SafeAreaView>
  );
}
