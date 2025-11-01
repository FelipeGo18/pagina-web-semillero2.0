# 🚀 Guía: Cómo Agregar Nuevos Tipos de Prácticas

¿Quieres agregar un nuevo tipo de práctica como `"video"`, `"proyecto"` o `"codigo-interactivo"`? ¡Es super fácil! Sigue estos pasos:

---

## 📋 Pasos para Agregar un Nuevo Tipo

### 1. **Backend: Agregar el Tipo al Modelo** 📦

**Archivo:** `backend/src/models/Practice.js`

Encuentra la sección del campo `type` y agrega tu nuevo tipo:

```javascript
type: {
  type: String,
  enum: [
    'linux-terminal', 
    'teorica', 
    'quiz', 
    'practica-guiada',
    'video',              // ← NUEVO TIPO
    'proyecto'            // ← NUEVO TIPO
  ],
  default: 'linux-terminal'
}
```

---

### 2. **Frontend: Agregar Tipo al Editor** ✏️

**Archivo:** `frontend/src/pages/admin/PracticeEditPage.jsx`

Busca el selector de tipo de práctica y agrega tu nueva opción:

```jsx
<select
  value={editingCourse.type || 'linux-terminal'}
  onChange={(e) => handleChange({ ...editingCourse, type: e.target.value })}
  required
>
  <option value="linux-terminal">🖥️ Terminal Linux</option>
  <option value="teorica">📚 Teórica</option>
  <option value="quiz">❓ Quiz</option>
  <option value="practica-guiada">🎯 Práctica guiada</option>
  <option value="video">🎬 Video</option>             {/* ← NUEVO */}
  <option value="proyecto">💼 Proyecto</option>        {/* ← NUEVO */}
</select>
```

---

### 3. **Frontend: Agregar Formulario Específico** 📝

En el **mismo archivo** (`PracticeEditPage.jsx`), encuentra la sección de ejercicios y agrega tu caso:

```jsx
{/* TIPO: Video */}
{editingCourse.type === 'video' && (
  <>
    <div style={{ marginBottom: '14px' }}>
      <label className="field-desc">Título del video</label>
      <input
        type="text"
        className="exercise-title-input"
        placeholder="Título del video"
        value={ex.title || ''}
        onChange={e => {
          const modules = [...editingCourse.modules];
          modules[modIdx].classes[clsIdx].exercises[exIdx].title = e.target.value;
          handleChange({ ...editingCourse, modules });
        }}
      />
    </div>
    <div style={{ marginBottom: '14px' }}>
      <label className="field-desc">URL del video</label>
      <input
        type="url"
        className="exercise-instruction-input"
        placeholder="https://youtube.com/..."
        value={ex.videoUrl || ''}
        onChange={e => {
          const modules = [...editingCourse.modules];
          modules[modIdx].classes[clsIdx].exercises[exIdx].videoUrl = e.target.value;
          handleChange({ ...editingCourse, modules });
        }}
      />
    </div>
    <div style={{ marginBottom: '14px' }}>
      <label className="field-desc">Duración</label>
      <input
        type="text"
        className="exercise-command-input"
        placeholder="10:30"
        value={ex.duration || ''}
        onChange={e => {
          const modules = [...editingCourse.modules];
          modules[modIdx].classes[clsIdx].exercises[exIdx].duration = e.target.value;
          handleChange({ ...editingCourse, modules });
        }}
      />
    </div>
  </>
)}
```

**También actualiza:**
- Los labels de botones ("Agregar video" en lugar de "Agregar ejercicio")
- El badge de count ("3 videos" en lugar de "3 ejercicios")
- La estructura inicial del item vacío

---

### 4. **Frontend: Crear Componente Visualizador** 🎨

**Archivo nuevo:** `frontend/src/components/VideoViewer.jsx`

```jsx
import { useState } from 'react'
import './VideoViewer.css'

export default function VideoViewer({ videos = [], onComplete, isCompleted }) {
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [watchedVideos, setWatchedVideos] = useState([])

  const currentVideo = videos[currentVideoIndex]

  const markAsWatched = () => {
    if (!watchedVideos.includes(currentVideoIndex)) {
      const newWatched = [...watchedVideos, currentVideoIndex]
      setWatchedVideos(newWatched)
      
      // Si vio todos los videos, marcar como completado
      if (newWatched.length === videos.length && !isCompleted) {
        onComplete()
      }
    }
  }

  return (
    <div className="video-viewer">
      <div className="video-container">
        <iframe
          src={currentVideo.videoUrl}
          title={currentVideo.title}
          frameBorder="0"
          allowFullScreen
          onEnded={markAsWatched}
        />
      </div>
      <div className="video-info">
        <h3>{currentVideo.title}</h3>
        <p>Duración: {currentVideo.duration}</p>
      </div>
      {/* Navegación entre videos */}
      {/* Agregar más UI aquí */}
    </div>
  )
}
```

**Y su CSS:** `frontend/src/components/VideoViewer.css`

```css
.video-viewer {
  max-width: 1000px;
  margin: 0 auto;
  padding: 24px;
}

.video-container {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 */
  height: 0;
  overflow: hidden;
  border-radius: 12px;
  background: #000;
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

/* Más estilos... */
```

---

### 5. **Frontend: Integrar en LessonViewer** 🔗

**Archivo:** `frontend/src/components/LessonViewer.jsx`

**Importar el componente:**
```jsx
import VideoViewer from './VideoViewer'
```

**Agregar el caso de renderizado:**
```jsx
{practiceType === 'video' && (
  <VideoViewer
    videos={currentLesson.exercises || []}
    onComplete={handleComplete}
    isCompleted={isCompleted}
  />
)}
```

---

### 6. **Utilidades: Actualizar Helper** 🛠️

**Archivo:** `frontend/src/utils/practiceTypes.js`

```javascript
export const PRACTICE_TYPES = {
  'linux-terminal': { ... },
  'teorica': { ... },
  'quiz': { ... },
  'practica-guiada': { ... },
  'video': {                              // ← NUEVO
    label: '🎬 Video',
    description: 'Contenido en video',
    itemName: 'video',
    itemNamePlural: 'videos',
    color: '#9b59b6'
  }
};

// Y actualizar createEmptyItem:
export const createEmptyItem = (type) => {
  // ...
  case 'video':
    return {
      ...baseItem,
      title: '',
      videoUrl: '',
      duration: ''
    };
  // ...
};
```

---

## ✅ Checklist Completo

Para agregar un nuevo tipo, asegúrate de:

- [ ] **Backend**: Agregar tipo al enum en `Practice.js`
- [ ] **Editor**: Agregar opción en el selector
- [ ] **Editor**: Agregar formulario específico con sus campos
- [ ] **Editor**: Actualizar labels de botones y badges
- [ ] **Editor**: Actualizar `createEmptyItem` en el click "Agregar"
- [ ] **Viewer**: Crear componente visualizador (`.jsx` y `.css`)
- [ ] **Viewer**: Importar componente en `LessonViewer.jsx`
- [ ] **Viewer**: Agregar caso en el renderizado condicional
- [ ] **Utils**: Actualizar `practiceTypes.js` con nueva info
- [ ] **Docs**: (Opcional) Actualizar `TIPOS_DE_PRACTICAS.md`

---

## 🎯 Ejemplo Completo: Tipo "Proyecto"

### Estructura de datos:
```javascript
{
  title: "Crear un blog con React",
  description: "Desarrolla un blog completo desde cero",
  requirements: "Node.js, React, conocimientos básicos",
  estimatedTime: "8 horas",
  deliverables: "Código fuente, README, demo desplegado",
  rubric: "Funcionalidad 40%, Diseño 30%, Código limpio 30%"
}
```

### Componente visualizador:
```jsx
// ProjectViewer.jsx
export default function ProjectViewer({ project, onComplete, isCompleted }) {
  return (
    <div className="project-viewer">
      <div className="project-header">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
      </div>
      
      <div className="project-requirements">
        <h3>📋 Requisitos</h3>
        <p>{project.requirements}</p>
      </div>
      
      <div className="project-deliverables">
        <h3>📦 Entregables</h3>
        <p>{project.deliverables}</p>
      </div>
      
      <div className="project-rubric">
        <h3>⭐ Rúbrica</h3>
        <p>{project.rubric}</p>
      </div>
      
      <button onClick={onComplete} disabled={isCompleted}>
        {isCompleted ? '✅ Proyecto entregado' : 'Marcar como entregado'}
      </button>
    </div>
  )
}
```

---

## 💡 Tips Adicionales

### Reutilizar Código
Si varios tipos son similares (ej: "video" y "podcast"), puedes:
- Crear un componente base `MediaViewer.jsx`
- Pasarle props para personalizar

### Validaciones
Agrega validaciones en `validateItem()` en `practiceTypes.js`:
```javascript
case 'video':
  return !!(item.title && item.videoUrl);
```

### Colores Personalizados
Cada tipo puede tener su color en el CSS usando clases dinámicas:
```css
.exercise-card.type-video {
  border-left-color: #9b59b6;
}
```

---

## 🚀 ¡Y Eso Es Todo!

Siguiendo estos pasos, puedes agregar **cualquier tipo de práctica** que necesites:
- Videos 🎬
- Proyectos 💼
- Código interactivo 💻
- Evaluaciones peer-to-peer 👥
- Simulaciones 🎮
- ¡Y lo que se te ocurra!

El sistema es **100% escalable y flexible**.

---

**Última actualización:** Noviembre 2025  
**Dificultad:** ⭐⭐ Intermedio  
**Tiempo estimado:** 1-2 horas por tipo nuevo
