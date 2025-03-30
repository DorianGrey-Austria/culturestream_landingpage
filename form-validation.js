/**
 * CultureStream - Formular-Validierungsmodul
 * Erweiterte Validierungsfunktionen für Formulare
 */

// Namespace für Validierungsfunktionen
window.CultureStream = window.CultureStream || {};
CultureStream.validation = CultureStream.validation || {};

(function() {
    'use strict';
    
    // Regex-Muster für Validierung
    const patterns = {
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        url: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
        phone: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
        password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
        zipCode: /^\d{5}(-\d{4})?$/,
        date: /^(\d{4})-(\d{2})-(\d{2})$/,
        time: /^([01]\d|2[0-3]):([0-5]\d)$/,
        creditCard: /^\d{4}[- ]?\d{4}[- ]?\d{4}[- ]?\d{4}$/,
        alphanumeric: /^[a-zA-Z0-9]+$/,
        alphabetic: /^[a-zA-Z]+$/,
        numeric: /^\d+$/
    };
    
    // Fehlermeldungen für Validierungen
    const errorMessages = {
        required: 'Dieses Feld ist erforderlich.',
        email: 'Bitte geben Sie eine gültige E-Mail-Adresse ein.',
        url: 'Bitte geben Sie eine gültige URL ein.',
        phone: 'Bitte geben Sie eine gültige Telefonnummer ein.',
        password: 'Das Passwort muss mindestens 8 Zeichen lang sein und mindestens einen Großbuchstaben, einen Kleinbuchstaben und eine Zahl enthalten.',
        minLength: 'Dieses Feld muss mindestens {0} Zeichen enthalten.',
        maxLength: 'Dieses Feld darf maximal {0} Zeichen enthalten.',
        zipCode: 'Bitte geben Sie eine gültige Postleitzahl ein.',
        date: 'Bitte geben Sie ein gültiges Datum im Format YYYY-MM-DD ein.',
        time: 'Bitte geben Sie eine gültige Uhrzeit im Format HH:MM ein.',
        match: 'Dieses Feld muss mit dem Feld {0} übereinstimmen.',
        number: 'Bitte geben Sie eine gültige Zahl ein.',
        range: 'Bitte geben Sie einen Wert zwischen {0} und {1} ein.',
        creditCard: 'Bitte geben Sie eine gültige Kreditkartennummer ein.',
        alphanumeric: 'Dieses Feld darf nur Buchstaben und Zahlen enthalten.',
        alphabetic: 'Dieses Feld darf nur Buchstaben enthalten.',
        numeric: 'Dieses Feld darf nur Zahlen enthalten.',
        minChecked: 'Bitte wählen Sie mindestens {0} Option(en) aus.',
        maxChecked: 'Bitte wählen Sie maximal {0} Option(en) aus.'
    };
    
    /**
     * Text mit Parametern formatieren
     * @param {string} text - Text mit Platzhaltern {0}, {1}, ...
     * @param {...*} args - Werte für Platzhalter
     * @returns {string} Formatierter Text
     */
    function formatString(text, ...args) {
        return text.replace(/{(\d+)}/g, (match, index) => {
            return typeof args[index] !== 'undefined' ? args[index] : match;
        });
    }
    
    /**
     * Element-Zustand nach Validierung aktualisieren
     * @param {Element} element - Zu aktualisierendes Element
     * @param {boolean} isValid - Validierungsergebnis
     * @param {string} [errorMessage] - Fehlermeldung bei ungültiger Eingabe
     */
    function updateElementState(element, isValid, errorMessage) {
        // Bestehende Fehlermeldung entfernen
        const existingError = element.parentNode.querySelector('.form-error');
        if (existingError) {
            existingError.remove();
        }
        
        // CSS-Klassen aktualisieren
        if (isValid) {
            element.classList.remove('is-invalid');
            element.classList.add('is-valid');
            element.setAttribute('aria-invalid', 'false');
        } else {
            element.classList.remove('is-valid');
            element.classList.add('is-invalid');
            element.setAttribute('aria-invalid', 'true');
            
            // Fehlermeldung anzeigen
            if (errorMessage) {
                const errorEl = document.createElement('div');
                errorEl.className = 'form-error';
                errorEl.setAttribute('aria-live', 'polite');
                errorEl.textContent = errorMessage;
                
                // ARIA-Attribut für bessere Zugänglichkeit
                const errorId = `error-${element.id || Math.random().toString(36).substr(2, 9)}`;
                errorEl.id = errorId;
                element.setAttribute('aria-describedby', errorId);
                
                element.parentNode.appendChild(errorEl);
            }
        }
    }
    
    /**
     * Formularfeld validieren
     * @param {Element} field - Zu validierendes Feld
     * @param {Object} rules - Validierungsregeln
     * @param {HTMLFormElement} form - Übergeordnetes Formular
     * @returns {boolean} Validierungsergebnis
     */
    function validateField(field, rules, form) {
        // Wenn keine Regeln definiert sind, ist das Feld gültig
        if (!rules || Object.keys(rules).length === 0) {
            updateElementState(field, true);
            return true;
        }
        
        let isValid = true;
        let errorMessage = '';
        
        // Wert des Feldes abrufen
        let value = '';
        
        if (field.type === 'checkbox') {
            value = field.checked;
        } else if (field.type === 'radio') {
            const radioGroup = form.querySelectorAll(`input[name="${field.name}"]:checked`);
            value = radioGroup.length > 0;
        } else if (field.type === 'select-multiple') {
            value = Array.from(field.selectedOptions).map(option => option.value);
        } else if (field.type === 'file') {
            value = field.files;
        } else {
            value = field.value.trim();
        }
        
        // Pflichtfeld-Prüfung
        if (rules.required) {
            if ((field.type === 'checkbox' && !value) || 
                (field.type === 'radio' && !value) || 
                (field.type === 'select-multiple' && value.length === 0) || 
                (field.type === 'file' && (!value || value.length === 0)) || 
                (value === '')) {
                
                isValid = false;
                errorMessage = rules.requiredMessage || errorMessages.required;
            }
        }
        
        // Wenn das Feld leer ist und nicht erforderlich, weitere Validierungen überspringen
        if (value === '' && !rules.required) {
            updateElementState(field, true);
            return true;
        }
        
        // Nur weitere Validierungen durchführen, wenn bisher gültig
        if (isValid) {
            // E-Mail-Validierung
            if (rules.email && !patterns.email.test(value)) {
                isValid = false;
                errorMessage = rules.emailMessage || errorMessages.email;
            }
            
            // URL-Validierung
            else if (rules.url && !patterns.url.test(value)) {
                isValid = false;
                errorMessage = rules.urlMessage || errorMessages.url;
            }
            
            // Telefonnummer-Validierung
            else if (rules.phone && !patterns.phone.test(value)) {
                isValid = false;
                errorMessage = rules.phoneMessage || errorMessages.phone;
            }
            
            // Passwort-Validierung
            else if (rules.password && !patterns.password.test(value)) {
                isValid = false;
                errorMessage = rules.passwordMessage || errorMessages.password;
            }
            
            // Min-Länge-Prüfung
            else if (rules.minLength && value.length < rules.minLength) {
                isValid = false;
                errorMessage = rules.minLengthMessage || formatString(errorMessages.minLength, rules.minLength);
            }
            
            // Max-Länge-Prüfung
            else if (rules.maxLength && value.length > rules.maxLength) {
                isValid = false;
                errorMessage = rules.maxLengthMessage || formatString(errorMessages.maxLength, rules.maxLength);
            }
            
            // Übereinstimmung mit anderem Feld
            else if (rules.match) {
                const matchField = form.querySelector(`[name="${rules.match}"]`);
                if (matchField && value !== matchField.value) {
                    isValid = false;
                    const fieldLabel = matchField.dataset.label || matchField.name;
                    errorMessage = rules.matchMessage || formatString(errorMessages.match, fieldLabel);
                }
            }
            
            // Zahlenbereich-Prüfung
            else if (rules.range && rules.range.min !== undefined && rules.range.max !== undefined) {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < rules.range.min || numValue > rules.range.max) {
                    isValid = false;
                    errorMessage = rules.rangeMessage || formatString(errorMessages.range, rules.range.min, rules.range.max);
                }
            }
            
            // Benutzerdefiniertes Muster
            else if (rules.pattern && !rules.pattern.test(value)) {
                isValid = false;
                errorMessage = rules.patternMessage || 'Das Format ist ungültig.';
            }
            
            // Vordefinierte Muster
            else if (rules.type) {
                if (patterns[rules.type] && !patterns[rules.type].test(value)) {
                    isValid = false;
                    errorMessage = rules.typeMessage || errorMessages[rules.type] || `Ungültiges Format für ${rules.type}.`;
                }
            }
            
            // Benutzerdefinierte Validierungsfunktion
            else if (rules.custom && typeof rules.custom === 'function') {
                const customResult = rules.custom(value, field, form);
                if (customResult !== true) {
                    isValid = false;
                    errorMessage = typeof customResult === 'string' ? customResult : 'Ungültige Eingabe.';
                }
            }
            
            // Checkbox-Gruppe-Validierung (min/max ausgewählt)
            else if (field.type === 'checkbox' && field.name.endsWith('[]')) {
                const checkboxGroup = form.querySelectorAll(`input[name="${field.name}"]:checked`);
                const checkedCount = checkboxGroup.length;
                
                if (rules.minChecked && checkedCount < rules.minChecked) {
                    isValid = false;
                    errorMessage = rules.minCheckedMessage || formatString(errorMessages.minChecked, rules.minChecked);
                }
                else if (rules.maxChecked && checkedCount > rules.maxChecked) {
                    isValid = false;
                    errorMessage = rules.maxCheckedMessage || formatString(errorMessages.maxChecked, rules.maxChecked);
                }
            }
        }
        
        // Element-Zustand aktualisieren
        updateElementState(field, isValid, errorMessage);
        
        return isValid;
    }
    
    /**
     * Live-Validierung für ein Formularfeld einrichten
     * @param {Element} field - Formularfeld
     * @param {Object} rules - Validierungsregeln
     * @param {HTMLFormElement} form - Übergeordnetes Formular
     */
    function setupLiveValidation(field, rules, form) {
        if (!field || !rules) return;
        
        // Passende Events basierend auf Feldtyp
        let events = ['blur']; // Standard: Validierung beim Verlassen des Feldes
        
        if (field.type === 'checkbox' || field.type === 'radio' || field.type === 'select-one' || field.type === 'select-multiple') {
            events = ['change'];
        } else if (rules.validateOnType) {
            // Bei input-Event validieren (jede Tastatureingabe)
            events.push('input');
        }
        
        // Event-Listener hinzufügen
        events.forEach(eventType => {
            field.addEventListener(eventType, function() {
                validateField(field, rules, form);
            });
        });
    }
    
    /**
     * Gesamtes Formular validieren
     * @param {HTMLFormElement|string} form - Formular oder Formular-Selektor
     * @param {Object} schema - Validierungsschema (Feld-Name -> Regeln)
     * @param {Object} [options] - Zusätzliche Optionen
     * @returns {boolean} Validierungsergebnis
     */
    function validateForm(form, schema, options = {}) {
        // Standardoptionen
        const defaults = {
            liveValidation: true,
            scrollToError: true,
            errorClass: 'is-invalid',
            validClass: 'is-valid',
            errorMessageClass: 'form-error'
        };
        
        const settings = { ...defaults, ...options };
        
        // Form-Element abrufen
        const formEl = typeof form === 'string' ? document.querySelector(form) : form;
        
        if (!formEl || !schema) {
            console.error('Formular oder Schema nicht gefunden');
            return false;
        }
        
        // Bestehende Fehlermeldungen entfernen
        const errorElements = formEl.querySelectorAll(`.${settings.errorMessageClass}`);
        errorElements.forEach(el => el.remove());
        
        let isValid = true;
        const fieldsWithErrors = [];
        
        // Live-Validierung einrichten
        if (settings.liveValidation) {
            for (const fieldName in schema) {
                if (schema.hasOwnProperty(fieldName)) {
                    // Bei Checkbox-Gruppen alle Felder selektieren
                    if (fieldName.endsWith('[]')) {
                        const checkboxes = formEl.querySelectorAll(`[name="${fieldName}"]`);
                        checkboxes.forEach(checkbox => {
                            setupLiveValidation(checkbox, schema[fieldName], formEl);
                        });
                    } else {
                        const field = formEl.querySelector(`[name="${fieldName}"]`);
                        setupLiveValidation(field, schema[fieldName], formEl);
                    }
                }
            }
        }
        
        // Jedes Feld validieren
        for (const fieldName in schema) {
            if (schema.hasOwnProperty(fieldName)) {
                const rules = schema[fieldName];
                
                // Bei Checkbox-Gruppen nur ein Feld validieren
                if (fieldName.endsWith('[]')) {
                    const firstCheckbox = formEl.querySelector(`[name="${fieldName}"]`);
                    if (firstCheckbox && !validateField(firstCheckbox, rules, formEl)) {
                        isValid = false;
                        fieldsWithErrors.push(firstCheckbox);
                    }
                } else {
                    const field = formEl.querySelector(`[name="${fieldName}"]`);
                    if (field && !validateField(field, rules, formEl)) {
                        isValid = false;
                        fieldsWithErrors.push(field);
                    }
                }
            }
        }
        
        // Zum ersten Fehlerfeld scrollen
        if (!isValid && settings.scrollToError && fieldsWithErrors.length > 0) {
            const firstErrorField = fieldsWithErrors[0];
            firstErrorField.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstErrorField.focus();
        }
        
        return isValid;
    }
    
    /**
     * Validierungsschema erstellen
     * @param {Object} schemaObj - Schema als Objekt
     * @returns {Object} Validierungsschema
     */
    function createSchema(schemaObj) {
        return schemaObj;
    }
    
    /**
     * Formularwerte als Objekt abrufen
     * @param {HTMLFormElement|string} form - Formular oder Formular-Selektor
     * @returns {Object} Formularwerte als Key-Value-Paare
     */
    function getFormValues(form) {
        const formEl = typeof form === 'string' ? document.querySelector(form) : form;
        if (!formEl) return {};
        
        const formData = new FormData(formEl);
        const values = {};
        
        for (const [key, value] of formData.entries()) {
            // Checkbox-Gruppen als Arrays behandeln
            if (key.endsWith('[]')) {
                const cleanKey = key.substring(0, key.length - 2);
                if (!values[cleanKey]) {
                    values[cleanKey] = [];
                }
                values[cleanKey].push(value);
            } else {
                values[key] = value;
            }
        }
        
        return values;
    }
    
    /**
     * Werte in ein Formular eintragen
     * @param {HTMLFormElement|string} form - Formular oder Formular-Selektor
     * @param {Object} values - Einzutragende Werte
     */
    function setFormValues(form, values) {
        const formEl = typeof form === 'string' ? document.querySelector(form) : form;
        if (!formEl || !values) return;
        
        for (const key in values) {
            if (values.hasOwnProperty(key)) {
                const value = values[key];
                
                // Array-Werte für Checkboxen und Multiselect
                if (Array.isArray(value)) {
                    // Checkboxen
                    const checkboxes = formEl.querySelectorAll(`[name="${key}[]"]`);
                    if (checkboxes.length > 0) {
                        checkboxes.forEach(checkbox => {
                            checkbox.checked = value.includes(checkbox.value);
                        });
                    }
                    
                    // Multiselect
                    const multiSelect = formEl.querySelector(`select[name="${key}"][multiple]`);
                    if (multiSelect) {
                        Array.from(multiSelect.options).forEach(option => {
                            option.selected = value.includes(option.value);
                        });
                    }
                } 
                // Radio-Buttons
                else if (formEl.querySelectorAll(`[name="${key}"][type="radio"]`).length > 0) {
                    const radio = formEl.querySelector(`[name="${key}"][value="${value}"]`);
                    if (radio) {
                        radio.checked = true;
                    }
                }
                // Checkboxen (einzeln)
                else if (formEl.querySelector(`[name="${key}"][type="checkbox"]`)) {
                    formEl.querySelector(`[name="${key}"]`).checked = !!value;
                }
                // Andere Felder
                else {
                    const field = formEl.querySelector(`[name="${key}"]`);
                    if (field) {
                        field.value = value;
                    }
                }
            }
        }
    }
    
    /**
     * Formular zurücksetzen und Validierungsstatus entfernen
     * @param {HTMLFormElement|string} form - Formular oder Formular-Selektor
     */
    function resetForm(form) {
        const formEl = typeof form === 'string' ? document.querySelector(form) : form;
        if (!formEl) return;
        
        // Formular zurücksetzen
        formEl.reset();
        
        // Validierungsstatus entfernen
        const fields = formEl.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('is-valid', 'is-invalid');
            field.removeAttribute('aria-invalid');
            field.removeAttribute('aria-describedby');
        });
        
        // Fehlermeldungen entfernen
        const errorMessages = formEl.querySelectorAll('.form-error');
        errorMessages.forEach(el => el.remove());
    }
    
    // Öffentliche API
    CultureStream.validation = {
        validateForm: validateForm,
        validateField: validateField,
        createSchema: createSchema,
        getFormValues: getFormValues,
        setFormValues: setFormValues,
        resetForm: resetForm,
        patterns: patterns,
        errorMessages: errorMessages
    };
    
})(); 