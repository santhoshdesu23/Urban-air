import '@testing-library/jest-dom';

try {
  if (typeof process.loadEnvFile === 'function') {
    process.loadEnvFile('.env');
  }
} catch {
  // .env file not present or unreadable in test environment
}
