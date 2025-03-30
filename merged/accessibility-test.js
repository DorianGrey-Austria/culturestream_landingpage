/**
 * CultureStream Accessibility Test Tool
 * 
 * Dieses Skript führt automatisierte Tests für Barrierefreiheit durch
 * und hilft, WCAG 2.1 AA-Konformität sicherzustellen.
 * 
 * Version: 1.0.0
 */

const AccessibilityTester = (function() {
    'use strict';
    
    // Konfiguration
    const config = {
        logResults: true,
        showVisualFeedback: true,
        autoScroll: false,
        testCategories: ['images', 'headings', 'links', 'forms', 'landmarks', 'keyboard', 'contrast', 'aria']
    };
    
    // Ergebnissammlung
    const testResults = {
        passed: [],
        warnings: [],
        failed: [],
        summary: {
            total: 0,
            passed: 0,
            warnings: 0,
            failed: 0
        }
    };
    
    /**
     * Hilfsfunktionen
     */
    
    // Ergebnis protokollieren
    function logResult(type, message, element, rule) {
        const result = {
            type,
            message,
            element: element ? element.outerHTML.substring(0, 100) + (element.outerHTML.length > 100 ? '...' : '') : null,
            rule,
            timestamp: new Date().toISOString()
        };
        
        if (type === 'pass') {
            testResults.passed.push(result);
            testResults.summary.passed++;
        } else if (type === 'warning') {
            testResults.warnings.push(result);
            testResults.summary.warnings++;
        } else if (type === 'fail') {
            testResults.failed.push(result);
            testResults.summary.failed++;
        }
        
        testResults.summary.total++;
        
        if (config.logResults) {
            if (type === 'pass') {
                console.log('%c✓ PASS: ' + message, 'color: green', element);
            } else if (type === 'warning') {
                console.log('%c⚠ WARNING: ' + message, 'color: orange', element);
            } else if (type === 'fail') {
                console.log('%c✗ FAIL: ' + message, 'color: red', element);
            }
        }
        
        if (config.showVisualFeedback && element) {
            const originalOutline = element.style.outline;
            const originalPosition = element.style.position;
            
            element.style.position = 'relative';
            
            if (type === 'fail') {
                element.style.outline = '3px solid red';
            } else if (type === 'warning') {
                element.style.outline = '3px solid orange';
            } else if (type === 'pass') {
                element.style.outline = '3px solid green';
            }
            
            setTimeout(() => {
                element.style.outline = originalOutline;
                element.style.position = originalPosition;
            }, 3000);
        }
    }
    
    // Kontrast zwischen Farben berechnen
    function calculateContrast(fgColor, bgColor) {
        function getLuminance(color) {
            // RGB in sRGB Luminanz umwandeln
            const rgb = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
            if (!rgb) return 0;
            
            const r = parseInt(rgb[1], 10) / 255;
            const g = parseInt(rgb[2], 10) / 255;
            const b = parseInt(rgb[3], 10) / 255;
            
            const R = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
            const G = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
            const B = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
            
            return 0.2126 * R + 0.7152 * G + 0.0722 * B;
        }
        
        const L1 = getLuminance(fgColor);
        const L2 = getLuminance(bgColor);
        
        // Kontrastverhältnis berechnen
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    }
    
    // Elemente nach Inline-Styles auf Kontrast prüfen
    function getComputedStylesForContrastCheck(element) {
        const computedStyle = window.getComputedStyle(element);
        return {
            color: computedStyle.color,
            backgroundColor: computedStyle.backgroundColor
        };
    }
    
    /**
     * Test-Kategorien
     */
    
    // Bilder testen
    function testImages() {
        const images = document.querySelectorAll('img');
        
        images.forEach(img => {
            // Alt-Text für Bilder prüfen
            if (!img.hasAttribute('alt')) {
                logResult('fail', 'Bild ohne alt-Attribut gefunden', img, 'WCAG 1.1.1 (A)');
            } else if (img.alt === '') {
                // Leeres alt-Attribut ist legitim für dekorative Bilder
                if (!img.hasAttribute('role') || img.getAttribute('role') !== 'presentation') {
                    logResult('warning', 'Bild mit leerem alt-Attribut, aber ohne role="presentation"', img, 'WCAG 1.1.1 (A)');
                } else {
                    logResult('pass', 'Dekoratives Bild korrekt mit leerem alt-Attribut und role="presentation"', img, 'WCAG 1.1.1 (A)');
                }
            } else if (img.alt.toLowerCase().includes('bild') || img.alt.toLowerCase().includes('image')) {
                logResult('warning', 'Alt-Text enthält möglicherweise überflüssige Wörter wie "Bild" oder "Image"', img, 'WCAG 1.1.1 (A)');
            } else if (img.alt.length > 100) {
                logResult('warning', 'Alt-Text ist sehr lang (über 100 Zeichen)', img, 'Best Practice');
            } else {
                logResult('pass', 'Bild hat angemessenen Alt-Text', img, 'WCAG 1.1.1 (A)');
            }
            
            // Responsive Bilder prüfen
            if (!img.hasAttribute('width') || !img.hasAttribute('height')) {
                logResult('warning', 'Bild ohne width/height-Attribute kann Layout-Shifts verursachen', img, 'Best Practice');
            }
        });
    }
    
    // Überschriften testen
    function testHeadings() {
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const headingLevels = [];
        
        headings.forEach(heading => {
            const level = parseInt(heading.tagName.substring(1), 10);
            headingLevels.push(level);
            
            // Prüfen, ob Überschriften leer sind
            if (heading.textContent.trim() === '') {
                logResult('fail', `Leere Überschrift (${heading.tagName}) gefunden`, heading, 'WCAG 2.4.6 (AA)');
            } else {
                logResult('pass', `Überschrift (${heading.tagName}) mit Inhalt gefunden`, heading, 'WCAG 2.4.6 (AA)');
            }
        });
        
        // Überschriftenhierarchie prüfen
        if (headingLevels.length > 0) {
            if (headingLevels[0] !== 1) {
                logResult('warning', 'Die erste Überschrift auf der Seite ist keine H1', document.querySelector(headingLevels[0]), 'WCAG 1.3.1 (A)');
            }
            
            for (let i = 1; i < headingLevels.length; i++) {
                if (headingLevels[i] > headingLevels[i-1] + 1) {
                    logResult('warning', `Überschriftenlevel werden übersprungen: von H${headingLevels[i-1]} zu H${headingLevels[i]}`, document.querySelectorAll('h' + headingLevels[i])[0], 'WCAG 1.3.1 (A)');
                }
            }
        } else {
            logResult('warning', 'Keine Überschriften auf der Seite gefunden', document.body, 'WCAG 1.3.1 (A)');
        }
        
        // Prüfen, ob es mehr als eine H1 gibt
        const h1Elements = document.querySelectorAll('h1');
        if (h1Elements.length > 1) {
            logResult('warning', `Mehrere H1-Überschriften gefunden (${h1Elements.length})`, h1Elements[0], 'Best Practice');
        } else if (h1Elements.length === 1) {
            logResult('pass', 'Eine H1-Überschrift gefunden', h1Elements[0], 'Best Practice');
        }
    }
    
    // Links testen
    function testLinks() {
        const links = document.querySelectorAll('a');
        
        links.forEach(link => {
            // Prüfen auf leere Links
            if (link.textContent.trim() === '' && !link.querySelector('img[alt]') && !link.getAttribute('aria-label')) {
                logResult('fail', 'Link ohne Text oder zugänglichen Namen gefunden', link, 'WCAG 2.4.4 (A)');
            }
            
            // Prüfen auf generische Linktexte
            const linkText = link.textContent.trim().toLowerCase();
            if (linkText === 'klicken sie hier' || linkText === 'hier klicken' || linkText === 'hier' || linkText === 'mehr' || linkText === 'weiter') {
                logResult('warning', `Link mit unspezifischem Text gefunden: "${link.textContent.trim()}"`, link, 'WCAG 2.4.4 (A)');
            }
            
            // Prüfen auf Fokus-Styles
            const linkStyle = window.getComputedStyle(link);
            const linkFocusStyle = window.getComputedStyle(link, ':focus');
            
            if (linkStyle.outline === linkFocusStyle.outline && linkStyle.backgroundColor === linkFocusStyle.backgroundColor) {
                logResult('warning', 'Link hat möglicherweise keinen sichtbaren Fokus-Stil', link, 'WCAG 2.4.7 (AA)');
            }
            
            // Prüfen auf externe Links
            if (link.getAttribute('href') && link.getAttribute('href').startsWith('http') && !link.getAttribute('rel').includes('noopener')) {
                logResult('warning', 'Externer Link ohne rel="noopener" gefunden', link, 'Best Practice');
            }
        });
        
        // Prüfen auf Duplicate-Links
        const linkTexts = {};
        links.forEach(link => {
            const text = link.textContent.trim();
            if (text && text.length > 0) {
                if (!linkTexts[text]) {
                    linkTexts[text] = [];
                }
                linkTexts[text].push(link);
            }
        });
        
        Object.keys(linkTexts).forEach(text => {
            if (linkTexts[text].length > 1) {
                const hrefCount = new Set(linkTexts[text].map(link => link.getAttribute('href'))).size;
                if (hrefCount > 1) {
                    logResult('warning', `Mehrere Links mit gleichem Text ("${text}"), aber unterschiedlichen Zielen gefunden`, linkTexts[text][0], 'WCAG 2.4.4 (A)');
                }
            }
        });
    }
    
    // Formulare testen
    function testForms() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Prüfen auf leere Formulare
            if (form.elements.length === 0) {
                logResult('warning', 'Leeres Formular gefunden', form, 'Best Practice');
            }
            
            // Prüfen auf Submit-Button
            const hasSubmitButton = form.querySelector('button[type="submit"], input[type="submit"]');
            if (!hasSubmitButton) {
                logResult('warning', 'Formular ohne expliziten Submit-Button gefunden', form, 'WCAG 3.2.2 (A)');
            }
        });
        
        // Prüfen auf Labels bei Eingabefeldern
        const inputElements = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]):not([type="reset"]), select, textarea');
        
        inputElements.forEach(input => {
            const hasExplicitLabel = document.querySelector(`label[for="${input.id}"]`);
            const hasImplicitLabel = input.closest('label');
            const hasAriaLabel = input.getAttribute('aria-label');
            const hasAriaLabelledBy = input.getAttribute('aria-labelledby');
            
            if (!hasExplicitLabel && !hasImplicitLabel && !hasAriaLabel && !hasAriaLabelledBy) {
                logResult('fail', 'Eingabefeld ohne Label oder ARIA-Kennzeichnung gefunden', input, 'WCAG 1.3.1 (A), 3.3.2 (A)');
            } else {
                logResult('pass', 'Eingabefeld mit korrektem Label gefunden', input, 'WCAG 1.3.1 (A), 3.3.2 (A)');
            }
            
            // Pflichtfelder prüfen
            if (input.hasAttribute('required') || input.getAttribute('aria-required') === 'true') {
                const hasRequiredIndicator = document.querySelector(`label[for="${input.id}"] .required, label[for="${input.id}"] .required-field`);
                
                if (!hasRequiredIndicator && !input.getAttribute('aria-describedby')) {
                    logResult('warning', 'Pflichtfeld ohne visuellen Indikator oder Beschreibung gefunden', input, 'WCAG 3.3.2 (A)');
                }
            }
        });
    }
    
    // Landmarks testen
    function testLandmarks() {
        // Prüfen auf Hauptlandmarks
        const hasHeader = !!document.querySelector('header, [role="banner"]');
        const hasMain = !!document.querySelector('main, [role="main"]');
        const hasNav = !!document.querySelector('nav, [role="navigation"]');
        const hasFooter = !!document.querySelector('footer, [role="contentinfo"]');
        
        if (!hasHeader) {
            logResult('warning', 'Kein <header> oder [role="banner"] Landmark gefunden', document.body, 'WCAG 1.3.1 (A)');
        } else {
            logResult('pass', '<header> oder [role="banner"] Landmark gefunden', document.querySelector('header, [role="banner"]'), 'WCAG 1.3.1 (A)');
        }
        
        if (!hasMain) {
            logResult('warning', 'Kein <main> oder [role="main"] Landmark gefunden', document.body, 'WCAG 1.3.1 (A)');
        } else {
            logResult('pass', '<main> oder [role="main"] Landmark gefunden', document.querySelector('main, [role="main"]'), 'WCAG 1.3.1 (A)');
        }
        
        if (!hasNav) {
            logResult('warning', 'Kein <nav> oder [role="navigation"] Landmark gefunden', document.body, 'WCAG 1.3.1 (A)');
        } else {
            logResult('pass', '<nav> oder [role="navigation"] Landmark gefunden', document.querySelector('nav, [role="navigation"]'), 'WCAG 1.3.1 (A)');
        }
        
        if (!hasFooter) {
            logResult('warning', 'Kein <footer> oder [role="contentinfo"] Landmark gefunden', document.body, 'WCAG 1.3.1 (A)');
        } else {
            logResult('pass', '<footer> oder [role="contentinfo"] Landmark gefunden', document.querySelector('footer, [role="contentinfo"]'), 'WCAG 1.3.1 (A)');
        }
        
        // Prüfen auf multiple landmarks des gleichen Typs ohne eindeutige Labels
        const navElements = document.querySelectorAll('nav, [role="navigation"]');
        if (navElements.length > 1) {
            let unlabeledNavs = 0;
            navElements.forEach(nav => {
                if (!nav.getAttribute('aria-label') && !nav.getAttribute('aria-labelledby')) {
                    unlabeledNavs++;
                }
            });
            
            if (unlabeledNavs > 1) {
                logResult('warning', `Mehrere Navigations-Landmarks ohne eindeutige Labels gefunden (${unlabeledNavs})`, navElements[0], 'WCAG 1.3.1 (A)');
            }
        }
    }
    
    // Keyboard-Navigation testen
    function testKeyboard() {
        // Tabindex größer als 0 suchen
        const elementsWithTabindex = document.querySelectorAll('[tabindex]');
        
        elementsWithTabindex.forEach(element => {
            const tabindex = parseInt(element.getAttribute('tabindex'), 10);
            if (tabindex > 0) {
                logResult('warning', `Element mit tabindex="${tabindex}" gefunden. Werte > 0 können die natürliche Tab-Reihenfolge stören.`, element, 'WCAG 2.4.3 (A)');
            } else if (tabindex === 0) {
                if (!element.matches('a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"], [role="tab"]')) {
                    logResult('warning', 'Element mit tabindex="0" ist möglicherweise nicht für Tastaturinteraktion optimiert', element, 'WCAG 2.1.1 (A)');
                }
            }
        });
        
        // Prüfen auf potenziell nicht-tastatur-zugängliche Elemente
        const clickableElements = document.querySelectorAll('[onclick], [onmousedown], [onmouseup]');
        clickableElements.forEach(element => {
            if (!element.matches('a, button, input, select, textarea, [role="button"], [role="link"], [role="checkbox"], [role="radio"]')) {
                logResult('warning', 'Element mit Maus-Event, aber ohne entsprechende Rolle oder tastaturzugänglichen Ereignishandler', element, 'WCAG 2.1.1 (A)');
            }
        });
    }
    
    // Kontraste testen
    function testContrast() {
        // Text-Elemente sammeln, ausgenommen sehr kleine Elemente, die wahrscheinlich Symbole oder Icons sind
        const textElements = Array.from(document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, span, div, label, li'))
            .filter(el => {
                const text = el.textContent.trim();
                // Nur Elemente mit sichtbarem Text berücksichtigen
                return text.length > 0 && window.getComputedStyle(el).display !== 'none' && window.getComputedStyle(el).visibility !== 'hidden';
            });
        
        let testedElements = 0;
        const maxElementsToTest = 50; // Beschränken auf 50 Elemente, um Performance zu erhalten
        
        for (const element of textElements) {
            if (testedElements >= maxElementsToTest) break;
            
            // Berechnete Stile für Text und Hintergrund
            const styles = getComputedStylesForContrastCheck(element);
            
            // Ungültige oder transparente Farben überspringen
            if (!styles.color.startsWith('rgb') || !styles.backgroundColor.startsWith('rgb') || 
                styles.backgroundColor === 'rgba(0, 0, 0, 0)' || styles.backgroundColor.endsWith('0)')) {
                continue;
            }
            
            testedElements++;
            
            // Kontrastverhältnis berechnen
            const contrastRatio = calculateContrast(styles.color, styles.backgroundColor);
            
            // Schriftgröße bestimmen
            const fontSize = parseFloat(window.getComputedStyle(element).fontSize);
            const fontWeight = window.getComputedStyle(element).fontWeight;
            
            // Größerer Text = Schrift > 18pt oder fett > 14pt
            const isLargeText = fontSize >= 24 || (fontSize >= 18.66 && (fontWeight >= 700 || fontWeight === 'bold'));
            
            // WCAG AA Kriterien: 4.5:1 für normalen Text, 3:1 für großen Text
            const minimumRatio = isLargeText ? 3 : 4.5;
            
            if (contrastRatio < minimumRatio) {
                logResult('fail', `Unzureichendes Kontrastverhältnis: ${contrastRatio.toFixed(2)}:1 (Minimum: ${minimumRatio}:1)`, element, 'WCAG 1.4.3 (AA)');
            } else {
                logResult('pass', `Ausreichendes Kontrastverhältnis: ${contrastRatio.toFixed(2)}:1 (Minimum: ${minimumRatio}:1)`, element, 'WCAG 1.4.3 (AA)');
            }
        }
    }
    
    // ARIA-Attribute testen
    function testAria() {
        // Nach ARIA-Attributen suchen
        const elementsWithAria = document.querySelectorAll('[aria-*]');
        
        elementsWithAria.forEach(element => {
            // Prüfen auf aria-label ohne entsprechenden Inhalt
            if (element.hasAttribute('aria-label') && element.getAttribute('aria-label').trim() === '') {
                logResult('fail', 'Element mit leerem aria-label gefunden', element, 'WCAG 4.1.2 (A)');
            }
            
            // Prüfen auf aria-labelledby mit nicht-existierendem Ziel
            if (element.hasAttribute('aria-labelledby')) {
                const ids = element.getAttribute('aria-labelledby').split(' ');
                const missingIds = ids.filter(id => !document.getElementById(id));
                
                if (missingIds.length > 0) {
                    logResult('fail', `aria-labelledby verweist auf nicht-existierende ID(s): ${missingIds.join(', ')}`, element, 'WCAG 4.1.2 (A)');
                }
            }
            
            // Prüfen auf aria-describedby mit nicht-existierendem Ziel
            if (element.hasAttribute('aria-describedby')) {
                const ids = element.getAttribute('aria-describedby').split(' ');
                const missingIds = ids.filter(id => !document.getElementById(id));
                
                if (missingIds.length > 0) {
                    logResult('fail', `aria-describedby verweist auf nicht-existierende ID(s): ${missingIds.join(', ')}`, element, 'WCAG 4.1.2 (A)');
                }
            }
            
            // Prüfen auf ungültige ARIA-Rollen
            if (element.hasAttribute('role')) {
                const role = element.getAttribute('role');
                const validRoles = [
                    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
                    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
                    'contentinfo', 'definition', 'dialog', 'directory', 'document',
                    'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
                    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
                    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
                    'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
                    'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
                    'rowheader', 'scrollbar', 'search', 'searchbox', 'separator',
                    'slider', 'spinbutton', 'status', 'switch', 'tab', 'table',
                    'tablist', 'tabpanel', 'term', 'textbox', 'timer', 'toolbar',
                    'tooltip', 'tree', 'treegrid', 'treeitem'
                ];
                
                if (!validRoles.includes(role)) {
                    logResult('fail', `Ungültige ARIA-Rolle gefunden: "${role}"`, element, 'WCAG 4.1.2 (A)');
                }
            }
        });
        
        // Prüfen auf korrekte Verwendung von aria-hidden
        const elementsWithAriaHidden = document.querySelectorAll('[aria-hidden="true"]');
        
        elementsWithAriaHidden.forEach(element => {
            // Prüfen auf fokussierbare Elemente mit aria-hidden="true"
            const focusableElements = element.querySelectorAll('a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
            
            if (focusableElements.length > 0) {
                logResult('fail', 'Element mit aria-hidden="true" enthält fokussierbare Elemente', element, 'WCAG 4.1.2 (A)');
            }
        });
    }
    
    /**
     * Öffentliche API
     */
    return {
        // Konfiguration anpassen
        configure: function(options) {
            if (options) {
                Object.keys(options).forEach(key => {
                    if (config.hasOwnProperty(key)) {
                        config[key] = options[key];
                    }
                });
            }
            return this;
        },
        
        // Alle Tests ausführen
        runAllTests: function() {
            console.log('%c🔍 CultureStream Accessibility Tests gestartet', 'font-weight: bold; font-size: 16px; color: #3D7B80;');
            
            // Teste alle konfigurierten Kategorien
            config.testCategories.forEach(category => {
                switch(category) {
                    case 'images':
                        testImages();
                        break;
                    case 'headings':
                        testHeadings();
                        break;
                    case 'links':
                        testLinks();
                        break;
                    case 'forms':
                        testForms();
                        break;
                    case 'landmarks':
                        testLandmarks();
                        break;
                    case 'keyboard':
                        testKeyboard();
                        break;
                    case 'contrast':
                        testContrast();
                        break;
                    case 'aria':
                        testAria();
                        break;
                }
            });
            
            // Zusammenfassung ausgeben
            console.log(
                '%c📊 Zusammenfassung der Accessibility Tests', 
                'font-weight: bold; font-size: 16px; color: #3D7B80;',
                '\n✅ Bestanden: ' + testResults.summary.passed + 
                '\n⚠️ Warnungen: ' + testResults.summary.warnings + 
                '\n❌ Fehler: ' + testResults.summary.failed + 
                '\n🔢 Gesamt: ' + testResults.summary.total
            );
            
            return testResults;
        },
        
        // Nur bestimmte Tests ausführen
        runTests: function(categories) {
            if (Array.isArray(categories) && categories.length > 0) {
                const tempCategories = [...config.testCategories];
                config.testCategories = categories;
                this.runAllTests();
                config.testCategories = tempCategories;
            } else {
                console.error('Bitte geben Sie ein Array von Test-Kategorien an');
            }
            return this;
        },
        
        // Ergebnisse zurücksetzen
        resetResults: function() {
            testResults.passed = [];
            testResults.warnings = [];
            testResults.failed = [];
            testResults.summary = {
                total: 0,
                passed: 0,
                warnings: 0,
                failed: 0
            };
            return this;
        },
        
        // Ergebnisse exportieren
        exportResults: function(format = 'json') {
            if (format === 'json') {
                return JSON.stringify(testResults, null, 2);
            } else if (format === 'html') {
                let html = '<div class="a11y-test-results">';
                html += '<h2>Accessibility Test Ergebnisse</h2>';
                
                html += '<div class="a11y-summary">';
                html += `<p>Gesamt: ${testResults.summary.total} Tests</p>`;
                html += `<p class="a11y-passed">Bestanden: ${testResults.summary.passed}</p>`;
                html += `<p class="a11y-warnings">Warnungen: ${testResults.summary.warnings}</p>`;
                html += `<p class="a11y-failed">Fehler: ${testResults.summary.failed}</p>`;
                html += '</div>';
                
                if (testResults.failed.length > 0) {
                    html += '<h3>Fehler</h3>';
                    html += '<ul class="a11y-failed-list">';
                    testResults.failed.forEach(result => {
                        html += `<li>${result.message} (${result.rule})</li>`;
                    });
                    html += '</ul>';
                }
                
                if (testResults.warnings.length > 0) {
                    html += '<h3>Warnungen</h3>';
                    html += '<ul class="a11y-warnings-list">';
                    testResults.warnings.forEach(result => {
                        html += `<li>${result.message} (${result.rule})</li>`;
                    });
                    html += '</ul>';
                }
                
                html += '</div>';
                return html;
            } else {
                console.error('Unbekanntes Export-Format. Unterstützte Formate: json, html');
                return null;
            }
        },
        
        // WCAG 2.1 AA Konformität überprüfen
        checkWCAGConformance: function() {
            this.resetResults();
            this.runAllTests();
            
            const hasErrors = testResults.failed.length > 0;
            const hasWarnings = testResults.warnings.length > 0;
            
            let conformanceLevel = 'None';
            if (!hasErrors && !hasWarnings) {
                conformanceLevel = 'AAA';
            } else if (!hasErrors) {
                conformanceLevel = 'AA';
            } else if (testResults.failed.length <= 3) {
                conformanceLevel = 'A';
            }
            
            console.log(
                '%c🏆 WCAG 2.1 Konformitätsprüfung', 
                'font-weight: bold; font-size: 16px; color: #3D7B80;',
                `\nDie Seite erreicht das WCAG 2.1 Konformitätsniveau: ${conformanceLevel}`
            );
            
            return {
                conformanceLevel,
                hasErrors,
                hasWarnings,
                errorCount: testResults.failed.length,
                warningCount: testResults.warnings.length
            };
        }
    };
})();

// Automatische Ausführung, wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    // Timeout zum Sicherstellen, dass alle Skripte geladen sind
    setTimeout(function() {
        // AccessibilityTester anpassen und starten
        AccessibilityTester
            .configure({
                logResults: true,
                showVisualFeedback: true
            })
            .runAllTests();
    }, 1000);
}); 