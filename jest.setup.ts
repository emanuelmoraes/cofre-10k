import '@testing-library/jest-native/extend-expect';
import 'react-native-gesture-handler/jestSetup';

const originalConsoleWarn = console.warn;
jest.spyOn(console, 'warn').mockImplementation((...args) => {
  const firstArg = String(args[0] ?? '');
  if (firstArg.includes('Tried to use the icon')) {
    return;
  }
  originalConsoleWarn(...args);
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('@expo/vector-icons', () => {
  const MockIcon = () => null;
  return {
    Feather: MockIcon,
    MaterialCommunityIcons: MockIcon,
  };
});

jest.mock('react-native-paper/src/components/MaterialCommunityIcon', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('react-native-paper/lib/commonjs/components/MaterialCommunityIcon', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
}));

jest.mock('react-native-safe-area-context', () => {
  const actual = jest.requireActual('react-native-safe-area-context');
  return {
    ...actual,
    SafeAreaView: actual.SafeAreaView,
    SafeAreaProvider: actual.SafeAreaProvider,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});
