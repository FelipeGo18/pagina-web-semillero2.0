# 📚 Sistema de Tipos de Prácticas

Este documento explica cómo funciona el sistema flexible de tipos de prácticas en la plataforma del semillero.

## 🎯 Tipos de Prácticas Disponibles

### 1. 🖥️ Terminal Linux (`linux-terminal`)
**Uso:** Ejercicios interactivos con comandos de terminal.

**Campos:**
- **Título del ejercicio**: Nombre del ejercicio
- **Instrucción**: Qué debe hacer el usuario
- **Comando esperado**: El comando que debe ejecutar
- **Explicación**: Explicación del comando y su resultado

**Ejemplo:**
```json
{
  "title": "Listar archivos",
  "instruction": "Lista todos los archivos del directorio actual",
  "expectedCommand": "ls -la",
  "explanation": "El comando ls -la muestra todos los archivos, incluyendo ocultos, con permisos y detalles."
}
```

---

### 2. 📚 Teórica (`teorica`)
**Uso:** Contenido de lectura, conceptos, teoría.

**Campos:**
- **Título del contenido**: Nombre del tema
- **Contenido de lectura**: Texto completo del tema
- **Recursos adicionales**: URLs separadas por comas

**Ejemplo:**
```json
{
  "title": "Introducción a sistemas operativos",
  "content": "Un sistema operativo es el software principal que gestiona los recursos del hardware...",
  "resources": "https://ejemplo.com/so, https://otro.com/tutorial"
}
```

---

### 3. ❓ Quiz (`quiz`)
**Uso:** Preguntas de opción múltiple para evaluar conocimientos.

**Campos:**
- **Pregunta**: La pregunta a responder
- **Opciones**: Una opción por línea
- **Respuesta correcta**: La opción exacta que es correcta
- **Explicación de la respuesta**: Por qué es correcta

**Ejemplo:**
```json
{
  "question": "¿Qué comando se usa para cambiar de directorio?",
  "options": "cd\nls\npwd\nmkdir",
  "correctAnswer": "cd",
  "explanation": "El comando 'cd' (change directory) se utiliza para navegar entre directorios."
}
```

---

### 4. 🎯 Práctica Guiada (`practica-guiada`)
**Uso:** Pasos secuenciales para completar una tarea o proyecto.

**Campos:**
- **Nombre del paso**: Título del paso (ej: "Paso 1 - Crear archivo")
- **Descripción del paso**: Qué debe hacer el usuario
- **Código o ejemplo**: Código de referencia (opcional)
- **Notas adicionales**: Consejos, advertencias

**Ejemplo:**
```json
{
  "title": "Paso 1 - Crear el archivo HTML",
  "description": "Crea un archivo llamado index.html con la estructura básica",
  "code": "<!DOCTYPE html>\n<html>\n  <head>\n    <title>Mi página</title>\n  </head>\n  <body>\n  </body>\n</html>",
  "notes": "Asegúrate de guardar el archivo con codificación UTF-8"
}
```

---

## 🔧 Cómo Usar

### Al Crear/Editar una Práctica:

1. **Selecciona el tipo** en el campo "Tipo de práctica"
2. Los formularios se adaptarán automáticamente
3. Los módulos y clases funcionan igual para todos los tipos
4. Solo cambian los campos de ejercicios/actividades dentro de cada clase

### Estructura de Datos:

```javascript
{
  id: 1,
  title: "Nombre de la práctica",
  description: "Descripción breve",
  type: "linux-terminal", // o "teorica", "quiz", "practica-guiada"
  level: "beginner",
  icon: "🎓",
  modules: [
    {
      id: 1,
      title: "Módulo 1",
      description: "Descripción del módulo",
      classes: [
        {
          id: "clase-1",
          title: "Clase 1",
          duration: "30 min",
          exercises: [
            // Aquí va el contenido según el tipo
          ]
        }
      ]
    }
  ]
}
```

---

## 📝 Recomendaciones

### Para Terminal Linux:
- ✅ Usa comandos reales y válidos
- ✅ Explica cada comando claramente
- ✅ Incluye ejemplos de salida esperada

### Para Teórica:
- ✅ Estructura el contenido con párrafos cortos
- ✅ Usa ejemplos prácticos
- ✅ Proporciona recursos externos de calidad

### Para Quiz:
- ✅ Escribe preguntas claras y concisas
- ✅ Proporciona 4 opciones cuando sea posible
- ✅ Explica por qué la respuesta es correcta

### Para Práctica Guiada:
- ✅ Numera los pasos claramente
- ✅ Incluye capturas o código cuando ayude
- ✅ Advierte sobre errores comunes

---

## 🚀 Migración de Prácticas Existentes

Si ya tienes prácticas creadas, el sistema las tratará como tipo `linux-terminal` por defecto.

Para cambiar el tipo:
1. Ve a "Administrar prácticas"
2. Edita la práctica
3. Selecciona el nuevo tipo en "Tipo de práctica"
4. Ajusta el contenido de ejercicios según el nuevo formato
5. Guarda los cambios

---

## 💡 Ejemplos de Uso

### Curso de Linux → `linux-terminal`
Para enseñar comandos básicos de Linux con terminal interactiva.

### Historia de la Computación → `teorica`
Para contenido de lectura sobre conceptos e historia.

### Evaluación de Redes → `quiz`
Para evaluar conocimientos sobre redes y protocolos.

### Tutorial de HTML/CSS → `practica-guiada`
Para guiar paso a paso la creación de una página web.

---

## 🔮 Futuros Tipos (Planificados)

- `video`: Contenido en video con marcadores
- `proyecto`: Proyectos completos con entregas
- `codigo-interactivo`: Editor de código en línea
- `diagrama`: Ejercicios con diagramas interactivos

---

**Última actualización:** Noviembre 2025
