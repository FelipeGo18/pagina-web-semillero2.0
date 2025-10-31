# Guía de Estilo y Arquitectura - Semillero Universidad Piloto de Colombia

## 🎨 Paleta de Colores Oficial

### Colores Principales
La identidad visual del proyecto debe respetar la paleta institucional de la Universidad Piloto de Colombia:

```css
/* Colores Institucionales */
--rojo-piloto: #ff0000;      /* Rojo principal - Identidad UPC */
--negro: #000000;            /* Títulos y textos importantes */
--blanco: #ffffff;           /* Fondos y textos sobre fondos oscuros */

/* Colores de Apoyo */
--gris-oscuro: #333333;      /* Textos secundarios */
--gris-medio: #666666;       /* Estados hover y elementos interactivos */
--gris-claro: #f9f9f9;       /* Fondos sutiles */
--borde: #e5e7eb;            /* Bordes y divisores */
```

### Uso de Colores

#### ✅ CORRECTO
- **Rojo (#ff0000)**: 
  - Botones de acción principal
  - Líneas de separación importantes
  - Elementos de énfasis
  - Badges y etiquetas destacadas
  - Bordes en hover
  - Barras de progreso
  - Íconos de acción

- **Negro (#000000)**:
  - Títulos principales (h1, h2, h3)
  - Textos de alta jerarquía
  - Elementos completados o activos

- **Blanco (#ffffff)**:
  - Fondos principales de tarjetas
  - Fondos de modales
  - Texto sobre fondos oscuros o rojos

- **Grises**:
  - `#333333`: Descripciones y textos secundarios
  - `#666666`: Estados hover de botones
  - `#f9f9f9`: Fondos de secciones completadas

#### ❌ EVITAR
- NO usar el rojo como fondo de tarjetas o secciones grandes
- NO usar degradados de colores
- NO usar colores azules, verdes, morados que no sean institucionales
- NO mezclar diferentes tonos de rojo

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
Web_Semillero/
├── frontend/
│   ├── src/
│   │   ├── components/          # Componentes reutilizables
│   │   │   ├── Header.jsx
│   │   │   ├── Header.css
│   │   │   ├── PracticeCard.jsx
│   │   │   ├── PracticeCard.css
│   │   │   └── ...
│   │   ├── pages/               # Páginas/Vistas principales
│   │   │   ├── HomePage.jsx
│   │   │   ├── PracticeDetailPage.jsx
│   │   │   └── ...
│   │   ├── data/                # Datos y configuraciones
│   │   │   └── practicesData.js
│   │   ├── styles/              # Estilos globales
│   │   │   └── globals.css
│   │   ├── assets/              # Imágenes, íconos, etc.
│   │   ├── App.jsx              # Componente raíz
│   │   ├── main.jsx             # Punto de entrada
│   │   └── styles.css           # Estilos base
│   ├── index.html
│   └── package.json
└── backend/
    ├── src/
    │   └── server.js
    └── package.json
```

### Jerarquía de Componentes

```
App
├── Header
│   ├── Logo
│   ├── SearchBar
│   └── UserMenu
└── Routes
    ├── HomePage
    │   └── PracticesSection
    │       └── PracticeCard (múltiples)
    │           └── PracticeModal
    └── PracticeDetailPage
        ├── Header (título, progreso)
        ├── ModulesSection
        │   └── ModuleCard (múltiples)
        └── Sidebar
```

---

## 📐 Principios de Diseño

### 1. Modularidad
Cada componente debe:
- Tener una única responsabilidad
- Ser reutilizable
- Tener su propio archivo CSS
- Recibir props para personalización

### 2. Jerarquía Visual
- **Nivel 1 (Principal)**: Títulos en negro, tamaño grande
- **Nivel 2 (Secundario)**: Subtítulos en negro, tamaño medio
- **Nivel 3 (Terciario)**: Descripciones en gris oscuro (#333)
- **Nivel 4 (Detalles)**: Información adicional en gris medio (#666)

### 3. Interactividad
Todos los elementos interactivos deben:
```css
.elemento-interactivo {
  cursor: pointer;
  transition: all 0.3s ease;
}

.elemento-interactivo:hover {
  background: #666666;
  color: white;
}
```

### 4. Consistencia
- Bordes redondeados: `border-radius: 8px` (pequeño), `16px` (medio), `50px` (botones)
- Espaciados: múltiplos de 8px (8px, 16px, 24px, 32px)
- Sombras suaves: `box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)`

### 5. Iconografía
**IMPORTANTE: NO usar emojis en producción**

✅ **CORRECTO - Usar SVG:**
```jsx
const IconoUsuario = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
  </svg>
);
```

❌ **EVITAR - No usar emojis:**
```jsx
// ❌ MAL - Los emojis no son consistentes entre navegadores
<span>👤</span>
<div>📊</div>

// ✅ BIEN - SVG es consistente y escalable
<IconoUsuario />
```

**Razones para usar SVG en lugar de emojis:**
- Consistencia visual entre navegadores y sistemas operativos
- Control total sobre tamaño, color y diseño
- Mejor rendimiento y carga más rápida
- Accesibilidad mejorada con atributos ARIA
- Escalabilidad sin pérdida de calidad

---

## 🎯 Componentes Principales

### Botones

#### Botón Primario (Acción Principal)
```css
.btn-primary {
  background: #ff0000;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #666666;
  color: white;
}
```

#### Botón Secundario (Acción Secundaria)
```css
.btn-secondary {
  background: white;
  color: #ff0000;
  border: 2px solid #ff0000;
  padding: 0.75rem 1.5rem;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #666666;
  color: white;
  border-color: #666666;
}
```

### Tarjetas
```css
.card {
  background: white;
  border: 2px solid #e5e7eb;
  border-radius: 16px;
  padding: 2rem;
  transition: all 0.3s ease;
}

.card:hover {
  border-color: #ff0000;
  box-shadow: 0 8px 24px rgba(255, 0, 0, 0.15);
}
```

### Líneas de Separación
```css
.separator {
  border-bottom: 2px solid #ff0000;
}
```

---

## 📝 Convenciones de Código

### Nombres de Archivos
- Componentes React: `PascalCase.jsx` (ej: `PracticeCard.jsx`)
- Estilos CSS: `PascalCase.css` (ej: `PracticeCard.css`)
- Páginas: `[Nombre]Page.jsx` (ej: `HomePage.jsx`)
- Datos: `camelCase.js` (ej: `practicesData.js`)

### Nombres de Clases CSS
- Usar BEM (Block Element Modifier): `block__element--modifier`
- Prefijos para componentes específicos
- Ejemplos:
  ```css
  .practice-card { }
  .practice-card__title { }
  .practice-card--completed { }
  ```

### Estructura de Archivos CSS
```css
/* 1. Layout principal */
.component { }

/* 2. Elementos internos */
.component__element { }

/* 3. Estados y variantes */
.component:hover { }
.component--variant { }

/* 4. Responsive */
@media (max-width: 768px) { }
```

---

## ✨ Estados Interactivos

### Hover
```css
element:hover {
  background: #666666;
  color: white;
  transform: translateY(-2px);
}
```

### Active/Completed
```css
element.active {
  border-color: #000000;
  background: #f9f9f9;
}
```

### Focus
```css
element:focus {
  outline: 2px solid #ff0000;
  outline-offset: 2px;
}
```

---

## 🔄 Sistema de Progreso

### Barra de Progreso
```css
.progress-bar {
  height: 12px;
  background: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #ff0000;
  transition: width 0.5s ease;
}
```

### Badges
```css
.badge {
  background: #ff0000;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
}
```

---

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile first approach */
/* Small devices (portrait phones, less than 576px) */
@media (max-width: 575px) { }

/* Medium devices (tablets, 576px to 768px) */
@media (min-width: 576px) and (max-width: 767px) { }

/* Large devices (desktops, 768px and up) */
@media (min-width: 768px) { }

/* Extra large devices (large desktops, 1200px and up) */
@media (min-width: 1200px) { }
```

---

## 🚀 Buenas Prácticas

### Performance
- Usar `transition` en lugar de animaciones complejas
- Limitar el uso de `box-shadow` en elementos que no lo requieran
- Optimizar imágenes antes de agregar a `/assets`

### Accesibilidad
- Siempre usar `alt` en imágenes
- Botones deben tener cursor pointer
- Mantener contraste mínimo de 4.5:1 para texto normal
- Usar etiquetas semánticas HTML5

### Mantenibilidad
- Un componente = un archivo
- Componentes pequeños y enfocados
- Props documentadas
- CSS modular y específico

---

## 📚 Recursos

### Tipografía
- Fuente principal: `system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif`
- Tamaños de fuente: 14px (small), 16px (base), 18px (large), 24px (h3), 32px (h2), 48px (h1)
- Pesos: 400 (normal), 600 (semibold), 700 (bold)

### Espaciado
- Escala de 8px: 8, 16, 24, 32, 40, 48, 64
- Padding interno de componentes: 16px - 32px
- Gap entre elementos: 8px - 24px

---

## 🔧 Mantenimiento

### Al agregar nuevos componentes:
1. Crear archivo `.jsx` en `/components` o `/pages`
2. Crear archivo `.css` correspondiente
3. Usar la paleta de colores institucional
4. Seguir la convención de nombres
5. Asegurar responsividad
6. Documentar props si es necesario

### Al modificar estilos:
1. Verificar que se usen colores de la paleta
2. Mantener consistencia con componentes existentes
3. Probar en diferentes tamaños de pantalla
4. Verificar estados hover/active/focus

---

## ⚠️ Importante

### NO hacer:
- ❌ Usar degradados en botones o fondos
- ❌ Usar colores fuera de la paleta institucional
- ❌ Aplicar rojo como fondo en áreas grandes
- ❌ Mezclar diferentes sistemas de diseño
- ❌ Crear componentes monolíticos

### SÍ hacer:
- ✅ Usar blanco para fondos principales
- ✅ Usar rojo para elementos de énfasis y acción
- ✅ Usar negro para títulos y textos importantes
- ✅ Usar grises para estados hover y textos secundarios
- ✅ Mantener componentes modulares y reutilizables
- ✅ Seguir la jerarquía visual establecida

---

**Última actualización**: Octubre 2025
**Versión**: 1.0.0
**Contacto**: Semillero Universidad Piloto de Colombia
