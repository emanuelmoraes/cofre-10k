
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ConfirmModal } from '../components/ConfirmModal';
import { sharedStyles } from './shared/styles';
import { useDeposits } from './store/useDeposits';

const GOAL = 10000;

export default function Home() {
  const deposits = useDeposits(s => s.deposits);
  const total = deposits.reduce((sum, d) => sum + d.value, 0);
  const router = useRouter();
  const { reset } = useDeposits();
  const [showResetModal, setShowResetModal] = useState(false);

  function handleReset() {
    console.log('handleReset chamado'); // Debug
    setShowResetModal(true);
  }

  function confirmReset() {
    console.log('Reset confirmado'); // Debug
    reset();
    setShowResetModal(false);
  }

  function cancelReset() {
    setShowResetModal(false);
  }

  return (
    <View style={sharedStyles.container}>
      <Text style={sharedStyles.title}>Cofre dos 10 mil</Text>
      <View style={sharedStyles.card}>
        <Text style={sharedStyles.label}>Total guardado</Text>
        <Text style={sharedStyles.value}>R$ {total.toLocaleString('pt-BR')}</Text>
        <Text style={sharedStyles.label}>Falta para a meta</Text>
        <Text style={sharedStyles.value}>R$ {(GOAL-total).toLocaleString('pt-BR')}</Text>
        <TouchableOpacity style={sharedStyles.button} onPress={() => router.push('/challenge')}>
          <Text style={sharedStyles.buttonText}>Ir para o tabuleiro</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[sharedStyles.button, { backgroundColor: '#c62828', marginTop: 10 }]} onPress={handleReset}>
          <Text style={[sharedStyles.buttonText, { color: '#fff' }]}>Resetar Cofre</Text>
        </TouchableOpacity>
      </View>
      <Text style={sharedStyles.subtitle}>Depósitos realizados</Text>
      <View style={sharedStyles.depositsList}>
        {deposits.length === 0 ? (
          <Text style={sharedStyles.empty}>Nenhum depósito ainda.</Text>
        ) : (
          deposits.map((d, i) => (
            <View key={i} style={sharedStyles.depositItem}>
              <Text style={sharedStyles.depositValue}>R$ {d.value}</Text>
            </View>
          ))
        )}
      </View>

      <ConfirmModal
        visible={showResetModal}
        title="Confirmar reset"
        message="Tem certeza que deseja apagar todos os depósitos? Esta ação não pode ser desfeita."
        onCancel={cancelReset}
        onConfirm={confirmReset}
        cancelText="Cancelar"
        confirmText="Apagar tudo"
      />
    </View>
  );
}
