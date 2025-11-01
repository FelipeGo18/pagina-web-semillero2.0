# 📁 Estructura CSS Modular - Admin Panel

## 🎯 Objetivo
El CSS del panel de administración ha sido reorganizado en módulos más pequeños y mantenibles para mejorar la escalabilidad y legibilidad del código.

## 📂 Estructura de Archivos

### Archivo Principal
- **`PracticeEditPage.css`** - Archivo principal que importa todos los módulos y contiene estilos específicos de la página

### Módulos CSS (`/src/styles/admin/`)
- **`FormInputs.css`** - Inputs, textareas, selects, labels y campos de formulario
- **`TerminalInput.css`** - Input tipo terminal para comandos (fondo negro, texto verde)
- **`Buttons.css`** - Todos los botones (agregar, eliminar, guardar, cancelar, volver)
- **`Modules.css`** - Tarjetas y estructura de módulos
- **`Classes.css`** - Tarjetas y estructura de clases
- **`Exercises.css`** - Tarjetas y estructura de ejercicios

### Estilos Globales (`/src/styles/`)
- **`globals.css`** - Variables CSS globales, colores UPC, sombras, gradientes, scrollbar
- **`animations.css`** - Todas las animaciones reutilizables (fadeIn, pulse, glow, etc.)

## 🔧 Cómo Funciona

El archivo `PracticeEditPage.css` importa todos los módulos usando `@import`:

```css
@import '../animations.css';
@import './FormInputs.css';
@import './TerminalInput.css';
@import './Buttons.css';
@import './Modules.css';
@import './Classes.css';
@import './Exercises.css';
```

## ✨ Beneficios

✅ **Modularidad** - Cada archivo tiene una responsabilidad única
✅ **Mantenibilidad** - Fácil encontrar y modificar estilos específicos
✅ **Reutilización** - Los módulos pueden usarse en otras páginas
✅ **Legibilidad** - Archivos más pequeños y organizados
✅ **Escalabilidad** - Fácil agregar nuevos módulos sin afectar el código existente

## 📝 Convenciones

- Los archivos de módulo están en `src/styles/admin/`
- Las variables globales están en `src/styles/globals.css`
- Las animaciones reutilizables están en `src/styles/animations.css`
- Cada módulo tiene comentarios descriptivos
- Se usa la convención BEM para nombres de clases complejas

## 🔄 Migración

Si necesitas revertir a la versión anterior, el archivo de backup está en:
`PracticeEditPage-OLD-BACKUP.css`

## 🎨 Variables CSS Disponibles

Las siguientes variables están disponibles globalmente:

### Colores
- `--rojo-piloto`, `--negro`, `--blanco`
- `--gris-oscuro`, `--gris-medio`, `--gris-claro`

### Sombras
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`, `--shadow-red`

### Gradientes
- `--gradient-red`, `--gradient-dark`, `--gradient-overlay`

## 📌 Notas

- Los imports CSS deben estar al inicio del archivo
- Las rutas de import son relativas al archivo que las importa
- Vite procesa los imports automáticamente durante el build
