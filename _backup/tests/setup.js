/**
 * Global Jest Setup für CultureStream-Tests
 * Diese Datei wird vor allen Tests ausgeführt
 */

// Mock für Window-Objekt
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock für Intersection Observer
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  
  observe() {
    return null;
  }
  
  unobserve() {
    return null;
  }
  
  disconnect() {
    return null;
  }
};

// Mock für Fetch API
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
    ok: true,
    status: 200,
    headers: new Map()
  })
);

// Mock für console.error im Test-Modus
console.error = jest.fn();

// Mock für CustomEvent
global.CustomEvent = class CustomEvent {
  constructor(type, options) {
    this.type = type;
    this.detail = options?.detail;
    this.bubbles = options?.bubbles || false;
    this.cancelable = options?.cancelable || false;
  }
};

// Mock für URL und URLSearchParams
global.URL.createObjectURL = jest.fn(() => 'mock-url');
global.URL.revokeObjectURL = jest.fn();

// Mock für DOMParser
global.DOMParser = class DOMParser {
  parseFromString(string, type) {
    return {
      documentElement: {
        textContent: string
      },
      body: {
        textContent: string
      }
    };
  }
}; 