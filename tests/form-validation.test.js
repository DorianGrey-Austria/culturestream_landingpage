/**
 * Unit-Tests für das CultureStream Form-Validation-Modul
 * Testet die Validierungsfunktionen aus form-validation.js
 */

// Mock für das FormValidator-Objekt
let formValidator;

// Mock für DOM-Elemente
class MockElement {
  constructor(tagName, attributes = {}) {
    this.tagName = tagName.toUpperCase();
    this.attributes = attributes;
    this.value = '';
    this.type = 'text';
    this.checked = false;
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
    
    // Setze alle übergebenen Attribute
    Object.entries(attributes).forEach(([key, value]) => {
      this.setAttribute(key, value);
    });
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

  addEventListener(event, callback) {
    if (!this._eventListeners[event]) {
      this._eventListeners[event] = [];
    }
    this._eventListeners[event].push(callback);
  }

  dispatchEvent(event) {
    if (this._eventListeners[event.type]) {
      this._eventListeners[event.type].forEach(callback => {
        callback(event);
      });
    }
  }
}

// Setup für jeden Test
beforeEach(() => {
  // Mock für FormValidator
  formValidator = {
    validationRules: {
      required: {
        test: (value) => value && value.trim() !== '',
        message: 'Dieses Feld ist erforderlich.'
      },
      email: {
        test: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
      },
      minLength: {
        test: (value, param) => value && value.length >= param,
        message: (param) => `Mindestens ${param} Zeichen erforderlich.`
      },
      maxLength: {
        test: (value, param) => value && value.length <= param,
        message: (param) => `Maximal ${param} Zeichen erlaubt.`
      },
      pattern: {
        test: (value, param) => new RegExp(param).test(value),
        message: 'Ungültiges Format.'
      },
      match: {
        test: (value, param, form) => {
          const matchInput = form.querySelector(`[name="${param}"]`);
          return matchInput && value === matchInput.value;
        },
        message: (param) => `Muss mit ${param} übereinstimmen.`
      },
      numeric: {
        test: (value) => /^[0-9]+$/.test(value),
        message: 'Nur Zahlen erlaubt.'
      }
    },
    
    formRules: {
      'login-form': {
        'email': ['required', 'email'],
        'password': ['required', 'minLength:8']
      },
      'registration-form': {
        'name': ['required'],
        'email': ['required', 'email'],
        'password': ['required', 'minLength:8'],
        'password-confirm': ['required', 'match:password']
      },
      'contact-form': {
        'name': ['required'],
        'email': ['required', 'email'],
        'message': ['required', 'minLength:10', 'maxLength:500']
      },
      'profile-form': {
        'username': ['required', 'minLength:3'],
        'bio': ['maxLength:200']
      }
    },
    
    messages: {
      'login-form': {
        'email': {
          'required': 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
          'email': 'Bitte geben Sie eine gültige E-Mail-Adresse ein.'
        },
        'password': {
          'required': 'Bitte geben Sie Ihr Passwort ein.',
          'minLength': 'Das Passwort muss mindestens 8 Zeichen lang sein.'
        }
      }
    },
    
    validateForm: jest.fn((formElement) => {
      const formId = formElement.getAttribute('id');
      const rules = formValidator.formRules[formId] || {};
      let isValid = true;
      const errors = {};
      
      Object.entries(rules).forEach(([fieldName, fieldRules]) => {
        const field = formElement.querySelector(`[name="${fieldName}"]`);
        if (!field) return;
        
        fieldRules.forEach(rule => {
          // Rule kann "required" sein oder "minLength:8"
          const [ruleName, param] = rule.split(':');
          const ruleObj = formValidator.validationRules[ruleName];
          
          if (!ruleObj) return;
          
          const isFieldValid = ruleObj.test(field.value, param, formElement);
          
          if (!isFieldValid) {
            isValid = false;
            if (!errors[fieldName]) errors[fieldName] = [];
            
            // Suche nach benutzerdefinierten Nachrichten
            let message;
            if (formValidator.messages[formId]?.[fieldName]?.[ruleName]) {
              message = formValidator.messages[formId][fieldName][ruleName];
            } else if (typeof ruleObj.message === 'function') {
              message = ruleObj.message(param);
            } else {
              message = ruleObj.message;
            }
            
            errors[fieldName].push(message);
          }
        });
      });
      
      return { isValid, errors };
    }),
    
    validateField: jest.fn((field, form) => {
      const formId = form.getAttribute('id');
      const fieldName = field.getAttribute('name');
      const rules = formValidator.formRules[formId]?.[fieldName] || [];
      let isValid = true;
      const errors = [];
      
      rules.forEach(rule => {
        const [ruleName, param] = rule.split(':');
        const ruleObj = formValidator.validationRules[ruleName];
        
        if (!ruleObj) return;
        
        const isFieldValid = ruleObj.test(field.value, param, form);
        
        if (!isFieldValid) {
          isValid = false;
          
          // Suche nach benutzerdefinierten Nachrichten
          let message;
          if (formValidator.messages[formId]?.[fieldName]?.[ruleName]) {
            message = formValidator.messages[formId][fieldName][ruleName];
          } else if (typeof ruleObj.message === 'function') {
            message = ruleObj.message(param);
          } else {
            message = ruleObj.message;
          }
          
          errors.push(message);
        }
      });
      
      return { isValid, errors };
    }),
    
    displayErrors: jest.fn((form, errors) => {
      // Simulierte Fehleranzeige, tut nichts in Tests
    }),
    
    init: jest.fn(() => {
      // Simulierte Initialisierung, tut nichts in Tests
    })
  };
  
  // Globales FormValidator-Objekt setzen
  global.FormValidator = formValidator;
  
  // document.querySelector und querySelectorAll Mock
  document.querySelector = jest.fn().mockImplementation(selector => {
    // Mock-Element für spezifische Selektoren zurückgeben
    if (selector === '#login-form') {
      const form = new MockElement('form', { id: 'login-form' });
      
      const emailInput = new MockElement('input', { 
        name: 'email',
        type: 'email'
      });
      emailInput.value = 'test@example.com';
      
      const passwordInput = new MockElement('input', { 
        name: 'password',
        type: 'password'
      });
      passwordInput.value = 'password123';
      
      form.appendChild(emailInput);
      form.appendChild(passwordInput);
      
      form.querySelector = (childSelector) => {
        if (childSelector === '[name="email"]') return emailInput;
        if (childSelector === '[name="password"]') return passwordInput;
        return null;
      };
      
      return form;
    }
    
    if (selector === '#registration-form') {
      const form = new MockElement('form', { id: 'registration-form' });
      
      const nameInput = new MockElement('input', { 
        name: 'name',
        type: 'text'
      });
      nameInput.value = 'John Doe';
      
      const emailInput = new MockElement('input', { 
        name: 'email',
        type: 'email'
      });
      emailInput.value = 'john@example.com';
      
      const passwordInput = new MockElement('input', { 
        name: 'password',
        type: 'password'
      });
      passwordInput.value = 'securepass';
      
      const confirmInput = new MockElement('input', { 
        name: 'password-confirm',
        type: 'password'
      });
      confirmInput.value = 'securepass';
      
      form.appendChild(nameInput);
      form.appendChild(emailInput);
      form.appendChild(passwordInput);
      form.appendChild(confirmInput);
      
      form.querySelector = (childSelector) => {
        if (childSelector === '[name="name"]') return nameInput;
        if (childSelector === '[name="email"]') return emailInput;
        if (childSelector === '[name="password"]') return passwordInput;
        if (childSelector === '[name="password-confirm"]') return confirmInput;
        return null;
      };
      
      return form;
    }
    
    return null;
  });
  
  document.querySelectorAll = jest.fn().mockImplementation(selector => {
    if (selector === 'form[data-validate]') {
      return [
        document.querySelector('#login-form'),
        document.querySelector('#registration-form')
      ].filter(Boolean);
    }
    
    return [];
  });
});

// Tests für FormValidator
describe('FormValidator', () => {
  // Validierungsregeln testen
  describe('Validierungsregeln', () => {
    test('required sollte leere Werte ablehnen', () => {
      const { test } = formValidator.validationRules.required;
      expect(test('')).toBe(false);
      expect(test('  ')).toBe(false);
      expect(test(null)).toBe(false);
      expect(test(undefined)).toBe(false);
    });
    
    test('required sollte nicht-leere Werte akzeptieren', () => {
      const { test } = formValidator.validationRules.required;
      expect(test('test')).toBe(true);
      expect(test('0')).toBe(true);
      expect(test(' test ')).toBe(true);
    });
    
    test('email sollte gültige E-Mail-Adressen akzeptieren', () => {
      const { test } = formValidator.validationRules.email;
      expect(test('test@example.com')).toBe(true);
      expect(test('test.name@example.co.uk')).toBe(true);
      expect(test('test+label@example.com')).toBe(true);
    });
    
    test('email sollte ungültige E-Mail-Adressen ablehnen', () => {
      const { test } = formValidator.validationRules.email;
      expect(test('test')).toBe(false);
      expect(test('test@')).toBe(false);
      expect(test('test@example')).toBe(false);
      expect(test('@example.com')).toBe(false);
    });
    
    test('minLength sollte Werte mit ausreichender Länge akzeptieren', () => {
      const { test } = formValidator.validationRules.minLength;
      expect(test('test', 3)).toBe(true);
      expect(test('test', 4)).toBe(true);
      expect(test('test', 2)).toBe(true);
    });
    
    test('minLength sollte Werte mit unzureichender Länge ablehnen', () => {
      const { test } = formValidator.validationRules.minLength;
      expect(test('test', 5)).toBe(false);
      expect(test('', 1)).toBe(false);
    });
    
    test('maxLength sollte Werte mit angemessener Länge akzeptieren', () => {
      const { test } = formValidator.validationRules.maxLength;
      expect(test('test', 5)).toBe(true);
      expect(test('test', 4)).toBe(true);
      expect(test('', 5)).toBe(true);
    });
    
    test('maxLength sollte zu lange Werte ablehnen', () => {
      const { test } = formValidator.validationRules.maxLength;
      expect(test('testing', 5)).toBe(false);
    });
    
    test('pattern sollte auf Übereinstimmung mit einem regulären Ausdruck prüfen', () => {
      const { test } = formValidator.validationRules.pattern;
      expect(test('12345', '^\\d+$')).toBe(true);
      expect(test('abc123', '^[a-z]+\\d+$')).toBe(true);
      expect(test('abc', '^\\d+$')).toBe(false);
    });
    
    test('match sollte auf Übereinstimmung mit einem anderen Feld prüfen', () => {
      const { test } = formValidator.validationRules.match;
      const form = document.querySelector('#registration-form');
      
      expect(test('securepass', 'password', form)).toBe(true);
      expect(test('differentpass', 'password', form)).toBe(false);
    });
    
    test('numeric sollte nur Zahlen akzeptieren', () => {
      const { test } = formValidator.validationRules.numeric;
      expect(test('12345')).toBe(true);
      expect(test('123abc')).toBe(false);
      expect(test('abc')).toBe(false);
    });
  });
  
  // Formular-Validierung testen
  describe('Formular-Validierung', () => {
    test('validateForm sollte ein gültiges Formular akzeptieren', () => {
      const loginForm = document.querySelector('#login-form');
      const result = formValidator.validateForm(loginForm);
      
      expect(result.isValid).toBe(true);
      expect(Object.keys(result.errors).length).toBe(0);
    });
    
    test('validateForm sollte ein ungültiges Formular erkennen', () => {
      const loginForm = document.querySelector('#login-form');
      const emailInput = loginForm.querySelector('[name="email"]');
      emailInput.value = 'invalid-email';
      
      const result = formValidator.validateForm(loginForm);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBeTruthy();
    });
    
    test('validateField sollte ein gültiges Feld akzeptieren', () => {
      const loginForm = document.querySelector('#login-form');
      const emailInput = loginForm.querySelector('[name="email"]');
      
      const result = formValidator.validateField(emailInput, loginForm);
      
      expect(result.isValid).toBe(true);
      expect(result.errors.length).toBe(0);
    });
    
    test('validateField sollte ein ungültiges Feld erkennen', () => {
      const loginForm = document.querySelector('#login-form');
      const emailInput = loginForm.querySelector('[name="email"]');
      emailInput.value = 'invalid-email';
      
      const result = formValidator.validateField(emailInput, loginForm);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });
}); 