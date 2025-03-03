import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

// Mock AsyncStorage (ensure the correct package is used)
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

// Mock the @env module
jest.mock('@env', () => ({
  SERVER_URL: 'http://localhost',
}));






