# Version 5: Artistic Expression 🎭

## Design-Konzept
Creative Portfolio Style mit Parallax Scrolling und künstlerischem Flair

## Farbpalette
- **Primary:** Deep Purple #6366F1
- **Accent:** Gold #FBBF24, Coral #F97316
- **Background:** Cream #FDFBF7

## Features
✅ Full-Page Scroll-Triggered Video
✅ Parallax Scrolling (Multi-Layer)
✅ Animated SVG Blobs (Organic Shapes)
✅ Gradient Mesh Backgrounds
✅ Artistic Typography (Playfair Display)
✅ Morphing Animations
✅ Creative Team Layout (Asymmetric + Rotation)
✅ Intersection Observer API
✅ Smooth Transitions

## Video Setup
**Wichtig:** Platzieren Sie Ihr Video hier:
```
./videos/prevideo-culturestream.mp4
```

### Scroll-Triggered Video:
- Video erscheint beim Scrollen in Viewport
- Fade-In + Translate-Up Animation
- Play-Overlay mit Gradient
- Startet manuell beim Klick
- Pausiert automatisch wenn out of view

## Special Features

### Parallax Scrolling
Multi-Layer Parallax mit verschiedenen Scroll-Geschwindigkeiten:
- Background Layer: 30% Scroll-Speed
- Content Layer: 100% (Normal)
- Creates 3D Depth Effect

### Animated Blobs
CSS-basierte organische Formen:
- 3 Blobs mit unterschiedlichen Farben
- Float Animation (20s Loop)
- Blur-Filter für weichen Look
- Position & Scale Changes

### Artistic Cards
Cards mit kreativen Hover-Effekten:
- Rotate + Translate beim Hover
- Top-Border Animation (Gradient)
- Icon Rotation & Scale
- Smooth Transitions

### Team Layout
Asymmetrisches Masonry Grid:
- Odd Cards: +1deg Rotation
- Even Cards: -1deg Rotation
- Hover: 0deg + Lift
- Gradient Photo Overlay

## Design-Philosophie
- **Artistic Over Functional:** Form follows feeling
- **Playful Interactions:** Hover-Effekte überall
- **Organic Shapes:** Keine scharfen Kanten
- **Bold Typography:** Playfair Display für Headlines
- **Gradient Everything:** Subtile Farbverläufe

## Performance
- CSS-only Animations (GPU-accelerated)
- Intersection Observer für Video
- Optimized Blur Effects
- Smooth 60fps Scrolling

## Browser-Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

**Note:** Parallax & Blur benötigen moderne Browser
