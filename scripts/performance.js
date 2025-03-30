/**
 * CultureStream Performance-Optimierungen
 * 
 * Dieses Modul implementiert verschiedene Performance-Optimierungen:
 * - Lazy-Loading für Bilder und Komponenten
 * - Code-Splitting für JavaScript
 * - Ressourcen-Prefetching
 * - Runtime-Performance-Optimierungen
 */

// Namespace im globalen CultureStream-Objekt
window.CultureStream = window.CultureStream || {};
window.CultureStream.performance = (function() {
  'use strict';

  /**
   * Konfiguration für Performance-Optimierungen
   */
  const config = {
    lazyLoad: {
      threshold: 0.1, // 10% des Elements müssen sichtbar sein
      rootMargin: '200px 0px', // 200px vor dem Viewport laden
      placeholderClass: 'cs-lazy-placeholder',
      loadingClass: 'cs-lazy-loading',
      loadedClass: 'cs-lazy-loaded',
      errorClass: 'cs-lazy-error'
    },
    prefetch: {
      links: true, // Links vorladen
      delay: 100, // Verzögerung vor dem Prefetching
      threshold: 0.1, // 10% des Links müssen sichtbar sein
      ignorePatterns: [/\.(pdf|zip|rar|gz)$/i] // Dateitypen ignorieren
    },
    codeSplitting: {
      enabled: true,
      chunkSize: 30 * 1024, // 30 KB 
      modulePrefix: 'cs-module-' // Prefix für dynamisch geladene Module
    }
  };

  /**
   * Speicher für geladene Module und Ressourcen
   */
  const moduleCache = new Map();
  const loadedResources = new Set();

  /**
   * Intersection Observer für Lazy-Loading
   */
  const setupLazyLoadObserver = () => {
    const options = {
      root: null,
      rootMargin: config.lazyLoad.rootMargin,
      threshold: config.lazyLoad.threshold
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        const element = entry.target;
        
        if (element.tagName === 'IMG') {
          lazyLoadImage(element);
        } else if (element.hasAttribute('data-cs-lazy-component')) {
          lazyLoadComponent(element);
        } else if (element.hasAttribute('data-cs-lazy-html')) {
          lazyLoadHTML(element);
        }
        
        observer.unobserve(element);
      });
    }, options);

    return observer;
  };

  /**
   * Lazy-Loading für Bilder
   */
  const lazyLoadImage = (img) => {
    const src = img.getAttribute('data-src');
    const srcset = img.getAttribute('data-srcset');
    const sizes = img.getAttribute('data-sizes');
    
    if (!src && !srcset) return;
    
    img.classList.add(config.lazyLoad.loadingClass);
    
    const loadHandler = () => {
      img.classList.remove(config.lazyLoad.loadingClass);
      img.classList.add(config.lazyLoad.loadedClass);
      loadedResources.add(src);
      
      img.removeEventListener('load', loadHandler);
      img.removeEventListener('error', errorHandler);
    };
    
    const errorHandler = () => {
      img.classList.remove(config.lazyLoad.loadingClass);
      img.classList.add(config.lazyLoad.errorClass);
      
      img.removeEventListener('load', loadHandler);
      img.removeEventListener('error', errorHandler);
      
      console.error(`Failed to lazy-load image: ${src}`);
    };
    
    img.addEventListener('load', loadHandler);
    img.addEventListener('error', errorHandler);
    
    if (srcset) img.srcset = srcset;
    if (sizes) img.sizes = sizes;
    if (src) img.src = src;
  };

  /**
   * Lazy-Loading für HTML-Komponenten
   */
  const lazyLoadHTML = (container) => {
    const url = container.getAttribute('data-cs-lazy-html');
    if (!url || loadedResources.has(url)) return;
    
    container.classList.add(config.lazyLoad.loadingClass);
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status}`);
        }
        return response.text();
      })
      .then(html => {
        container.innerHTML = html;
        container.classList.remove(config.lazyLoad.loadingClass);
        container.classList.add(config.lazyLoad.loadedClass);
        loadedResources.add(url);
        
        // Neue Lazy-Load-Elemente innerhalb des geladenen HTML registrieren
        initLazyLoad(container);
      })
      .catch(error => {
        container.classList.remove(config.lazyLoad.loadingClass);
        container.classList.add(config.lazyLoad.errorClass);
        console.error(`Failed to lazy-load HTML: ${url}`, error);
      });
  };

  /**
   * Lazy-Loading für Komponenten mit JavaScript
   */
  const lazyLoadComponent = (container) => {
    const componentName = container.getAttribute('data-cs-lazy-component');
    if (!componentName) return;
    
    container.classList.add(config.lazyLoad.loadingClass);
    
    loadModule(`components/${componentName}`)
      .then(module => {
        if (typeof module.init === 'function') {
          module.init(container);
        }
        container.classList.remove(config.lazyLoad.loadingClass);
        container.classList.add(config.lazyLoad.loadedClass);
      })
      .catch(error => {
        container.classList.remove(config.lazyLoad.loadingClass);
        container.classList.add(config.lazyLoad.errorClass);
        console.error(`Failed to lazy-load component: ${componentName}`, error);
      });
  };

  /**
   * Dynamisches Laden von JS-Modulen (Code-Splitting)
   */
  const loadModule = (moduleName) => {
    // Prüfen, ob das Modul bereits geladen wurde
    if (moduleCache.has(moduleName)) {
      return Promise.resolve(moduleCache.get(moduleName));
    }
    
    const moduleUrl = `/js/modules/${moduleName}.js`;
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = moduleUrl;
      script.async = true;
      
      script.onload = () => {
        // Es wird erwartet, dass das Modul sich selbst unter
        // window.CultureStream.modules[moduleName] registriert
        const module = window.CultureStream.modules && 
                      window.CultureStream.modules[moduleName];
        
        if (module) {
          moduleCache.set(moduleName, module);
          resolve(module);
        } else {
          reject(new Error(`Module ${moduleName} did not register itself properly`));
        }
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load module: ${moduleName}`));
      };
      
      document.head.appendChild(script);
    });
  };

  /**
   * Prefetching von Links und Ressourcen
   */
  const setupPrefetching = () => {
    if (!config.prefetch.links) return;
    
    const prefetchObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        
        const link = entry.target;
        const href = link.getAttribute('href');
        
        if (!href || isIgnoredPrefetchURL(href) || loadedResources.has(href)) return;
        
        // Verzögerung hinzufügen, um Priorität zu setzen
        setTimeout(() => {
          const prefetchLink = document.createElement('link');
          prefetchLink.rel = 'prefetch';
          prefetchLink.href = href;
          document.head.appendChild(prefetchLink);
          loadedResources.add(href);
        }, config.prefetch.delay);
        
        prefetchObserver.unobserve(link);
      });
    }, {
      threshold: config.prefetch.threshold
    });
    
    // Alle Links auf der Seite beobachten
    document.querySelectorAll('a[href^="/"]:not([data-no-prefetch])').forEach(link => {
      prefetchObserver.observe(link);
    });
  };

  /**
   * Prüft, ob eine URL für Prefetching ignoriert werden soll
   */
  const isIgnoredPrefetchURL = (url) => {
    return config.prefetch.ignorePatterns.some(pattern => pattern.test(url));
  };

  /**
   * Optimiert Runtime-Performance durch Throttling und Debouncing
   */
  const optimizeRuntimePerformance = () => {
    // Scroll- und Resize-Events optimieren
    let scrollTicking = false;
    let resizeTicking = false;
    
    // Originale Event-Handler speichern
    const originalScrollHandlers = window.onscroll ? [window.onscroll] : [];
    const originalResizeHandlers = window.onresize ? [window.onresize] : [];
    
    // Scroll-Event optimieren
    window.addEventListener('scroll', (e) => {
      if (!scrollTicking) {
        window.requestAnimationFrame(() => {
          originalScrollHandlers.forEach(handler => {
            if (typeof handler === 'function') handler(e);
          });
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    });
    
    // Resize-Event optimieren
    window.addEventListener('resize', (e) => {
      if (!resizeTicking) {
        window.requestAnimationFrame(() => {
          originalResizeHandlers.forEach(handler => {
            if (typeof handler === 'function') handler(e);
          });
          resizeTicking = false;
        });
        resizeTicking = true;
      }
    });
    
    // Neue Event-Handler-Methoden anbieten
    window.CultureStream.events = window.CultureStream.events || {};
    
    // Scroll-Event-Handler hinzufügen
    window.CultureStream.events.addScrollHandler = (handler) => {
      if (typeof handler === 'function') {
        originalScrollHandlers.push(handler);
      }
    };
    
    // Resize-Event-Handler hinzufügen
    window.CultureStream.events.addResizeHandler = (handler) => {
      if (typeof handler === 'function') {
        originalResizeHandlers.push(handler);
      }
    };
  };

  /**
   * Initialisiert Lazy-Loading für alle passenden Elemente
   */
  const initLazyLoad = (container = document) => {
    const observer = setupLazyLoadObserver();
    
    // Bilder mit data-src Attribut lazy-loaden
    container.querySelectorAll('img[data-src]:not([src])').forEach(img => {
      observer.observe(img);
    });
    
    // HTML-Komponenten lazy-loaden
    container.querySelectorAll('[data-cs-lazy-html]').forEach(element => {
      observer.observe(element);
    });
    
    // JavaScript-Komponenten lazy-loaden
    container.querySelectorAll('[data-cs-lazy-component]').forEach(element => {
      observer.observe(element);
    });
  };

  /**
   * Initialisiert alle Performance-Optimierungen
   */
  const init = (customConfig = {}) => {
    // Konfiguration überschreiben wenn nötig
    Object.assign(config, customConfig);
    
    // Module-Speicher initialisieren
    window.CultureStream.modules = window.CultureStream.modules || {};
    
    // Lazy-Loading initialisieren
    if ('IntersectionObserver' in window) {
      initLazyLoad();
    } else {
      // Fallback für Browser ohne IntersectionObserver
      document.querySelectorAll('img[data-src]:not([src])').forEach(img => {
        lazyLoadImage(img);
      });
      document.querySelectorAll('[data-cs-lazy-html]').forEach(element => {
        lazyLoadHTML(element);
      });
      document.querySelectorAll('[data-cs-lazy-component]').forEach(element => {
        lazyLoadComponent(element);
      });
    }
    
    // Prefetching initialisieren
    if ('IntersectionObserver' in window) {
      setupPrefetching();
    }
    
    // Runtime-Performance optimieren
    optimizeRuntimePerformance();
    
    console.info('CultureStream Performance optimizations initialized');
    
    return {
      loadModule,
      config
    };
  };

  // Öffentliche API
  return {
    init,
    loadModule,
    lazyLoadImage,
    lazyLoadComponent,
    lazyLoadHTML
  };
})();

// Automatisch initialisieren, wenn das DOM geladen ist
document.addEventListener('DOMContentLoaded', () => {
  if (window.CultureStream && window.CultureStream.performance) {
    window.CultureStream.performance.init();
  }
}); 