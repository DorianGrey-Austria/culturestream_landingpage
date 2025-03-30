/**
 * CultureStream Slider Modul
 * Ein einfacher Bild-Slider, der über Code-Splitting geladen wird
 */

// Namespace für Module sicherstellen
window.CultureStream = window.CultureStream || {};
window.CultureStream.modules = window.CultureStream.modules || {};

// Slider-Modul definieren
window.CultureStream.modules['components/slider'] = (function() {
  'use strict';
  
  // Private Variablen
  const defaults = {
    slideClass: 'cs-slide',
    activeClass: 'cs-slide-active',
    duration: 5000, // Auto-Rotation in ms
    transitionTime: 300, // Übergangszeit in ms
    arrows: true,
    dots: true,
    autoplay: true
  };
  
  // Sammlung aller Slider auf der Seite
  const sliders = new Map();
  
  /**
   * Erstellt die Slider-HTML-Struktur
   */
  const createSliderStructure = (container, options) => {
    const slides = container.querySelectorAll(`.${options.slideClass}`);
    if (slides.length === 0) return;
    
    // Wrapper für alle Slides
    const slidesWrapper = document.createElement('div');
    slidesWrapper.className = 'cs-slides-wrapper';
    
    // Slides in Wrapper verschieben
    slides.forEach(slide => {
      slide.classList.add('cs-slide');
      slidesWrapper.appendChild(slide);
    });
    
    // Wrapper in Container einfügen
    container.appendChild(slidesWrapper);
    
    // Ersten Slide aktivieren
    slides[0].classList.add(options.activeClass);
    
    // Navigation erstellen
    if (options.arrows && slides.length > 1) {
      const prevButton = document.createElement('button');
      prevButton.className = 'cs-slider-prev';
      prevButton.setAttribute('aria-label', 'Vorheriges Bild');
      prevButton.innerHTML = '&lt;';
      
      const nextButton = document.createElement('button');
      nextButton.className = 'cs-slider-next';
      nextButton.setAttribute('aria-label', 'Nächstes Bild');
      nextButton.innerHTML = '&gt;';
      
      container.appendChild(prevButton);
      container.appendChild(nextButton);
    }
    
    // Dots-Navigation erstellen
    if (options.dots && slides.length > 1) {
      const dotsContainer = document.createElement('div');
      dotsContainer.className = 'cs-slider-dots';
      
      slides.forEach((_, index) => {
        const dot = document.createElement('button');
        dot.className = 'cs-slider-dot';
        dot.setAttribute('aria-label', `Slide ${index + 1}`);
        dot.setAttribute('data-slide-index', index);
        if (index === 0) {
          dot.classList.add('cs-slider-dot-active');
        }
        dotsContainer.appendChild(dot);
      });
      
      container.appendChild(dotsContainer);
    }
    
    // Container als Slider markieren
    container.classList.add('cs-slider-initialized');
    
    return {
      slides,
      currentIndex: 0
    };
  };
  
  /**
   * Event-Handler für Slider einrichten
   */
  const setupEventHandlers = (container, sliderState, options) => {
    // Pfeiltasten-Navigation
    const prevButton = container.querySelector('.cs-slider-prev');
    const nextButton = container.querySelector('.cs-slider-next');
    
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        goToSlide(container, sliderState, sliderState.currentIndex - 1, options);
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        goToSlide(container, sliderState, sliderState.currentIndex + 1, options);
      });
    }
    
    // Dots-Navigation
    const dots = container.querySelectorAll('.cs-slider-dot');
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const index = parseInt(dot.getAttribute('data-slide-index'), 10);
        goToSlide(container, sliderState, index, options);
      });
    });
    
    // Swipe-Unterstützung für Touch-Geräte
    let touchStartX = 0;
    let touchEndX = 0;
    
    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    
    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe(container, sliderState, touchStartX, touchEndX, options);
    }, { passive: true });
    
    // Autoplay starten, wenn aktiviert
    if (options.autoplay && sliderState.slides.length > 1) {
      sliderState.autoplayInterval = setInterval(() => {
        goToSlide(container, sliderState, sliderState.currentIndex + 1, options);
      }, options.duration);
      
      // Autoplay pausieren bei Hover/Fokus
      container.addEventListener('mouseenter', () => {
        clearInterval(sliderState.autoplayInterval);
      });
      
      container.addEventListener('mouseleave', () => {
        sliderState.autoplayInterval = setInterval(() => {
          goToSlide(container, sliderState, sliderState.currentIndex + 1, options);
        }, options.duration);
      });
    }
  };
  
  /**
   * Swipe-Gesten behandeln
   */
  const handleSwipe = (container, sliderState, startX, endX, options) => {
    const threshold = 50; // Minimale Pixel für einen Swipe
    
    if (startX - endX > threshold) {
      // Swipe nach links -> nächster Slide
      goToSlide(container, sliderState, sliderState.currentIndex + 1, options);
    } else if (endX - startX > threshold) {
      // Swipe nach rechts -> vorheriger Slide
      goToSlide(container, sliderState, sliderState.currentIndex - 1, options);
    }
  };
  
  /**
   * Zu einem bestimmten Slide navigieren
   */
  const goToSlide = (container, sliderState, index, options) => {
    const { slides, currentIndex } = sliderState;
    const slideCount = slides.length;
    
    // Index normalisieren (Endlos-Rotation)
    let newIndex = index;
    if (newIndex < 0) {
      newIndex = slideCount - 1;
    } else if (newIndex >= slideCount) {
      newIndex = 0;
    }
    
    // Nichts tun, wenn wir schon auf dem Slide sind
    if (newIndex === currentIndex) return;
    
    // Aktuelle Klasse vom aktiven Slide entfernen
    slides[currentIndex].classList.remove(options.activeClass);
    
    // Neue Klasse zum neuen Slide hinzufügen
    slides[newIndex].classList.add(options.activeClass);
    
    // Dots aktualisieren
    const dots = container.querySelectorAll('.cs-slider-dot');
    if (dots.length > 0) {
      dots.forEach(dot => dot.classList.remove('cs-slider-dot-active'));
      dots[newIndex].classList.add('cs-slider-dot-active');
    }
    
    // Zustand aktualisieren
    sliderState.currentIndex = newIndex;
  };
  
  /**
   * Initialisiert einen Slider im Container
   */
  const init = (container, customOptions = {}) => {
    // Optionen mit Defaults zusammenführen
    const options = { ...defaults, ...customOptions };
    
    // Slider nur einmal initialisieren
    if (container.classList.contains('cs-slider-initialized')) return;
    
    // Slider-Struktur erstellen
    const sliderState = createSliderStructure(container, options);
    if (!sliderState) return;
    
    // Event-Handler einrichten
    setupEventHandlers(container, sliderState, options);
    
    // Slider-Zustand speichern
    const sliderId = container.id || `slider-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    if (!container.id) container.id = sliderId;
    
    sliders.set(sliderId, {
      state: sliderState,
      options
    });
    
    return {
      goToSlide: (index) => goToSlide(container, sliderState, index, options),
      getCurrentIndex: () => sliderState.currentIndex,
      getSlideCount: () => sliderState.slides.length,
      pause: () => {
        if (sliderState.autoplayInterval) {
          clearInterval(sliderState.autoplayInterval);
        }
      },
      resume: () => {
        if (options.autoplay) {
          sliderState.autoplayInterval = setInterval(() => {
            goToSlide(container, sliderState, sliderState.currentIndex + 1, options);
          }, options.duration);
        }
      }
    };
  };
  
  /**
   * Zerstört einen Slider und bereinigt den DOM
   */
  const destroy = (container) => {
    if (!container.classList.contains('cs-slider-initialized')) return;
    
    const sliderId = container.id;
    if (!sliderId || !sliders.has(sliderId)) return;
    
    const { state, options } = sliders.get(sliderId);
    
    // Autoplay-Interval löschen
    if (state.autoplayInterval) {
      clearInterval(state.autoplayInterval);
    }
    
    // Navigation entfernen
    container.querySelectorAll('.cs-slider-prev, .cs-slider-next, .cs-slider-dots').forEach(el => {
      el.remove();
    });
    
    // Slides zurück in Container verschieben
    const slidesWrapper = container.querySelector('.cs-slides-wrapper');
    if (slidesWrapper) {
      const slides = slidesWrapper.querySelectorAll(`.${options.slideClass}`);
      slides.forEach(slide => {
        slide.classList.remove(options.activeClass);
        container.appendChild(slide);
      });
      slidesWrapper.remove();
    }
    
    // Klassen entfernen
    container.classList.remove('cs-slider-initialized');
    
    // Aus Sammlung entfernen
    sliders.delete(sliderId);
  };
  
  // Öffentliche API
  return {
    init,
    destroy,
    getAll: () => sliders
  };
})(); 