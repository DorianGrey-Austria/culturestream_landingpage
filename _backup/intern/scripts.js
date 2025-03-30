/**
 * CultureStream.js
 * Ein leichtgewichtiges Framework für die CultureStream-Plattform
 * Version: 1.0.0
 */

const CultureStream = (function() {
    'use strict';

    // Private Variablen und Funktionen
    let _initialized = false;
    let _readyCallbacks = [];
    
    // DOM-Manipulation
    const dom = {
        /**
         * Element per ID, Klasse oder Selektor finden
         * @param {string} selector - Der CSS-Selektor
         * @param {HTMLElement} [context=document] - Der Kontext, in dem gesucht wird
         * @returns {HTMLElement|null} Das gefundene Element oder null
         */
        get: function(selector, context = document) {
            return context.querySelector(selector);
        },
        
        /**
         * Alle Elemente per Selektor finden
         * @param {string} selector - Der CSS-Selektor
         * @param {HTMLElement} [context=document] - Der Kontext, in dem gesucht wird
         * @returns {NodeList} Die gefundenen Elemente
         */
        getAll: function(selector, context = document) {
            return context.querySelectorAll(selector);
        },
        
        /**
         * Event-Listener hinzufügen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} event - Der Event-Typ (z.B. 'click')
         * @param {Function} callback - Die Callback-Funktion
         * @param {boolean} [useCapture=false] - Event-Bubbling-Verhalten
         */
        on: function(element, event, callback, useCapture = false) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.addEventListener(event, callback, useCapture);
            }
        },
        
        /**
         * Event-Listener entfernen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} event - Der Event-Typ (z.B. 'click')
         * @param {Function} callback - Die Callback-Funktion
         */
        off: function(element, event, callback) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.removeEventListener(event, callback);
            }
        },
        
        /**
         * CSS-Klasse hinzufügen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} className - Die hinzuzufügende Klasse
         */
        addClass: function(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.classList.add(className);
            }
        },
        
        /**
         * CSS-Klasse entfernen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} className - Die zu entfernende Klasse
         */
        removeClass: function(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.classList.remove(className);
            }
        },
        
        /**
         * CSS-Klasse umschalten
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} className - Die umzuschaltende Klasse
         * @returns {boolean} Gibt zurück, ob die Klasse hinzugefügt (true) oder entfernt (false) wurde
         */
        toggleClass: function(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                return element.classList.toggle(className);
            }
            
            return false;
        },
        
        /**
         * Prüfen, ob ein Element eine CSS-Klasse hat
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} className - Die zu prüfende Klasse
         * @returns {boolean} Gibt zurück, ob das Element die Klasse hat
         */
        hasClass: function(element, className) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                return element.classList.contains(className);
            }
            
            return false;
        },
        
        /**
         * Element erstellen
         * @param {string} tag - Der Tag-Name
         * @param {Object} [attributes] - Attribute, die gesetzt werden sollen
         * @param {string} [text] - Textinhalt
         * @returns {HTMLElement} Das erstellte Element
         */
        create: function(tag, attributes = {}, text = '') {
            const element = document.createElement(tag);
            
            for (const key in attributes) {
                if (attributes.hasOwnProperty(key)) {
                    element.setAttribute(key, attributes[key]);
                }
            }
            
            if (text) {
                element.textContent = text;
            }
            
            return element;
        },
        
        /**
         * Kind-Element hinzufügen
         * @param {HTMLElement|string} parent - Das Elternelement oder ein Selektor
         * @param {HTMLElement} child - Das Kind-Element
         */
        append: function(parent, child) {
            if (typeof parent === 'string') {
                parent = this.get(parent);
            }
            
            if (parent) {
                parent.appendChild(child);
            }
        },
        
        /**
         * HTML-Inhalt setzen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} html - Der HTML-Inhalt
         */
        html: function(element, html) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.innerHTML = html;
            }
        },
        
        /**
         * Text-Inhalt setzen
         * @param {HTMLElement|string} element - Das Element oder ein Selektor
         * @param {string} text - Der Text-Inhalt
         */
        text: function(element, text) {
            if (typeof element === 'string') {
                element = this.get(element);
            }
            
            if (element) {
                element.textContent = text;
            }
        }
    };
    
    // Formular-Validierung
    const validation = {
        /**
         * Prüft, ob ein Formularfeld leer ist
         * @param {string} value - Der zu prüfende Wert
         * @returns {boolean} true, wenn der Wert gültig ist (nicht leer)
         */
        required: function(value) {
            return value.trim() !== '';
        },
        
        /**
         * Prüft, ob ein Wert eine gültige E-Mail-Adresse ist
         * @param {string} value - Der zu prüfende Wert
         * @returns {boolean} true, wenn der Wert eine gültige E-Mail-Adresse ist
         */
        email: function(value) {
            const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            return regex.test(value);
        },
        
        /**
         * Prüft, ob ein Wert eine Mindestlänge hat
         * @param {string} value - Der zu prüfende Wert
         * @param {number} length - Die Mindestlänge
         * @returns {boolean} true, wenn der Wert die Mindestlänge hat
         */
        minLength: function(value, length) {
            return value.length >= length;
        },
        
        /**
         * Prüft, ob ein Wert eine Maximallänge hat
         * @param {string} value - Der zu prüfende Wert
         * @param {number} length - Die Maximallänge
         * @returns {boolean} true, wenn der Wert die Maximallänge nicht überschreitet
         */
        maxLength: function(value, length) {
            return value.length <= length;
        },
        
        /**
         * Prüft, ob ein Wert eine gültige Ganzzahl ist
         * @param {string} value - Der zu prüfende Wert
         * @returns {boolean} true, wenn der Wert eine gültige Ganzzahl ist
         */
        integer: function(value) {
            return /^-?\d+$/.test(value);
        },
        
        /**
         * Prüft, ob ein Wert eine gültige Fließkommazahl ist
         * @param {string} value - Der zu prüfende Wert
         * @returns {boolean} true, wenn der Wert eine gültige Fließkommazahl ist
         */
        decimal: function(value) {
            return /^-?\d+(\.\d+)?$/.test(value);
        },
        
        /**
         * Prüft, ob ein Wert einem regulären Ausdruck entspricht
         * @param {string} value - Der zu prüfende Wert
         * @param {RegExp} regex - Der reguläre Ausdruck
         * @returns {boolean} true, wenn der Wert dem regulären Ausdruck entspricht
         */
        pattern: function(value, regex) {
            return regex.test(value);
        },
        
        /**
         * Validiert ein Formular
         * @param {HTMLFormElement|string} form - Das Formular oder ein Selektor
         * @param {Object} rules - Die Validierungsregeln
         * @param {Object} [messages] - Benutzerdefinierte Fehlermeldungen
         * @returns {Object} Validierungsergebnis mit isValid und errors
         */
        validateForm: function(form, rules, messages = {}) {
            if (typeof form === 'string') {
                form = dom.get(form);
            }
            
            if (!form) {
                return { isValid: false, errors: { _global: 'Formular nicht gefunden' } };
            }
            
            const result = { isValid: true, errors: {} };
            
            for (const fieldName in rules) {
                if (rules.hasOwnProperty(fieldName)) {
                    const field = form.elements[fieldName];
                    
                    if (!field) {
                        console.warn(`Feld "${fieldName}" nicht im Formular gefunden.`);
                        continue;
                    }
                    
                    const fieldRules = rules[fieldName];
                    const value = field.value;
                    
                    for (const rule in fieldRules) {
                        if (fieldRules.hasOwnProperty(rule)) {
                            const param = fieldRules[rule];
                            let isValid = true;
                            
                            switch (rule) {
                                case 'required':
                                    isValid = !param || this.required(value);
                                    break;
                                case 'email':
                                    isValid = !param || value === '' || this.email(value);
                                    break;
                                case 'minLength':
                                    isValid = value === '' || this.minLength(value, param);
                                    break;
                                case 'maxLength':
                                    isValid = this.maxLength(value, param);
                                    break;
                                case 'integer':
                                    isValid = !param || value === '' || this.integer(value);
                                    break;
                                case 'decimal':
                                    isValid = !param || value === '' || this.decimal(value);
                                    break;
                                case 'pattern':
                                    isValid = !param || value === '' || this.pattern(value, param);
                                    break;
                            }
                            
                            if (!isValid) {
                                result.isValid = false;
                                
                                const message = messages[fieldName] && messages[fieldName][rule]
                                    ? messages[fieldName][rule]
                                    : this._getDefaultMessage(rule, fieldName, param);
                                
                                if (!result.errors[fieldName]) {
                                    result.errors[fieldName] = [];
                                }
                                
                                result.errors[fieldName].push(message);
                                break; // Brich bei erstem Fehler ab
                            }
                        }
                    }
                }
            }
            
            return result;
        },
        
        /**
         * Hilfsfunktion für Standard-Fehlermeldungen
         * @private
         * @param {string} rule - Die Regel
         * @param {string} fieldName - Der Feldname
         * @param {*} param - Der Parameter
         * @returns {string} Die Fehlermeldung
         */
        _getDefaultMessage: function(rule, fieldName, param) {
            const fieldLabel = fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1');
            
            switch (rule) {
                case 'required':
                    return `${fieldLabel} ist erforderlich.`;
                case 'email':
                    return `Bitte gib eine gültige E-Mail-Adresse ein.`;
                case 'minLength':
                    return `${fieldLabel} muss mindestens ${param} Zeichen lang sein.`;
                case 'maxLength':
                    return `${fieldLabel} darf höchstens ${param} Zeichen lang sein.`;
                case 'integer':
                    return `${fieldLabel} muss eine Ganzzahl sein.`;
                case 'decimal':
                    return `${fieldLabel} muss eine Zahl sein.`;
                case 'pattern':
                    return `${fieldLabel} hat ein ungültiges Format.`;
                default:
                    return `${fieldLabel} ist ungültig.`;
            }
        }
    };
    
    // Benachrichtigungen
    const notifications = (function() {
        let container = null;
        let autoHide = true;
        let autoHideDuration = 5000;
        let position = 'top-right';
        
        /**
         * Container für Benachrichtigungen erstellen
         * @private
         */
        function _createContainer() {
            if (container) return;
            
            container = dom.create('div', { class: `notification-container ${position}` });
            dom.append(document.body, container);
        }
        
        /**
         * Benachrichtigung erstellen
         * @private
         * @param {string} message - Die Nachricht
         * @param {string} type - Der Typ (info, success, warning, error)
         */
        function _createNotification(message, type) {
            _createContainer();
            
            const notification = dom.create('div', { class: `notification notification-${type}` });
            
            const icon = dom.create('div', { class: 'notification-icon' });
            let iconClass = '';
            
            switch (type) {
                case 'success':
                    iconClass = 'fa fa-check-circle';
                    break;
                case 'warning':
                    iconClass = 'fa fa-exclamation-triangle';
                    break;
                case 'error':
                    iconClass = 'fa fa-times-circle';
                    break;
                default:
                    iconClass = 'fa fa-info-circle';
            }
            
            icon.innerHTML = `<i class="${iconClass}"></i>`;
            
            const content = dom.create('div', { class: 'notification-content' }, message);
            const closeBtn = dom.create('button', { class: 'notification-close' });
            closeBtn.innerHTML = '&times;';
            
            dom.append(notification, icon);
            dom.append(notification, content);
            dom.append(notification, closeBtn);
            dom.append(container, notification);
            
            // Close-Button-Event
            dom.on(closeBtn, 'click', function() {
                _removeNotification(notification);
            });
            
            // Auto-Hide
            if (autoHide) {
                setTimeout(function() {
                    _removeNotification(notification);
                }, autoHideDuration);
            }
            
            // Animation
            setTimeout(function() {
                dom.addClass(notification, 'show');
            }, 10);
            
            return notification;
        }
        
        /**
         * Benachrichtigung entfernen
         * @private
         * @param {HTMLElement} notification - Das Benachrichtigungselement
         */
        function _removeNotification(notification) {
            dom.removeClass(notification, 'show');
            
            setTimeout(function() {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }
        
        return {
            /**
             * Info-Benachrichtigung anzeigen
             * @param {string} message - Die Nachricht
             * @returns {HTMLElement} Das Benachrichtigungselement
             */
            info: function(message) {
                return _createNotification(message, 'info');
            },
            
            /**
             * Erfolgs-Benachrichtigung anzeigen
             * @param {string} message - Die Nachricht
             * @returns {HTMLElement} Das Benachrichtigungselement
             */
            success: function(message) {
                return _createNotification(message, 'success');
            },
            
            /**
             * Warnungs-Benachrichtigung anzeigen
             * @param {string} message - Die Nachricht
             * @returns {HTMLElement} Das Benachrichtigungselement
             */
            warning: function(message) {
                return _createNotification(message, 'warning');
            },
            
            /**
             * Fehler-Benachrichtigung anzeigen
             * @param {string} message - Die Nachricht
             * @returns {HTMLElement} Das Benachrichtigungselement
             */
            error: function(message) {
                return _createNotification(message, 'error');
            },
            
            /**
             * Konfiguration der Benachrichtigungen
             * @param {Object} options - Die Konfigurationsoptionen
             * @param {boolean} [options.autoHide] - Automatisches Ausblenden
             * @param {number} [options.autoHideDuration] - Dauer bis zum Ausblenden
             * @param {string} [options.position] - Position (top-right, top-left, bottom-right, bottom-left)
             */
            config: function(options) {
                if (options.autoHide !== undefined) {
                    autoHide = !!options.autoHide;
                }
                
                if (options.autoHideDuration !== undefined) {
                    autoHideDuration = options.autoHideDuration;
                }
                
                if (options.position !== undefined) {
                    position = options.position;
                    
                    if (container) {
                        container.className = `notification-container ${position}`;
                    }
                }
            }
        };
    })();
    
    // AJAX-Funktionen
    const ajax = {
        /**
         * AJAX-Request senden
         * @param {Object} options - Die Request-Optionen
         * @param {string} options.url - Die URL
         * @param {string} [options.method='GET'] - Die HTTP-Methode
         * @param {Object} [options.data] - Die zu sendenden Daten
         * @param {string} [options.responseType='json'] - Der erwartete Antworttyp
         * @param {Object} [options.headers] - Die HTTP-Header
         * @param {Function} [options.success] - Die Success-Callback-Funktion
         * @param {Function} [options.error] - Die Error-Callback-Funktion
         * @param {boolean} [options.async=true] - Asynchroner Request
         * @returns {Promise} Ein Promise, das bei Erfolg oder Fehler aufgelöst wird
         */
        request: function(options) {
            const defaults = {
                method: 'GET',
                data: null,
                responseType: 'json',
                headers: {},
                success: null,
                error: null,
                async: true
            };
            
            const settings = {...defaults, ...options};
            
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                
                xhr.open(settings.method, settings.url, settings.async);
                
                xhr.responseType = settings.responseType;
                
                // CSRF-Token hinzufügen, falls vorhanden
                const csrfToken = document.querySelector('meta[name="csrf-token"]');
                if (csrfToken) {
                    xhr.setRequestHeader('X-CSRF-Token', csrfToken.getAttribute('content'));
                }
                
                // Content-Type setzen für POST-Requests
                if (settings.method.toUpperCase() === 'POST' && !settings.headers['Content-Type']) {
                    xhr.setRequestHeader('Content-Type', 'application/json');
                }
                
                // Benutzerdefinierte Header hinzufügen
                for (const header in settings.headers) {
                    if (settings.headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header, settings.headers[header]);
                    }
                }
                
                xhr.onload = function() {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        const response = xhr.response;
                        
                        if (typeof settings.success === 'function') {
                            settings.success(response, xhr);
                        }
                        
                        resolve(response);
                    } else {
                        const error = new Error(`Request failed with status ${xhr.status}`);
                        error.response = xhr;
                        
                        if (typeof settings.error === 'function') {
                            settings.error(error, xhr);
                        }
                        
                        reject(error);
                    }
                };
                
                xhr.onerror = function() {
                    const error = new Error('Network error');
                    error.response = xhr;
                    
                    if (typeof settings.error === 'function') {
                        settings.error(error, xhr);
                    }
                    
                    reject(error);
                };
                
                if (settings.data) {
                    const data = settings.method.toUpperCase() === 'GET'
                        ? null
                        : typeof settings.data === 'object'
                            ? JSON.stringify(settings.data)
                            : settings.data;
                    
                    xhr.send(data);
                } else {
                    xhr.send();
                }
            });
        },
        
        /**
         * GET-Request senden
         * @param {string} url - Die URL
         * @param {Object} [options] - Die Request-Optionen
         * @returns {Promise} Ein Promise, das bei Erfolg oder Fehler aufgelöst wird
         */
        get: function(url, options = {}) {
            return this.request({...options, url, method: 'GET'});
        },
        
        /**
         * POST-Request senden
         * @param {string} url - Die URL
         * @param {Object} data - Die zu sendenden Daten
         * @param {Object} [options] - Die Request-Optionen
         * @returns {Promise} Ein Promise, das bei Erfolg oder Fehler aufgelöst wird
         */
        post: function(url, data, options = {}) {
            return this.request({...options, url, method: 'POST', data});
        },
        
        /**
         * PUT-Request senden
         * @param {string} url - Die URL
         * @param {Object} data - Die zu sendenden Daten
         * @param {Object} [options] - Die Request-Optionen
         * @returns {Promise} Ein Promise, das bei Erfolg oder Fehler aufgelöst wird
         */
        put: function(url, data, options = {}) {
            return this.request({...options, url, method: 'PUT', data});
        },
        
        /**
         * DELETE-Request senden
         * @param {string} url - Die URL
         * @param {Object} [options] - Die Request-Optionen
         * @returns {Promise} Ein Promise, das bei Erfolg oder Fehler aufgelöst wird
         */
        delete: function(url, options = {}) {
            return this.request({...options, url, method: 'DELETE'});
        }
    };
    
    // Hilfsfunktionen
    const utils = {
        /**
         * Erzeugt eine eindeutige ID
         * @returns {string} Eine eindeutige ID
         */
        uniqueId: function() {
            return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
        },
        
        /**
         * Formatiert ein Datum
         * @param {Date|string} date - Das zu formatierende Datum
         * @param {string} [format='dd.MM.yyyy'] - Das Format
         * @returns {string} Das formatierte Datum
         */
        formatDate: function(date, format = 'dd.MM.yyyy') {
            const d = typeof date === 'string' ? new Date(date) : date;
            
            if (isNaN(d.getTime())) {
                return '';
            }
            
            const day = d.getDate().toString().padStart(2, '0');
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            const year = d.getFullYear();
            const hours = d.getHours().toString().padStart(2, '0');
            const minutes = d.getMinutes().toString().padStart(2, '0');
            const seconds = d.getSeconds().toString().padStart(2, '0');
            
            return format
                .replace('dd', day)
                .replace('MM', month)
                .replace('yyyy', year)
                .replace('HH', hours)
                .replace('mm', minutes)
                .replace('ss', seconds);
        },
        
        /**
         * Verzögert die Ausführung einer Funktion
         * @param {Function} func - Die zu verzögernde Funktion
         * @param {number} wait - Die Verzögerungszeit in Millisekunden
         * @param {Object} options - Optionen
         * @param {boolean} [options.leading=false] - Führe die Funktion am Anfang aus
         * @param {boolean} [options.trailing=true] - Führe die Funktion am Ende aus
         * @returns {Function} Die verzögerte Funktion
         */
        debounce: function(func, wait, options = {}) {
            let timeout;
            let lastArgs;
            let lastThis;
            let result;
            const leading = options.leading === true;
            const trailing = options.trailing !== false;
            
            return function() {
                const now = Date.now();
                
                lastArgs = arguments;
                lastThis = this;
                
                if (timeout) {
                    clearTimeout(timeout);
                }
                
                timeout = setTimeout(function() {
                    timeout = null;
                    
                    if (trailing) {
                        result = func.apply(lastThis, lastArgs);
                    }
                    
                    lastArgs = lastThis = null;
                }, wait);
                
                if (leading && !timeout) {
                    result = func.apply(this, arguments);
                }
                
                return result;
            };
        },
        
        /**
         * Begrenzt die Ausführungshäufigkeit einer Funktion
         * @param {Function} func - Die zu begrenzende Funktion
         * @param {number} limit - Die Mindestzeit zwischen Ausführungen in Millisekunden
         * @param {Object} options - Optionen
         * @param {boolean} [options.leading=true] - Führe die Funktion am Anfang aus
         * @param {boolean} [options.trailing=false] - Führe die Funktion am Ende aus
         * @returns {Function} Die begrenzte Funktion
         */
        throttle: function(func, limit, options = {}) {
            let inThrottle;
            let lastTime = 0;
            let lastArgs;
            let lastThis;
            let timeout;
            let result;
            const leading = options.leading !== false;
            const trailing = options.trailing === true;
            
            return function() {
                const now = Date.now();
                const timeSinceLastCall = now - lastTime;
                
                lastArgs = arguments;
                lastThis = this;
                
                if (!inThrottle && leading) {
                    result = func.apply(this, arguments);
                    lastTime = now;
                    inThrottle = true;
                }
                
                clearTimeout(timeout);
                
                if (timeSinceLastCall >= limit) {
                    inThrottle = false;
                    
                    if (!leading) {
                        result = func.apply(lastThis, lastArgs);
                        lastTime = now;
                    }
                } else if (trailing) {
                    timeout = setTimeout(function() {
                        inThrottle = false;
                        result = func.apply(lastThis, lastArgs);
                        lastTime = Date.now();
                        
                        lastArgs = lastThis = null;
                    }, limit - timeSinceLastCall);
                }
                
                return result;
            };
        }
    };
    
    // Initialisierung
    function init() {
        if (_initialized) return;
        
        // Event-Listener für DOM-Ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                _initialized = true;
                _readyCallbacks.forEach(function(callback) {
                    callback();
                });
                _readyCallbacks = [];
            });
        } else {
            _initialized = true;
            _readyCallbacks.forEach(function(callback) {
                callback();
            });
            _readyCallbacks = [];
        }
        
        // CSS für Benachrichtigungen hinzufügen
        const style = document.createElement('style');
        style.textContent = `
            .notification-container {
                position: fixed;
                z-index: 9999;
                max-width: 320px;
                width: 100%;
            }
            
            .notification-container.top-right {
                top: 20px;
                right: 20px;
            }
            
            .notification-container.top-left {
                top: 20px;
                left: 20px;
            }
            
            .notification-container.bottom-right {
                bottom: 20px;
                right: 20px;
            }
            
            .notification-container.bottom-left {
                bottom: 20px;
                left: 20px;
            }
            
            .notification {
                display: flex;
                align-items: center;
                padding: 15px;
                margin-bottom: 10px;
                border-radius: 4px;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
                background-color: #fff;
                transform: translateY(-20px);
                opacity: 0;
                transition: transform 0.3s ease, opacity 0.3s ease;
            }
            
            .notification.show {
                transform: translateY(0);
                opacity: 1;
            }
            
            .notification-icon {
                margin-right: 10px;
                font-size: 1.5em;
            }
            
            .notification-content {
                flex: 1;
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5em;
                cursor: pointer;
                margin-left: 10px;
                padding: 0;
                line-height: 1;
            }
            
            .notification-info {
                border-left: 4px solid #3D7B80;
            }
            
            .notification-info .notification-icon {
                color: #3D7B80;
            }
            
            .notification-success {
                border-left: 4px solid #28a745;
            }
            
            .notification-success .notification-icon {
                color: #28a745;
            }
            
            .notification-warning {
                border-left: 4px solid #ffc107;
            }
            
            .notification-warning .notification-icon {
                color: #ffc107;
            }
            
            .notification-error {
                border-left: 4px solid #dc3545;
            }
            
            .notification-error .notification-icon {
                color: #dc3545;
            }
        `;
        document.head.appendChild(style);
    }
    
    // Öffentliche API
    return {
        /**
         * Initialisiert CultureStream
         * @returns {Object} Die CultureStream-Instanz
         */
        init: function() {
            init();
            return this;
        },
        
        /**
         * Registriert eine Callback-Funktion, die ausgeführt wird, wenn das DOM bereit ist
         * @param {Function} callback - Die Callback-Funktion
         * @returns {Object} Die CultureStream-Instanz
         */
        ready: function(callback) {
            if (_initialized) {
                callback();
            } else {
                _readyCallbacks.push(callback);
            }
            
            return this;
        },
        
        /**
         * DOM-Manipulationsfunktionen
         */
        dom,
        
        /**
         * Validierungsfunktionen
         */
        validation,
        
        /**
         * Benachrichtigungsfunktionen
         */
        notifications,
        
        /**
         * AJAX-Funktionen
         */
        ajax,
        
        /**
         * Hilfsfunktionen
         */
        utils
    };
})();

// Automatische Initialisierung
CultureStream.init(); 