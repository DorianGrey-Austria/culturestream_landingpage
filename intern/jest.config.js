/**
 * Jest-Konfiguration für CultureStream-Tests
 */
module.exports = {
  // Test-Umgebung
  testEnvironment: 'jsdom',
  
  // Testmuster
  testMatch: [
    '**/tests/**/*.test.js',
    '**/?(*.)+(spec|test).js'
  ],
  
  // Transformationen für moderne JS-Features
  transform: {
    '^.+\\.jsx?$': 'babel-jest'
  },
  
  // Pfade, die ignoriert werden sollen
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  
  // Coverage-Konfiguration
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'scripts.js',
    'form-validation.js',
    '!**/node_modules/**'
  ],
  
  // Reporting-Format für Coverage
  coverageReporters: ['text', 'lcov', 'json'],
  
  // Timeout für Tests
  testTimeout: 10000,
  
  // Mock-Konfiguration
  moduleNameMapper: {
    '\\.(css|less)$': '<rootDir>/tests/mocks/styleMock.js',
    '\\.(jpg|jpeg|png|gif)$': '<rootDir>/tests/mocks/fileMock.js'
  },
  
  // Setup-Dateien
  setupFiles: [
    '<rootDir>/tests/setup.js'
  ],
  
  // Reporter für Test-Ergebnisse
  reporters: [
    'default',
    [
      'jest-html-reporters',
      {
        publicPath: './test-reports',
        filename: 'report.html',
        expand: true
      }
    ]
  ]
}; 