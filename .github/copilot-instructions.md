# Copilot Instructions - Cofre 10k

Este documento define as diretrizes e padrões para desenvolvimento do projeto **Cofre 10k**.

---

## Visão Geral do Projeto

Aplicativo móvel de finanças pessoais para controle de depósitos com meta de R$10.000. O app possui um tabuleiro interativo com 560 células de valores variados (R$5, R$10, R$20, R$100, R$200) que somam exatamente R$10.000.

### Stack Principal
- **Framework**: Expo SDK 54 + React Native 0.81
- **Linguagem**: TypeScript (strict mode)
- **UI**: React Native Paper (Material Design 3)
- **Estado**: Zustand
- **Persistência**: AsyncStorage
- **Navegação**: Expo Router

---

## Regras Gerais

### Proibições
- **NUNCA usar emojis** em código, comentários ou strings de UI
- **NUNCA usar console.log em produção** - remover ou usar __DEV__ guard
- **NUNCA usar `any`** - sempre tipar corretamente
- **NUNCA criar arquivos JavaScript** - sempre usar TypeScript (.ts/.tsx)
- **NUNCA usar estilos inline** exceto casos muito específicos (ex: width dinâmico)

### Obrigações
- **SEMPRE usar nomenclatura em português** para textos de UI
- **SEMPRE usar nomenclatura em inglês** para código (variáveis, funções, tipos)
- **SEMPRE exportar tipos** quando podem ser reutilizados
- **SEMPRE usar const** para declarar variáveis (evitar let quando possível)

---

## Padrão TypeScript

### Configuração
O projeto usa `strict: true`. Todas as tipagens devem ser explícitas.

```typescript
// CORRETO
const handlePress = (value: number): void => { ... }
type Deposit = { id: string; value: number; dateISO: string; }

// INCORRETO
const handlePress = (value) => { ... }  // falta tipagem
```

### Convenções de Nomenclatura
- **Tipos/Interfaces**: PascalCase (`Deposit`, `ThemeContextType`)
- **Funções/Variáveis**: camelCase (`handlePress`, `isCompleted`)
- **Constantes globais**: SCREAMING_SNAKE_CASE (`GOAL`, `SHUFFLED_VALUES`)
- **Componentes**: PascalCase (`ConfirmModal`, `ThemedView`)
- **Arquivos de componentes**: PascalCase.tsx (`ConfirmModal.tsx`)
- **Arquivos utilitários**: camelCase.ts (`useMarkedCells.ts`, `materialStyles.ts`)

### Tipos vs Interfaces
Preferir `type` para a maioria dos casos. Usar `interface` apenas quando precisar de extensão/herança.

```typescript
// Preferido
type Deposit = {
  id: string;
  value: number;
  dateISO: string;
  note?: string;
};

// Quando precisar estender
interface ThemeColors extends MD3Colors {
  customColor: string;
}
```

---

## Padrão de UI - React Native Paper

### Componentes Obrigatórios
Sempre usar componentes do React Native Paper quando disponíveis:

| Necessidade | Usar | NÃO usar |
|-------------|------|----------|
| Botões | `Button` | `TouchableOpacity` com texto |
| Cards | `Card`, `Card.Content` | `View` com estilos manuais |
| Inputs | `TextInput` | `TextInput` do RN |
| Ícones | `IconButton` | Ícones soltos |
| Modais | `Portal`, `Modal` | `Modal` do RN |
| Listas | `List.Item` | Views customizadas |

### Temas
O projeto suporta tema claro e escuro. **NUNCA usar cores hardcoded**.

```typescript
// CORRETO
const styles = createStyles(theme);
<Text style={{ color: theme.colors.onSurface }}>Texto</Text>

// INCORRETO
<Text style={{ color: '#000000' }}>Texto</Text>
```

### Estilos Material Design 3
Usar o arquivo `app/shared/materialStyles.ts` para estilos compartilhados.

```typescript
import { createStyles } from './shared/materialStyles';
import { useAppTheme } from '../contexts/ThemeContext';

const { theme } = useAppTheme();
const styles = createStyles(theme);
```

---

## Ícones - @expo/vector-icons

### Biblioteca Padrão
Usar **@expo/vector-icons** com as seguintes famílias:
- **Feather**: Ícones principais (limpos e modernos)
- **MaterialCommunityIcons**: Via IconButton do Paper

```typescript
// Para ícones independentes
import { Feather } from '@expo/vector-icons';
<Feather name="check" size={24} color={theme.colors.primary} />

// Para botões com ícone
import { IconButton } from 'react-native-paper';
<IconButton icon="moon-waning-crescent" size={24} onPress={toggleTheme} />
```

### Regras de Ícones
- Tamanho padrão: 24
- Sempre usar cor do tema
- Preferir Feather para ícones de ação
- Usar IconButton do Paper quando precisar de área de toque maior

---

## Gerenciamento de Estado - Zustand

### Estrutura da Store
Seguir o padrão estabelecido em `app/store/useMarkedCells.ts`:

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type MarkedCell = {
  index: number;
  dateISO: string;
};

type State = {
  markedCells: MarkedCell[];
  toggle: (index: number) => void;
  reset: () => void;
  hydrate: () => Promise<void>;
};

export const useMarkedCells = create<State>((set, get) => ({
  markedCells: [],
  toggle: (index) => {
    const current = get().markedCells;
    const exists = current.some((c) => c.index === index);
    const newCells = exists
      ? current.filter((c) => c.index !== index)
      : [...current, { index, dateISO: new Date().toISOString() }];
    set({ markedCells: newCells });
    AsyncStorage.setItem('markedCells', JSON.stringify(newCells));
  },
  // ...
}));
```

### Regras
- **SEMPRE persistir com AsyncStorage** para dados importantes
- **SEMPRE criar hook de hidratacao** para carregar dados ao iniciar
- **NUNCA acessar state diretamente** - usar seletores

```typescript
// CORRETO
const markedCells = useMarkedCells(s => s.markedCells);
const toggle = useMarkedCells(s => s.toggle);

// INCORRETO
const { markedCells, toggle } = useMarkedCells();  // re-renderiza em qualquer mudanca
```

---

## Navegação - Expo Router

### Estrutura de Arquivos
```
app/
├── _layout.tsx       # Layout raiz com providers
├── index.tsx         # Tela inicial (/)
├── [param].tsx       # Rota dinâmica
├── +not-found.tsx    # Página 404
└── (group)/          # Grupo de rotas (não aparece na URL)
```

### Navegação
```typescript
import { useRouter } from 'expo-router';

const router = useRouter();
router.push('/challenge');      // Navegar
router.replace('/');            // Substituir
router.back();                  // Voltar
```

---

## Usabilidade Mobile

### Touch Targets
- Mínimo de 44x44 pontos para áreas tocáveis
- Usar `hitSlop` quando necessário
- Preferir `Pressable` sobre `TouchableOpacity`

### Feedback
- Usar `expo-haptics` para feedback tátil em ações importantes
- Mostrar estados de loading durante operações async
- Confirmar ações destrutivas com modal

```typescript
import * as Haptics from 'expo-haptics';

const handleDeposit = () => {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  // ...
};
```

### Safe Areas
Sempre usar `SafeAreaView` do `react-native-safe-area-context`:

```typescript
import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={styles.container}>
  {/* conteúdo */}
</SafeAreaView>
```

### ScrollView
- Sempre definir `showsVerticalScrollIndicator={false}` para visual limpo
- Usar `contentContainerStyle` para padding interno
- Definir `keyboardShouldPersistTaps="handled"` quando houver inputs

---

## Testes - Jest + React Native Testing Library

### Estrutura
```
__tests__/
├── components/
│   └── ConfirmModal.test.tsx
├── screens/
│   └── Home.test.tsx
└── store/
    └── useMarkedCells.test.ts
```

### Padrão de Teste
```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { ConfirmModal } from '../components/ConfirmModal';

describe('ConfirmModal', () => {
  it('deve chamar onConfirm ao pressionar botão de confirmar', () => {
    const onConfirm = jest.fn();
    const { getByText } = render(
      <ConfirmModal
        visible={true}
        title="Confirmar"
        message="Mensagem"
        onConfirm={onConfirm}
        onCancel={() => {}}
      />
    );
    
    fireEvent.press(getByText('Confirmar'));
    expect(onConfirm).toHaveBeenCalled();
  });
});
```

### Mocks
- Mockar AsyncStorage em testes
- Mockar navegação quando necessário
- Usar `jest.mock` para módulos externos

---

## Estrutura de Pastas

```
cofre-10k/
├── app/                    # Telas e rotas (Expo Router)
│   ├── shared/             # Estilos compartilhados
│   └── store/              # Stores Zustand
├── components/             # Componentes reutilizáveis
├── contexts/               # Contextos React (Theme, etc)
├── constants/              # Constantes (cores, configs)
├── hooks/                  # Custom hooks
├── assets/                 # Imagens, fontes
│   ├── fonts/
│   └── images/
└── __tests__/              # Testes
```

---

## Commits e Git

### Formato de Commit
```
tipo(escopo): descrição curta

[corpo opcional]
```

### Tipos
- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `refactor`: Refatoração sem mudança de comportamento
- `style`: Formatação, estilos
- `docs`: Documentação
- `test`: Testes
- `chore`: Tarefas de build, configs

### Exemplos
```
feat(tabuleiro): adicionar animação ao marcar célula
fix(store): corrigir persistência de depósitos
refactor(theme): extrair cores para constantes
```

---

## Performance

### Otimizações Obrigatórias
- Usar `useMemo` para cálculos pesados
- Usar `useCallback` para funções passadas como props
- Usar `FlatList` em vez de `ScrollView` para listas grandes
- Evitar re-renders desnecessários com seletores Zustand específicos

```typescript
// CORRETO - so re-renderiza quando markedCells muda
const markedCells = useMarkedCells(s => s.markedCells);

// INCORRETO - re-renderiza em qualquer mudanca da store
const store = useMarkedCells();
```

### Imagens
- Usar `expo-image` para imagens otimizadas
- Definir dimensões explícitas
- Usar formatos WebP quando possível

---

## Checklist de Code Review

- [ ] Sem emojis no código
- [ ] Tipagem completa (sem `any`)
- [ ] Cores usando tema (sem hardcoded)
- [ ] Componentes do Paper quando disponíveis
- [ ] Seletores específicos no Zustand
- [ ] Safe areas implementadas
- [ ] Feedback tátil em ações
- [ ] Textos de UI em português
- [ ] Código em inglês
