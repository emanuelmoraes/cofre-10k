
# Cofre 10k

Aplicativo para controle de depósitos e acompanhamento de meta financeira de R$10.000, inspirado no "cofre dos 10 mil" físico.

## Funcionalidades
- Tabuleiro interativo para marcar depósitos de valores variados (5, 10, 20, 100, 200).
- Progresso visual: total guardado e valor restante para a meta.
- Lista de depósitos realizados.
- Persistência local dos dados (AsyncStorage).
- Reset do cofre com confirmação.
- Interface elegante e responsiva para investidores.
- Ícones profissionais e navegação por abas.

## Tecnologias
- Expo
- React Native
- Zustand (estado global)
- AsyncStorage
- @expo/vector-icons

## Como rodar
1. Instale as dependências:
   ```sh
   npm install
   ```
2. Inicie o projeto:
   ```sh
   npx expo start
   ```
3. Teste no navegador ou no app Expo Go.

## Estrutura
- `app/(tabs)/index.tsx`: Tela principal (Home)
- `app/(tabs)/challenge.tsx`: Tabuleiro de depósitos
- `app/store/useDeposits.ts`: Gerenciamento de depósitos
- `components/`: Componentes visuais

## Personalização
- Altere valores, cores e layout conforme sua necessidade.
- O projeto é modular e fácil de adaptar.

## Licença
MIT

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
