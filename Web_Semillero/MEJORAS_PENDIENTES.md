# 🎯 Mejoras Pendientes - Editor de Prácticas

## ✅ Implementado

### 1. Jerarquía Visual Clara
- ✅ Módulos con fondo negro y borde rojo institucional
- ✅ Clases con fondo gris oscuro y borde izquierdo rojo
- ✅ Ejercicios con tarjetas blancas y acentos institucionales

### 2. Experiencia de Usuario Mejorada
- ✅ Animaciones suaves en hover y transiciones (0.3s ease)
- ✅ Focus states con anillos de color (box-shadow)
- ✅ Cards elevadas con sombras responsivas
- ✅ Iconos rotatorios (▶ → ▼) en los toggles

### 3. Campos de Entrada Modernos
- ✅ Inputs con transiciones suaves
- ✅ Bordes de 2px institucionales
- ✅ Campo de comando con estilo terminal (Monaco, fondo negro, texto verde)
- ✅ Estados focus con color rojo piloto

### 4. Botones Intuitivos
- ✅ Colores institucionales (rojo piloto → gris medio en hover)
- ✅ Sombras que se elevan en hover
- ✅ Estados disabled claros (opacity 0.5)
- ✅ Border-radius 50px para estilo moderno

### 5. Guías de Ayuda
- ✅ Cajas amarillas (#fffbf5) con borde rojo
- ✅ Emoji 💡 posicionado absolutamente
- ✅ Mejor contraste y legibilidad

### 6. Responsive Design
- ✅ Media queries para móviles (max-width: 768px)
- ✅ Botones de ancho completo en pantallas pequeñas
- ✅ Padding ajustado

---

## 🚀 Recomendaciones Adicionales (Por Implementar)

### 1. Breadcrumbs / Navegación Contextual
**Objetivo:** Mostrar la ruta actual de edición

```jsx
// Componente a crear: Breadcrumbs.jsx
<div className="breadcrumbs">
  <span>📚 Práctica: {editingCourse.title}</span>
  {currentModule && (
    <>
      <span className="breadcrumb-separator">›</span>
      <span>📦 Módulo: {currentModule.title}</span>
    </>
  )}
  {currentClass && (
    <>
      <span className="breadcrumb-separator">›</span>
      <span>📝 Clase: {currentClass.title}</span>
    </>
  )}
  {currentExercise && (
    <>
      <span className="breadcrumb-separator">›</span>
      <span>✏️ Ejercicio: {currentExercise.title}</span>
    </>
  )}
</div>
```

**CSS sugerido:**
```css
.breadcrumbs {
  background: var(--blanco);
  padding: 12px 20px;
  border-radius: 8px;
  border: 1px solid var(--borde);
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: var(--gris-medio);
}

.breadcrumb-separator {
  margin: 0 8px;
  color: var(--rojo-piloto);
}
```

---

### 2. Contador de Cambios
**Objetivo:** Mostrar número de cambios sin guardar

```jsx
// En el header de la página
{isDirty && (
  <div className="changes-counter">
    <span className="counter-badge">{changeCount}</span>
    <span>Cambios sin guardar</span>
  </div>
)}
```

**CSS sugerido:**
```css
.changes-counter {
  position: fixed;
  top: 20px;
  right: 20px;
  background: var(--rojo-piloto);
  color: var(--blanco);
  padding: 10px 16px;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1000;
  animation: pulse 2s infinite;
}

.counter-badge {
  background: var(--blanco);
  color: var(--rojo-piloto);
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}
```

---

### 3. Preview en Tiempo Real
**Objetivo:** Vista previa en panel lateral

```jsx
// Componente: PreviewPanel.jsx
const [showPreview, setShowPreview] = useState(false);

// En el JSX
<div className="editor-layout">
  <div className="editor-main">
    {/* Editor actual */}
  </div>
  {showPreview && (
    <div className="preview-panel">
      <div className="preview-header">
        <h3>📱 Vista Previa</h3>
        <button onClick={() => setShowPreview(false)}>✕</button>
      </div>
      <div className="preview-content">
        {/* Renderizar práctica como se vería en la app */}
      </div>
    </div>
  )}
</div>
```

**CSS sugerido:**
```css
.editor-layout {
  display: flex;
  gap: 20px;
}

.editor-main {
  flex: 1;
  min-width: 0;
}

.preview-panel {
  width: 400px;
  background: var(--blanco);
  border: 2px solid var(--borde);
  border-radius: 16px;
  position: sticky;
  top: 20px;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
}

.preview-header {
  padding: 16px;
  border-bottom: 2px solid var(--borde);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--gris-claro);
  border-radius: 14px 14px 0 0;
}

.preview-content {
  padding: 20px;
}

@media (max-width: 1200px) {
  .preview-panel {
    display: none;
  }
}
```

---

### 4. Drag & Drop para Reordenar
**Objetivo:** Arrastrar módulos, clases y ejercicios para reordenarlos

**Librería recomendada:** `react-beautiful-dnd` o `dnd-kit`

```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Ejemplo de implementación:**
```jsx
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableModule({ module, index, ...props }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: module.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {/* Contenido del módulo */}
    </div>
  );
}

// En el componente principal
<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
  <SortableContext items={modules} strategy={verticalListSortingStrategy}>
    {modules.map((module, idx) => (
      <SortableModule key={module.id} module={module} index={idx} />
    ))}
  </SortableContext>
</DndContext>
```

**CSS adicional:**
```css
.module-card.dragging {
  opacity: 0.5;
  cursor: move;
}

.drag-handle {
  cursor: grab;
  color: var(--gris-medio);
  margin-right: 8px;
}

.drag-handle:active {
  cursor: grabbing;
}
```

---

### 5. Copiar / Duplicar Funcionalidad
**Objetivo:** Duplicar módulos, clases o ejercicios rápidamente

```jsx
// Función helper
const duplicateModule = (modIdx) => {
  const modules = [...editingCourse.modules];
  const original = modules[modIdx];
  const duplicate = {
    ...deepClone(original),
    id: Date.now() + Math.random(),
    title: `${original.title} (Copia)`,
    classes: original.classes?.map(cls => ({
      ...deepClone(cls),
      id: Date.now() + Math.random()
    }))
  };
  modules.splice(modIdx + 1, 0, duplicate);
  handleChange({ ...editingCourse, modules });
};

// En el JSX (agregar botón en header de módulo)
<button 
  type="button" 
  className="btn-duplicate-module"
  onClick={(e) => {
    e.stopPropagation();
    duplicateModule(modIdx);
  }}
  title="Duplicar módulo"
>
  📋 Duplicar
</button>
```

**CSS sugerido:**
```css
.btn-duplicate-module,
.btn-duplicate-class,
.btn-duplicate-exercise {
  background: var(--blanco);
  color: var(--rojo-piloto);
  border: 2px solid var(--rojo-piloto);
  border-radius: 50px;
  padding: 6px 12px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 8px;
}

.btn-duplicate-module:hover,
.btn-duplicate-class:hover,
.btn-duplicate-exercise:hover {
  background: var(--rojo-piloto);
  color: var(--blanco);
  transform: scale(1.05);
}
```

---

### 6. Búsqueda y Filtrado
**Objetivo:** Buscar dentro de módulos, clases y ejercicios

```jsx
const [searchTerm, setSearchTerm] = useState('');

// Filtrar módulos que coincidan con la búsqueda
const filteredModules = editingCourse.modules.filter(mod => 
  mod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
  mod.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  mod.classes?.some(cls => 
    cls.title.toLowerCase().includes(searchTerm.toLowerCase())
  )
);

// En el JSX
<div className="search-box">
  <input
    type="text"
    placeholder="🔍 Buscar en módulos, clases o ejercicios..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="search-input"
  />
  {searchTerm && (
    <button onClick={() => setSearchTerm('')} className="clear-search">
      ✕
    </button>
  )}
</div>
```

**CSS sugerido:**
```css
.search-box {
  position: relative;
  margin-bottom: 24px;
}

.search-input {
  width: 100%;
  padding: 14px 50px 14px 20px;
  border: 2px solid var(--borde);
  border-radius: 50px;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--rojo-piloto);
  box-shadow: 0 0 0 3px rgba(255, 0, 0, 0.1);
}

.clear-search {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  background: var(--gris-medio);
  color: var(--blanco);
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.clear-search:hover {
  background: var(--rojo-piloto);
  transform: translateY(-50%) scale(1.1);
}
```

---

### 7. Validación en Tiempo Real
**Objetivo:** Mostrar errores y advertencias antes de guardar

```jsx
const [validationErrors, setValidationErrors] = useState([]);

useEffect(() => {
  const errors = [];
  
  if (!editingCourse.title.trim()) {
    errors.push({ field: 'title', message: 'El título es obligatorio' });
  }
  
  if (!editingCourse.description.trim()) {
    errors.push({ field: 'description', message: 'La descripción es obligatoria' });
  }
  
  editingCourse.modules?.forEach((mod, modIdx) => {
    if (!mod.title.trim()) {
      errors.push({ 
        field: `module-${modIdx}`, 
        message: `El módulo ${modIdx + 1} necesita un título` 
      });
    }
    
    mod.classes?.forEach((cls, clsIdx) => {
      if (!cls.title.trim()) {
        errors.push({ 
          field: `class-${modIdx}-${clsIdx}`, 
          message: `La clase ${clsIdx + 1} del módulo ${modIdx + 1} necesita un título` 
        });
      }
    });
  });
  
  setValidationErrors(errors);
}, [editingCourse]);

// Mostrar errores
{validationErrors.length > 0 && (
  <div className="validation-errors">
    <h4>⚠️ Errores de validación:</h4>
    <ul>
      {validationErrors.map((err, idx) => (
        <li key={idx}>{err.message}</li>
      ))}
    </ul>
  </div>
)}
```

**CSS sugerido:**
```css
.validation-errors {
  background: #fff3cd;
  border-left: 4px solid #ff9800;
  padding: 16px 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.validation-errors h4 {
  margin: 0 0 12px 0;
  color: #856404;
  font-size: 1rem;
}

.validation-errors ul {
  margin: 0;
  padding-left: 24px;
}

.validation-errors li {
  color: #856404;
  margin-bottom: 6px;
}
```

---

### 8. Historial de Cambios (Undo/Redo)
**Objetivo:** Deshacer y rehacer cambios

```jsx
const [history, setHistory] = useState([deepClone(initial)]);
const [historyIndex, setHistoryIndex] = useState(0);

const saveToHistory = (newState) => {
  const newHistory = history.slice(0, historyIndex + 1);
  newHistory.push(deepClone(newState));
  setHistory(newHistory);
  setHistoryIndex(newHistory.length - 1);
};

const undo = () => {
  if (historyIndex > 0) {
    setHistoryIndex(historyIndex - 1);
    setEditingCourse(deepClone(history[historyIndex - 1]));
  }
};

const redo = () => {
  if (historyIndex < history.length - 1) {
    setHistoryIndex(historyIndex + 1);
    setEditingCourse(deepClone(history[historyIndex + 1]));
  }
};

// Botones
<div className="history-controls">
  <button 
    onClick={undo} 
    disabled={historyIndex === 0}
    title="Deshacer (Ctrl+Z)"
  >
    ↶ Deshacer
  </button>
  <button 
    onClick={redo} 
    disabled={historyIndex === history.length - 1}
    title="Rehacer (Ctrl+Y)"
  >
    ↷ Rehacer
  </button>
</div>
```

---

## 🎨 Prioridad de Implementación

1. **Alta Prioridad:**
   - ✅ Contador de cambios (visual feedback importante)
   - ✅ Duplicar funcionalidad (productividad)
   - ✅ Validación en tiempo real (prevenir errores)

2. **Media Prioridad:**
   - 🔄 Breadcrumbs (mejor navegación)
   - 🔄 Búsqueda y filtrado (útil con muchos módulos)
   - 🔄 Historial Undo/Redo (productividad avanzada)

3. **Baja Prioridad:**
   - ⏸️ Preview panel (nice to have)
   - ⏸️ Drag & Drop (avanzado, puede ser complejo)

---

## 📝 Notas de Implementación

- Todas estas mejoras son **compatibles** con la estructura actual
- Se recomienda implementar una a la vez para facilitar testing
- Considerar impacto en performance con muchos módulos (> 10)
- Mantener siempre los colores institucionales UPC en nuevas features

---

**Última actualización:** Noviembre 2025
**Versión actual:** 1.0 con estilos institucionales completos
