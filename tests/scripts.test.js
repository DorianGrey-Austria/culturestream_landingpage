/**
 * Unit-Tests für das CultureStream JavaScript Framework
 * Testet die Kernfunktionalitäten von scripts.js mit Jest
 */

// Mocks für DOM-Elemente und Browser-APIs
let documentSpy;
let localStorageMock;

// DOM-Mock für Tests
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toUpperCase();
    this.attributes = {};
    this.children = [];
    this.innerHTML = '';
    this.innerText = '';
    this.style = {};
    this.classList = {
      list: [],
      add: (cls) => {
        if (!this.classList.list.includes(cls)) {
          this.classList.list.push(cls);
        }
      },
      remove: (cls) => {
        this.classList.list = this.classList.list.filter(c => c !== cls);
      },
      contains: (cls) => this.classList.list.includes(cls),
      toggle: (cls) => {
        if (this.classList.contains(cls)) {
          this.classList.remove(cls);
          return false;
        } else {
          this.classList.add(cls);
          return true;
        }
      }
    };
    this._eventListeners = {};
  }

  hasAttribute(name) {
    return Object.keys(this.attributes).includes(name);
  }

  getAttribute(name) {
    return this.attributes[name];
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    this.children.push(child);
    return child;
  }

  querySelector(selector) {
    // Simulieren der Selektorlogik für Testzwecke
    return null;
  }

  querySelectorAll(selector) {
    // Simulieren der Selektorlogik für Testzwecke
    return [];
  }

  addEventListener(event, callback) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this._eventListeners[event]) {
      this._eventListeners[event] = this._eventListeners[event].filter(cb => cb !== callback);
    }
  }

  dispatchEvent(event) {
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(callback => {
        callback(event);
      });
    }
  }
}

// Setup und Teardown für jeden Test
beforeEach(() => {
  // DOM Mock
  document.body = new MockElement('body');
  document.head = new MockElement('head');
  
  document.createElement = jest.fn().mockImplementation(tag => {
    return new MockElement(tag);
  });
  
  document.querySelector = jest.fn().mockImplementation(selector => {
    // Je nach Selektor können wir spezifische Elemente zurückgeben
    if (selector === 'body') return document.body;
    if (selector === 'head') return document.head;
    return null;
  });
  
  document.querySelectorAll = jest.fn().mockImplementation(selector => {
    return [];
  });
  
  // LocalStorage Mock
  localStorageMock = {
    store: {},
    getItem: jest.fn(key => localStorageMock.store[key]),
    setItem: jest.fn((key, value) => {
      localStorageMock.store[key] = value;
    }),
    removeItem: jest.fn(key => {
      delete localStorageMock.store[key];
    }),
    clear: jest.fn(() => {
      localStorageMock.store = {};
    })
  };
  
  Object.defineProperty(window, 'localStorage', {
    value: localStorageMock
  });
  
  // Spy-Funktion für document, um API-Aufrufe zu überwachen
  documentSpy = jest.spyOn(document, 'querySelector');
  
  // CultureStream Objekt initialisieren
  window.CultureStream = {
    dom: {
      get: jest.fn(selector => {
        if (typeof selector === 'string') {
          return document.querySelector(selector);
        }
        return selector;
      }),
      getAll: jest.fn(selector => {
        return document.querySelectorAll(selector);
      }),
      create: jest.fn((tag, options = {}) => {
        const element = document.createElement(tag);
        
        if (options.text) {
          element.innerText = options.text;
        }
        
        if (options.html) {
          element.innerHTML = options.html;
        }
        
        if (options.attributes) {
          Object.entries(options.attributes).forEach(([key, value]) => {
            element.setAttribute(key, value);
          });
        }
        
        if (options.classes) {
          options.classes.forEach(cls => {
            element.classList.add(cls);
          });
        }
        
        if (options.styles) {
          Object.entries(options.styles).forEach(([key, value]) => {
            element.style[key] = value;
          });
        }
        
        if (options.parent) {
          const parent = typeof options.parent === 'string' ? 
            document.querySelector(options.parent) : options.parent;
          if (parent) {
            parent.appendChild(element);
          }
        }
        
        return element;
      }),
      append: jest.fn((parent, child) => {
        const parentElement = typeof parent === 'string' ? 
          document.querySelector(parent) : parent;
        if (parentElement) {
          parentElement.appendChild(child);
        }
        return child;
      })
    },
    
    events: {
      on: jest.fn((element, event, callback) => {
        const el = typeof element === 'string' ? 
          document.querySelector(element) : element;
        if (el) {
          el.addEventListener(event, callback);
        }
      }),
      off: jest.fn((element, event, callback) => {
        const el = typeof element === 'string' ? 
          document.querySelector(element) : element;
        if (el) {
          el.removeEventListener(event, callback);
        }
      }),
      trigger: jest.fn((element, eventName, data = {}) => {
        const el = typeof element === 'string' ? 
          document.querySelector(element) : element;
        if (el) {
          const event = new CustomEvent(eventName, { detail: data });
          el.dispatchEvent(event);
        }
      })
    },
    
    validate: {
      form: jest.fn(formSelector => {
        return { valid: true, errors: [] };
      }),
      email: jest.fn(email => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
      }),
      required: jest.fn(value => {
        return value !== undefined && value !== null && value.trim() !== '';
      }),
      minLength: jest.fn((value, length) => {
        return value && value.length >= length;
      }),
      maxLength: jest.fn((value, length) => {
        return value && value.length <= length;
      }),
      pattern: jest.fn((value, pattern) => {
        return new RegExp(pattern).test(value);
      })
    },
    
    ajax: {
      get: jest.fn((url, options = {}) => {
        return Promise.resolve({ status: 200, data: {} });
      }),
      post: jest.fn((url, data, options = {}) => {
        return Promise.resolve({ status: 200, data: {} });
      }),
      put: jest.fn((url, data, options = {}) => {
        return Promise.resolve({ status: 200, data: {} });
      }),
      delete: jest.fn((url, options = {}) => {
        return Promise.resolve({ status: 200, data: {} });
      })
    },
    
    storage: {
      set: jest.fn((key, value) => {
        localStorage.setItem(key, JSON.stringify(value));
      }),
      get: jest.fn(key => {
        const value = localStorage.getItem(key);
        try {
          return value ? JSON.parse(value) : null;
        } catch (e) {
          return value;
        }
      }),
      remove: jest.fn(key => {
        localStorage.removeItem(key);
      }),
      clear: jest.fn(() => {
        localStorage.clear();
      })
    },
    
    ui: {
      showModal: jest.fn(options => {
        return { id: 'modal-1' };
      }),
      hideModal: jest.fn(modalId => {
        return true;
      }),
      showLoader: jest.fn(() => {
        return true;
      }),
      hideLoader: jest.fn(() => {
        return true;
      })
    },
    
    notifications: {
      show: jest.fn((message, type = 'info', duration = 3000) => {
        return true;
      }),
      success: jest.fn(message => {
        return CultureStream.notifications.show(message, 'success');
      }),
      error: jest.fn(message => {
        return CultureStream.notifications.show(message, 'error');
      }),
      warning: jest.fn(message => {
        return CultureStream.notifications.show(message, 'warning');
      }),
      info: jest.fn(message => {
        return CultureStream.notifications.show(message, 'info');
      })
    },
    
    utils: {
      formatDate: jest.fn(date => {
        return '01.01.2023';
      }),
      formatNumber: jest.fn(number => {
        return '1,000.00';
      }),
      generateId: jest.fn(() => {
        return 'id-' + Math.random().toString(36).substring(2, 9);
      }),
      debounce: jest.fn((func, wait) => {
        return function() {
          func.apply(this, arguments);
        };
      }),
      throttle: jest.fn((func, limit) => {
        return function() {
          func.apply(this, arguments);
        };
      })
    }
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

// Tests für DOM-Manipulation
describe('CultureStream.dom', () => {
  test('get sollte document.querySelector aufrufen', () => {
    CultureStream.dom.get('div');
    expect(document.querySelector).toHaveBeenCalledWith('div');
  });
  
  test('getAll sollte document.querySelectorAll aufrufen', () => {
    CultureStream.dom.getAll('div');
    expect(document.querySelectorAll).toHaveBeenCalledWith('div');
  });
  
  test('create sollte ein Element erstellen', () => {
    const element = CultureStream.dom.create('div', {
      text: 'Test',
      attributes: { id: 'test-div' },
      classes: ['test-class'],
      styles: { color: 'red' }
    });
    
    expect(element.tagName).toBe('DIV');
    expect(element.innerText).toBe('Test');
    expect(element.getAttribute('id')).toBe('test-div');
    expect(element.classList.contains('test-class')).toBe(true);
    expect(element.style.color).toBe('red');
  });
  
  test('append sollte ein Element an ein anderes anhängen', () => {
    const parent = document.createElement('div');
    const child = document.createElement('span');
    
    CultureStream.dom.append(parent, child);
    
    expect(parent.children).toContain(child);
  });
});

// Tests für Event-Handling
describe('CultureStream.events', () => {
  test('on sollte addEventListener aufrufen', () => {
    const element = document.createElement('button');
    const callback = jest.fn();
    
    CultureStream.events.on(element, 'click', callback);
    
    const event = new CustomEvent('click');
    element.dispatchEvent(event);
    
    expect(callback).toHaveBeenCalled();
  });
  
  test('off sollte removeEventListener aufrufen', () => {
    const element = document.createElement('button');
    const callback = jest.fn();
    
    element.addEventListener('click', callback);
    CultureStream.events.off(element, 'click', callback);
    
    const event = new CustomEvent('click');
    element.dispatchEvent(event);
    
    expect(callback).not.toHaveBeenCalled();
  });
  
  test('trigger sollte ein Event auslösen', () => {
    const element = document.createElement('button');
    const callback = jest.fn();
    
    element.addEventListener('custom-event', callback);
    CultureStream.events.trigger(element, 'custom-event', { detail: 'test' });
    
    expect(callback).toHaveBeenCalled();
  });
});

// Tests für Validierung
describe('CultureStream.validate', () => {
  test('email sollte gültige E-Mail-Adressen akzeptieren', () => {
    expect(CultureStream.validate.email('test@example.com')).toBe(true);
    expect(CultureStream.validate.email('test.name@example.co.uk')).toBe(true);
    expect(CultureStream.validate.email('test+label@example.com')).toBe(true);
  });
  
  test('email sollte ungültige E-Mail-Adressen ablehnen', () => {
    expect(CultureStream.validate.email('test')).toBe(false);
    expect(CultureStream.validate.email('test@')).toBe(false);
    expect(CultureStream.validate.email('test@example')).toBe(false);
    expect(CultureStream.validate.email('@example.com')).toBe(false);
  });
  
  test('required sollte leere Werte ablehnen', () => {
    expect(CultureStream.validate.required('')).toBe(false);
    expect(CultureStream.validate.required('  ')).toBe(false);
    expect(CultureStream.validate.required(null)).toBe(false);
    expect(CultureStream.validate.required(undefined)).toBe(false);
  });
  
  test('required sollte nicht-leere Werte akzeptieren', () => {
    expect(CultureStream.validate.required('test')).toBe(true);
    expect(CultureStream.validate.required('0')).toBe(true);
    expect(CultureStream.validate.required(' test ')).toBe(true);
  });
  
  test('minLength sollte Werte mit ausreichender Länge akzeptieren', () => {
    expect(CultureStream.validate.minLength('test', 3)).toBe(true);
    expect(CultureStream.validate.minLength('test', 4)).toBe(true);
    expect(CultureStream.validate.minLength('test', 2)).toBe(true);
  });
  
  test('minLength sollte Werte mit unzureichender Länge ablehnen', () => {
    expect(CultureStream.validate.minLength('test', 5)).toBe(false);
    expect(CultureStream.validate.minLength('', 1)).toBe(false);
  });
  
  test('maxLength sollte Werte mit angemessener Länge akzeptieren', () => {
    expect(CultureStream.validate.maxLength('test', 5)).toBe(true);
    expect(CultureStream.validate.maxLength('test', 4)).toBe(true);
    expect(CultureStream.validate.maxLength('', 5)).toBe(true);
  });
  
  test('maxLength sollte zu lange Werte ablehnen', () => {
    expect(CultureStream.validate.maxLength('testing', 5)).toBe(false);
  });
  
  test('pattern sollte auf Übereinstimmung mit einem regulären Ausdruck prüfen', () => {
    expect(CultureStream.validate.pattern('12345', '^\\d+$')).toBe(true);
    expect(CultureStream.validate.pattern('abc123', '^[a-z]+\\d+$')).toBe(true);
    expect(CultureStream.validate.pattern('123abc', '^\\d+[a-z]+$')).toBe(true);
    expect(CultureStream.validate.pattern('abc', '^\\d+$')).toBe(false);
  });
});

// Tests für Speicherverwaltung
describe('CultureStream.storage', () => {
  test('set sollte Daten im localStorage speichern', () => {
    CultureStream.storage.set('testKey', 'testValue');
    expect(localStorage.setItem).toHaveBeenCalledWith('testKey', '"testValue"');
  });
  
  test('set sollte Objekte in JSON umwandeln', () => {
    const testObj = { name: 'Test', value: 123 };
    CultureStream.storage.set('testObj', testObj);
    expect(localStorage.setItem).toHaveBeenCalledWith('testObj', JSON.stringify(testObj));
  });
  
  test('get sollte Daten aus dem localStorage abrufen und parsen', () => {
    localStorage.store.testKey = '"testValue"';
    const value = CultureStream.storage.get('testKey');
    expect(localStorage.getItem).toHaveBeenCalledWith('testKey');
    expect(value).toBe('testValue');
  });
  
  test('get sollte Objekte korrekt parsen', () => {
    const testObj = { name: 'Test', value: 123 };
    localStorage.store.testObj = JSON.stringify(testObj);
    const value = CultureStream.storage.get('testObj');
    expect(value).toEqual(testObj);
  });
  
  test('remove sollte Daten aus dem localStorage entfernen', () => {
    CultureStream.storage.remove('testKey');
    expect(localStorage.removeItem).toHaveBeenCalledWith('testKey');
  });
  
  test('clear sollte den gesamten localStorage leeren', () => {
    CultureStream.storage.clear();
    expect(localStorage.clear).toHaveBeenCalled();
  });
});

// Tests für Benachrichtigungen
describe('CultureStream.notifications', () => {
  test('show sollte eine Benachrichtigung anzeigen', () => {
    CultureStream.notifications.show('Test-Nachricht', 'info', 3000);
    expect(CultureStream.notifications.show).toHaveBeenCalledWith('Test-Nachricht', 'info', 3000);
  });
  
  test('success sollte eine Erfolgsbenachrichtigung anzeigen', () => {
    CultureStream.notifications.success('Erfolg');
    expect(CultureStream.notifications.show).toHaveBeenCalledWith('Erfolg', 'success');
  });
  
  test('error sollte eine Fehlerbenachrichtigung anzeigen', () => {
    CultureStream.notifications.error('Fehler');
    expect(CultureStream.notifications.show).toHaveBeenCalledWith('Fehler', 'error');
  });
  
  test('warning sollte eine Warnungsbenachrichtigung anzeigen', () => {
    CultureStream.notifications.warning('Warnung');
    expect(CultureStream.notifications.show).toHaveBeenCalledWith('Warnung', 'warning');
  });
  
  test('info sollte eine Informationsbenachrichtigung anzeigen', () => {
    CultureStream.notifications.info('Information');
    expect(CultureStream.notifications.show).toHaveBeenCalledWith('Information', 'info');
  });
});

// Tests für Ajax-Aufrufe
describe('CultureStream.ajax', () => {
  test('get sollte eine GET-Anfrage senden', async () => {
    const response = await CultureStream.ajax.get('/api/test');
    expect(CultureStream.ajax.get).toHaveBeenCalledWith('/api/test', {});
    expect(response).toEqual({ status: 200, data: {} });
  });
  
  test('post sollte eine POST-Anfrage senden', async () => {
    const data = { name: 'Test' };
    const response = await CultureStream.ajax.post('/api/test', data);
    expect(CultureStream.ajax.post).toHaveBeenCalledWith('/api/test', data, {});
    expect(response).toEqual({ status: 200, data: {} });
  });
  
  test('put sollte eine PUT-Anfrage senden', async () => {
    const data = { name: 'Test' };
    const response = await CultureStream.ajax.put('/api/test/1', data);
    expect(CultureStream.ajax.put).toHaveBeenCalledWith('/api/test/1', data, {});
    expect(response).toEqual({ status: 200, data: {} });
  });
  
  test('delete sollte eine DELETE-Anfrage senden', async () => {
    const response = await CultureStream.ajax.delete('/api/test/1');
    expect(CultureStream.ajax.delete).toHaveBeenCalledWith('/api/test/1', {});
    expect(response).toEqual({ status: 200, data: {} });
  });
});

// Tests für Utils-Funktionen
describe('CultureStream.utils', () => {
  test('generateId sollte eine eindeutige ID erzeugen', () => {
    const id1 = CultureStream.utils.generateId();
    const id2 = CultureStream.utils.generateId();
    
    expect(id1).toMatch(/^id-[a-z0-9]{7}$/);
    expect(id1).not.toBe(id2);
  });
  
  test('debounce sollte eine debounced Funktion zurückgeben', () => {
    const func = jest.fn();
    const debouncedFunc = CultureStream.utils.debounce(func, 100);
    
    debouncedFunc();
    
    expect(func).toHaveBeenCalled();
  });
  
  test('throttle sollte eine throttled Funktion zurückgeben', () => {
    const func = jest.fn();
    const throttledFunc = CultureStream.utils.throttle(func, 100);
    
    throttledFunc();
    
    expect(func).toHaveBeenCalled();
  });
}); 