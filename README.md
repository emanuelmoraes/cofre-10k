
# Cofre 10k

Aplicativo móvel moderno para controle de depósitos e acompanhamento de meta financeira de R$10.000, inspirado no conceito do "cofre dos 10 mil" físico. Desenvolvido com Material Design 3 e suporte completo a temas claro e escuro.

## ✨ Funcionalidades

### 🎯 Gestão Financeira
- **Tabuleiro interativo** para marcar depósitos de valores variados (R$5, R$10, R$20, R$100, R$200)
- **Progresso visual em tempo real** com barra de progresso e estatísticas detalhadas
- **Meta de R$10.000** com acompanhamento percentual
- **Lista completa** de todos os depósitos realizados
- **Reset seguro** do cofre com modal de confirmação

### 🎨 Interface Moderna
- **Material Design 3** com componentes nativos do React Native Paper
- **Tema claro e escuro** com alternância em tempo real
- **Design minimalista** e interface intuitiva
- **Animações suaves** e feedback tátil
- **Responsivo** para diferentes tamanhos de tela
- **Cards elevados** com sombras e bordas arredondadas

### 💾 Persistência de Dados
- **AsyncStorage** para armazenamento local seguro
- **Zustand** para gerenciamento de estado global
- **Hidratação automática** dos dados na inicialização
- **Backup automático** de todas as alterações

## 🛠 Tecnologias

### Core
- **Expo** ~53.0.22 - Framework de desenvolvimento
- **React Native** 0.79.6 - Framework mobile
- **TypeScript** ~5.8.3 - Tipagem estática
- **Expo Router** ~5.1.5 - Navegação baseada em arquivos

### UI/UX
- **React Native Paper** ^5.14.5 - Material Design 3
- **@expo/vector-icons** ^14.1.0 - Ícones vetoriais
- **React Native Reanimated** ~3.17.4 - Animações
- **React Native Gesture Handler** ~2.24.0 - Gestos

### Estado e Dados
- **Zustand** ^5.0.8 - Gerenciamento de estado
- **AsyncStorage** ^2.2.0 - Persistência local
- **React Native UUID** ^2.0.3 - IDs únicos

### Navegação
- **@react-navigation/native** ^7.1.6
- **React Native Screens** ~4.11.1
- **React Native Safe Area Context** 5.4.0

## 🚀 Como rodar

### Pré-requisitos
- Node.js 18+ instalado
- Expo CLI global (`npm install -g @expo/cli`)
- Dispositivo físico ou emulador configurado

### Instalação
1. **Clone o repositório:**
   ```bash
   git clone https://github.com/emanuelmoraes/cofre-10k.git
   cd cofre-10k
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```

4. **Execute o app:**
   - **No dispositivo físico:** Escaneie o QR Code com o app Expo Go
   - **No emulador Android:** Pressione `a` no terminal
   - **No simulador iOS:** Pressione `i` no terminal
   - **No navegador:** Pressione `w` no terminal

## 📁 Estrutura do Projeto

```
cofre-10k/
├── app/                          # Páginas da aplicação
│   ├── _layout.tsx              # Layout raiz com providers
│   ├── index.tsx                # Tela principal (Dashboard)
│   ├── challenge.tsx            # Tabuleiro de depósitos
│   ├── +not-found.tsx          # Página 404
│   ├── shared/
│   │   ├── styles.ts           # Estilos legados
│   │   └── materialStyles.ts   # Estilos Material Design
│   └── store/
│       └── useDeposits.ts      # Store Zustand para depósitos
├── components/                   # Componentes reutilizáveis
│   ├── ConfirmModal.tsx        # Modal de confirmação
│   └── ...                     # Outros componentes
├── contexts/                     # Contextos React
│   └── ThemeContext.tsx        # Gerenciamento de tema
├── constants/                    # Constantes e configurações
├── hooks/                       # Hooks personalizados
├── assets/                      # Recursos estáticos
│   ├── fonts/                  # Fontes customizadas
│   └── images/                 # Imagens e ícones
└── ...
```

## 🎨 Sistema de Temas

O aplicativo implementa um sistema completo de temas baseado no Material Design 3:

### Tema Claro
- **Primary:** #1a2236 (Azul escuro elegante)
- **Secondary:** #4CAF50 (Verde sucesso)
- **Background:** #fafafa (Cinza muito claro)
- **Surface:** #ffffff (Branco puro)

### Tema Escuro
- **Primary:** #b5b9c9 (Cinza azulado)
- **Secondary:** #81c784 (Verde claro)
- **Background:** #121212 (Preto material)
- **Surface:** #1e1e1e (Cinza escuro)

### Alternância de Tema
- Botão de alternância no canto superior direito
- Persistência automática da preferência
- Transições suaves entre temas

## 🏗 Arquitetura

### Gerenciamento de Estado
- **Zustand** para estado global simples e performático
- **React Context** para tema e configurações
- **AsyncStorage** para persistência local

### Padrões de Design
- **Compound Components** para componentes complexos
- **Custom Hooks** para lógica reutilizável
- **Context Providers** para funcionalidades globais
- **TypeScript** para type safety

### Performance
- **React.memo** em componentes pesados
- **useMemo/useCallback** para otimizações
- **Lazy loading** de recursos quando possível

## 🔧 Personalização

### Modificar Valores
```typescript
// Em app/challenge.tsx
const SHUFFLED_VALUES = [5, 10, 20, 100, 200, ...];
```

### Alterar Meta
```typescript
// Em app/index.tsx
const GOAL = 10000; // Modifique para sua meta
```

### Customizar Cores
```typescript
// Em contexts/ThemeContext.tsx
const lightTheme = {
  colors: {
    primary: '#sua-cor-primaria',
    secondary: '#sua-cor-secundaria',
    // ...
  }
};
```

## 📱 Funcionalidades Avançadas

### Modal de Confirmação
- Design Material com blur effect
- Animações de entrada/saída
- Botões de ação destacados

### Barra de Progresso
- Indicador visual do progresso
- Animações suaves de preenchimento
- Feedback de meta atingida

### Persistência Inteligente
- Salvamento automático a cada mudança
- Recuperação de dados na inicialização
- Tratamento de erros robusto

## 🧪 Testes

```bash
# Executar linter
npm run lint

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📦 Build para Produção

```bash
# Build para todas as plataformas
eas build --platform all

# Build apenas Android
eas build --platform android

# Build apenas iOS
eas build --platform ios
```

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🔗 Links Úteis

- [Expo Documentation](https://docs.expo.dev/) - Documentação oficial do Expo
- [React Native Paper](https://reactnativepaper.com/) - Material Design para React Native
- [Zustand](https://github.com/pmndrs/zustand) - Gerenciamento de estado
- [Material Design 3](https://m3.material.io/) - Sistema de design do Google

---

**Desenvolvido com ❤️ usando Expo e React Native**
