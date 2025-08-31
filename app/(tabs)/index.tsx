
import { useRouter } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDeposits } from '../store/useDeposits';

const GOAL = 10000;

export default function Home() {
  const deposits = useDeposits(s => s.deposits);
  const total = deposits.reduce((sum, d) => sum + d.value, 0);
  const router = useRouter();
  const setDeposits = useDeposits.setState;

  function handleReset() {
    Alert.alert(
      'Confirmar reset',
      'Tem certeza que deseja apagar todos os depósitos? Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Apagar tudo', style: 'destructive', onPress: () => setDeposits({ deposits: [] }) },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cofre dos 10 mil</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Total guardado</Text>
        <Text style={styles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
        <Text style={styles.label}>Falta para a meta</Text>
        <Text style={styles.value}>R$ {(GOAL-total).toLocaleString('pt-BR')}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.push('/challenge')}>
          <Text style={styles.buttonText}>Ir para o tabuleiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: '#c62828', marginTop: 10 }]} onPress={handleReset}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>Resetar Cofre</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.subtitle}>Depósitos realizados</Text>
      <View style={styles.depositsList}>
        {deposits.length === 0 ? (
          <Text style={styles.empty}>Nenhum depósito ainda.</Text>
        ) : (
          deposits.map((d, i) => (
            <View key={i} style={styles.depositItem}>
              <Text style={styles.depositValue}>R$ {d.value}</Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    backgroundColor: '#f7f7fa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    color: '#1a2236',
    letterSpacing: 1,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  label: {
    fontSize: 15,
    color: '#6c7a93',
    marginTop: 8,
    marginBottom: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1a2236',
    marginBottom: 8,
  },
  button: {
    marginTop: 18,
    backgroundColor: '#1a2236',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 12,
    color: '#1a2236',
    alignSelf: 'flex-start',
  },
  depositsList: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    minHeight: 60,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  empty: {
    fontSize: 15,
    color: '#6c7a93',
    textAlign: 'center',
    marginTop: 8,
  },
  depositItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ececf0',
    paddingVertical: 6,
  },
  depositValue: {
    fontSize: 16,
    color: '#1a2236',
    fontWeight: '500',
  },
});
