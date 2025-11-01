// Datos de las prácticas del semillero
export const practicesData = [
  {
    id: 1,
    title: "Aprende Linux",
    description: "Domina los comandos básicos y la administración del sistema operativo Linux.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="111.08" height="128" viewBox="0 0 256 295"><defs><linearGradient id="IconifyId19a32e3330636790263" x1="48.548%" x2="51.047%" y1="115.276%" y2="41.364%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790264" x1="54.407%" x2="46.175%" y1="2.404%" y2="90.542%"><stop offset="0%" stop-color="#FFF" stop-opacity=".8"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790265" x1="51.86%" x2="47.947%" y1="88.248%" y2="9.748%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790266" x1="49.925%" x2="49.924%" y1="85.49%" y2="13.811%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790267" x1="53.901%" x2="45.956%" y1="3.102%" y2="93.895%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790268" x1="45.593%" x2="54.811%" y1="5.475%" y2="93.524%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790269" x1="49.984%" x2="49.984%" y1="89.845%" y2="40.632%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790270" x1="53.505%" x2="42.746%" y1="99.975%" y2="23.545%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790271" x1="49.841%" x2="50.241%" y1="13.229%" y2="94.673%"><stop offset="0%" stop-color="#FFF" stop-opacity=".8"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790272" x1="49.927%" x2="50.727%" y1="37.327%" y2="92.782%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790273" x1="49.876%" x2="49.876%" y1="2.299%" y2="81.204%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790274" x1="49.833%" x2="49.824%" y1="2.272%" y2="71.799%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790275" x1="53.467%" x2="38.949%" y1="48.921%" y2="98.1%"><stop offset="0%" stop-color="#FFA63F"/><stop offset="100%" stop-color="#FF0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790276" x1="52.373%" x2="47.579%" y1="143.009%" y2="-64.622%"><stop offset="0%" stop-color="#FFEED7"/><stop offset="100%" stop-color="#BDBFC2"/></linearGradient><linearGradient id="IconifyId19a32e3330636790277" x1="30.581%" x2="65.887%" y1="34.024%" y2="89.175%"><stop offset="0%" stop-color="#FFA63F"/><stop offset="100%" stop-color="#FF0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790278" x1="59.572%" x2="48.361%" y1="-17.216%" y2="66.118%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790279" x1="47.769%" x2="51.373%" y1="1.565%" y2="104.313%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790280" x1="43.55%" x2="57.114%" y1="4.533%" y2="92.827%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790281" x1="49.733%" x2="50.558%" y1="17.609%" y2="99.385%"><stop offset="0%" stop-color="#FFA63F"/><stop offset="100%" stop-color="#FF0"/></linearGradient><linearGradient id="IconifyId19a32e3330636790282" x1="50.17%" x2="49.68%" y1="2.89%" y2="94.17%"><stop offset="0%" stop-color="#FFF" stop-opacity=".65"/><stop offset="100%" stop-color="#FFF" stop-opacity="0"/></linearGradient><filter id="IconifyId19a32e3330636790283" width="200%" height="200%" x="-50%" y="-50%" filterUnits="objectBoundingBox"><feOffset in="SourceAlpha" result="shadowOffsetOuter1"/><feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="6.5"/></filter></defs><g fill="none"><path fill="#000" fill-opacity=".2" d="M235.125 249.359c0 17.355-52.617 31.497-117.54 31.497S.044 266.806.044 249.359c0-17.356 52.618-31.498 117.54-31.498c64.924 0 117.45 14.142 117.541 31.498" filter="url(#IconifyId19a32e3330636790283)" transform="translate(10)"/><path fill="#000" d="M63.213 215.474c-11.387-16.346-13.591-69.606 12.947-102.39C89.292 97.383 92.69 86.455 93.7 71.67c.734-16.805-11.846-66.851 35.537-70.616c48.027-3.857 45.364 43.526 45.088 68.596c-.183 21.12 15.52 33.15 26.355 49.68c19.927 30.303 18.274 82.461-3.765 110.745c-27.916 35.354-51.791 20.018-67.678 21.304c-29.752 1.745-30.762 17.54-66.024-35.905"/><path fill="url(#IconifyId19a32e3330636790263)" d="M169.1 122.451c8.265 7.622 29.661 41.69-4.224 62.995c-11.937 7.438 10.653 35.721 21.488 22.039c19.193-24.61 6.98-63.913-4.591-77.963c-7.714-9.917-19.651-13.774-12.672-7.07" transform="translate(10)"/><path fill="#000" stroke="#000" stroke-width=".977" d="M176.805 117.86c13.59 11.02 38.292 49.587 2.204 74.748c-11.846 7.806 10.468 32.508 23.049 19.927c43.618-43.894-1.102-94.308-16.53-111.664c-13.774-15.151-25.987 3.49-8.723 16.989Z"/><path fill="url(#IconifyId19a32e3330636790264)" d="M147.245 25.02c-.459 12.581-14.325 23.51-30.946 24.52S86.639 41 87.097 28.418c.46-12.581 14.326-23.509 30.947-24.519c16.62-.918 29.66 8.54 29.201 21.12" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790265)" d="M107.483 54.957c.46 8.173-3.397 15.06-8.723 15.335s-10.01-6.06-10.47-14.232S91.688 41 97.014 40.725s10.01 6.06 10.468 14.233" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790266)" d="M117.125 55.6c.184 9.458 6.337 16.988 13.683 16.805c7.346-.184 13.131-7.99 12.948-17.54c-.184-9.458-6.336-16.988-13.683-16.804c-7.346.183-13.223 8.08-12.948 17.539" transform="translate(10)"/><path fill="#000" d="M133.186 57.712c-.092 5.234 2.48 9.458 5.877 9.458c3.306 0 6.153-4.224 6.245-9.366c.091-5.234-2.48-9.459-5.878-9.459c-3.397 0-6.152 4.225-6.244 9.367m-21.212.092c.459 4.316-1.194 7.989-3.582 8.356c-2.387.276-4.683-2.938-5.142-7.254s1.194-7.99 3.581-8.357c2.388-.275 4.684 2.939 5.143 7.255"/><path fill="url(#IconifyId19a32e3330636790267)" d="M124.564 54.773c-.276 2.939 1.102 5.326 3.03 5.51s3.765-2.112 4.04-4.959c.276-2.938-1.102-5.326-3.03-5.51c-1.928-.183-3.765 2.113-4.04 4.96" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790268)" d="M99.953 55.508c.276 2.388-.734 4.5-2.203 4.683c-1.47.184-2.847-1.653-3.123-4.132c-.275-2.388.735-4.5 2.204-4.683c1.47-.184 2.847 1.744 3.122 4.132" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790269)" d="M71.027 145.684c6.52-14.785 20.386-40.772 20.662-60.883c0-15.978 47.843-19.835 51.7-3.856c3.856 15.978 13.59 39.853 19.834 51.424c6.245 11.478 24.335 48.118 5.051 80.074c-17.356 28.284-69.973 50.69-98.073-3.856c-9.55-18.917-7.806-42.333.826-62.903" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790270)" d="M65.15 134.664c-5.601 10.56-17.172 38.293 11.112 53.445c30.395 16.162 30.303 49.312-6.245 33.517c-33.425-14.233-18.641-71.902-9.274-85.676c6.06-9.642 15.243-21.488 4.407-1.286" transform="translate(10)"/><path fill="#000" stroke="#000" stroke-width="1.25" d="M79.925 122.727c-8.907 14.509-30.211 48.669-1.652 66.484c38.384 23.6 27.548 47.108-7.53 25.895c-49.404-29.568-5.97-89.257 13.774-112.03c22.59-25.529 4.316 4.683-4.592 19.65Z"/><path fill="url(#IconifyId19a32e3330636790271)" d="M156.428 151.285c0 16.162-15.519 37.1-42.15 36.916c-27.456.183-39.118-20.754-39.118-36.916s18.182-29.293 40.588-29.293c22.498.092 40.68 13.132 40.68 29.293" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790272)" d="M141.92 100.504c-.276 16.713-11.204 20.662-24.978 20.662s-23.784-2.48-24.978-20.662c0-11.387 11.203-17.998 24.978-17.998c13.774-.092 24.977 6.52 24.977 17.998" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790273)" d="M58.63 126.216c9-13.682 28.008-34.711 3.582 2.939c-19.835 31.038-7.346 50.965-.918 56.474c18.549 16.53 17.814 27.64 3.214 18.917c-31.314-18.641-24.794-50.047-5.878-78.33" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790274)" d="M188.936 131.818c-7.806-16.07-32.6-56.842 1.193-9.459c30.763 42.884 9.183 72.729 5.326 75.667c-3.856 2.939-16.804 8.908-13.04-1.469c3.858-10.377 22.958-30.028 6.52-64.74" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790275)" stroke="#E68C3F" stroke-width="6.25" d="M51.835 258.542c-20.57-10.928-50.414 2.112-39.578-27.457c2.204-6.704-3.214-16.805.275-23.325c4.133-7.989 13.04-6.244 18.366-11.57c5.234-5.51 8.54-15.06 18.366-13.59c9.734 1.468 16.254 13.406 23.049 28.099c5.05 10.468 22.865 25.253 21.672 37.007c-1.47 17.998-21.948 21.396-42.15 10.836Z" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790276)" d="M201.608 189.119c-3.122 5.877-16.162 15.335-24.886 12.856c-8.815-2.388-12.856-15.795-11.111-25.988c1.653-11.386 11.111-12.03 23.05-6.336c12.855 6.336 16.712 11.662 12.947 19.468" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790277)" stroke="#E68C3F" stroke-width="6.251" d="M194.445 253.49c15.06-18.273 48.578-14.508 25.988-39.577c-4.775-5.418-3.306-16.989-9.183-21.947c-6.887-6.061-14.509-1.102-21.488-4.224c-6.979-3.398-14.325-9.918-22.865-5.327c-8.54 4.684-9.459 16.805-10.285 32.783c-.735 11.479-11.203 30.671-5.602 41.231c8.081 16.346 29.11 14.142 43.435-2.938Z" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790278)" d="M187.925 229.064c23.325-34.435 5.97-34.16.092-36.823c-5.877-2.755-12.03-8.173-18.916-4.408c-6.888 3.857-7.255 13.775-7.439 26.814c-.275 9.367-8.08 25.07-3.397 33.793c5.693 10.193 19.467-4.591 29.66-19.376" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790279)" d="M47.06 234.023c-34.895-22.59-18.55-30.303-13.315-33.885c6.336-4.591 6.428-13.407 14.233-12.58c7.806.826 12.397 10.468 17.631 22.406c3.857 8.54 17.264 19.927 16.254 29.753c-1.285 11.57-19.743 3.948-34.803-5.694" transform="translate(10)"/><path fill="#000" d="M209.588 188.843c-2.755 4.776-13.958 12.306-21.396 10.285c-7.622-1.928-11.112-12.672-9.55-20.753c1.377-9.183 9.55-9.642 19.834-5.05c10.928 4.958 14.326 9.182 11.112 15.518"/><path fill="url(#IconifyId19a32e3330636790280)" d="M192.058 186.18c-1.745 3.306-9.091 8.54-14.234 7.163c-5.142-1.377-7.713-8.815-6.887-14.417c.735-6.336 6.244-6.704 13.223-3.581c7.53 3.49 9.918 6.428 7.898 10.835" transform="translate(10)"/><path fill="url(#IconifyId19a32e3330636790281)" stroke="#E68C3F" stroke-width="3.75" d="M97.107 66.344c3.673-3.398 12.58-13.774 29.477-2.939c3.122 2.02 5.693 2.204 11.662 4.775c12.03 4.96 6.336 16.897-6.52 20.937c-5.51 1.745-10.468 8.449-20.386 7.806c-8.54-.46-10.744-6.06-15.978-9.091c-9.275-5.234-10.652-12.305-5.602-16.07c5.051-3.765 6.98-5.143 7.347-5.418Z" transform="translate(10)"/><path stroke="#E68C3F" stroke-width="2.5" d="M148.43 75.986c-5.05.275-15.979 11.203-27.457 11.203s-18.366-10.652-20.11-10.652"/><path fill="url(#IconifyId19a32e3330636790282)" d="M102.8 65.426c1.837-1.653 7.622-6.153 15.244-1.562c1.653.919 3.306 1.929 5.693 3.306c4.867 2.847 2.48 6.98-3.398 9.55c-2.663 1.102-7.07 3.49-10.376 3.306c-3.673-.367-6.153-2.755-8.54-4.316c-4.5-2.938-4.224-5.418-2.112-7.346c1.56-1.47 3.305-2.847 3.49-2.938" transform="translate(10)"/></g></svg>`,
    fullDescription: "Aprende los fundamentos del sistema operativo Linux, desde comandos básicos hasta administración de sistemas.",
    objectives: [
      "Comprender la arquitectura básica de Linux",
      "Dominar comandos esenciales del terminal",
      "Navegar y administrar el sistema de archivos",
      "Gestionar permisos y usuarios"
    ],
    topics: [
      "Historia y distribuciones de Linux",
      "Comandos básicos del terminal",
      "Sistema de archivos y permisos",
      "Gestión de procesos y servicios"
    ],
    requirements: [
      "Computador con Linux instalado o máquina virtual",
      "Acceso al terminal"
    ],
    duration: "20-25 horas",
    modules: [
      {
        id: 1,
        title: "Módulo 1: Introducción y Primeros Pasos",
        description: "Conoce Linux, la terminal y aprende a navegar por el sistema de archivos.",
        duration: "2 horas",
        difficulty: "Fácil",
        classes: [
          { id: "1.1", title: "¿Qué es Linux y la Terminal?", duration: "30 min" },
          { id: "1.2", title: "Tu Primera Interacción con la Terminal", duration: "30 min" },
          { id: "1.3", title: "Navegación Básica - Sistema de Archivos", duration: "30 min" },
          { id: "1.4", title: "Moviéndote por el Sistema", duration: "30 min" }
        ]
      },
      {
        id: 2,
        title: "Módulo 2: Manipulación de Archivos y Directorios",
        description: "Aprende a crear, copiar, mover, eliminar archivos y usar comodines.",
        duration: "3 horas",
        difficulty: "Fácil",
        classes: [
          { id: "2.1", title: "Crear Archivos Vacíos", duration: "30 min" },
          { id: "2.2", title: "Crear y Eliminar Directorios", duration: "30 min" },
          { id: "2.3", title: "Copiar Archivos", duration: "30 min" },
          { id: "2.4", title: "Mover y Renombrar", duration: "30 min" },
          { id: "2.5", title: "Eliminar Archivos (con precaución)", duration: "30 min" },
          { id: "2.6", title: "Comodines y Patrones", duration: "30 min" }
        ]
      },
      {
        id: 3,
        title: "Módulo 3: Visualización de Contenido",
        description: "Domina comandos para ver, buscar y analizar contenido de archivos.",
        duration: "2.5 horas",
        difficulty: "Fácil",
        classes: [
          { id: "3.1", title: "Ver Contenido Completo de Archivos", duration: "30 min" },
          { id: "3.2", title: "Ver Archivos Grandes con less", duration: "30 min" },
          { id: "3.3", title: "Ver Inicio y Final de Archivos", duration: "30 min" },
          { id: "3.4", title: "Contar Palabras y Líneas", duration: "30 min" },
          { id: "3.5", title: "Buscar Texto en Archivos con grep", duration: "30 min" }
        ]
      },
      {
        id: 4,
        title: "Módulo 4: Edición de Texto",
        description: "Crea y edita archivos de texto con nano y redirecciones.",
        duration: "2 horas",
        difficulty: "Intermedio",
        classes: [
          { id: "4.1", title: "Crear Archivos con Contenido", duration: "30 min" },
          { id: "4.2", title: "Introducción a nano", duration: "30 min" },
          { id: "4.3", title: "Edición Básica en nano", duration: "30 min" },
          { id: "4.4", title: "Redirecciones y Pipelines", duration: "30 min" }
        ]
      },
      {
        id: 5,
        title: "Módulo 5: Permisos y Usuarios",
        description: "Comprende y gestiona permisos de archivos, usuarios y grupos.",
        duration: "2.5 horas",
        difficulty: "Intermedio",
        classes: [
          { id: "5.1", title: "Entendiendo los Permisos", duration: "30 min" },
          { id: "5.2", title: "Cambiar Permisos (Modo Simbólico)", duration: "30 min" },
          { id: "5.3", title: "Cambiar Permisos (Modo Numérico)", duration: "30 min" },
          { id: "5.4", title: "Propietarios de Archivos", duration: "30 min" },
          { id: "5.5", title: "Usuario Root y sudo", duration: "30 min" }
        ]
      },
      {
        id: 6,
        title: "Módulo 6: Procesos y Sistema",
        description: "Monitorea procesos, recursos del sistema y ejecución en segundo plano.",
        duration: "2.5 horas",
        difficulty: "Intermedio",
        classes: [
          { id: "6.1", title: "Ver Procesos en Ejecución", duration: "30 min" },
          { id: "6.2", title: "Monitorear el Sistema con top", duration: "30 min" },
          { id: "6.3", title: "Matar Procesos", duration: "30 min" },
          { id: "6.4", title: "Información del Sistema", duration: "30 min" },
          { id: "6.5", title: "Ejecutar Comandos en Segundo Plano", duration: "30 min" }
        ]
      },
      {
        id: 7,
        title: "Módulo 7: Búsqueda y Filtrado Avanzado",
        description: "Usa find, pipelines avanzados y sed para búsquedas complejas.",
        duration: "2 horas",
        difficulty: "Avanzado",
        classes: [
          { id: "7.1", title: "Buscar Archivos por Nombre", duration: "30 min" },
          { id: "7.2", title: "Buscar Archivos por Características", duration: "30 min" },
          { id: "7.3", title: "Pipelines Avanzados", duration: "30 min" },
          { id: "7.4", title: "Comando sed (Introducción)", duration: "30 min" }
        ]
      },
      {
        id: 8,
        title: "Módulo 8: Compresión y Empaquetado",
        description: "Aprende a comprimir y empaquetar archivos con gzip y tar.",
        duration: "1.5 horas",
        difficulty: "Intermedio",
        classes: [
          { id: "8.1", title: "Comprimir Archivos con gzip", duration: "30 min" },
          { id: "8.2", title: "Crear Archivos TAR", duration: "30 min" },
          { id: "8.3", title: "Comprimir con TAR y GZIP", duration: "30 min" }
        ]
      },
      {
        id: 9,
        title: "Módulo 9: Redes Básicas",
        description: "Verifica conectividad, descarga archivos y gestiona conexiones de red.",
        duration: "2 horas",
        difficulty: "Intermedio",
        classes: [
          { id: "9.1", title: "Verificar Conectividad con ping", duration: "30 min" },
          { id: "9.2", title: "Información de Red", duration: "30 min" },
          { id: "9.3", title: "Descargar Archivos con wget/curl", duration: "30 min" },
          { id: "9.4", title: "Ver Conexiones Activas", duration: "30 min" }
        ]
      },
      {
        id: 10,
        title: "Módulo 10: Scripts Básicos",
        description: "Crea y automatiza tareas con scripts de Bash.",
        duration: "2.5 horas",
        difficulty: "Avanzado",
        classes: [
          { id: "10.1", title: "Tu Primer Script", duration: "30 min" },
          { id: "10.2", title: "Variables en Scripts", duration: "30 min" },
          { id: "10.3", title: "Argumentos de Script", duration: "30 min" },
          { id: "10.4", title: "Condicionales en Scripts", duration: "30 min" },
          { id: "10.5", title: "Bucles Básicos", duration: "30 min" }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "Robot EV3 de LEGO",
    description: "Programa y controla un robot EV3 de LEGO Mindstorms para realizar tareas autónomas.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="85.75" height="128" viewBox="0 0 343 512">
  <!-- Cuerpo principal (azul Mindstorms) -->
  <rect x="0" y="55.717" width="342.352" height="403.603" fill="#0055BF" stroke="#003D8F" stroke-width="4"/>
  
  <!-- Pantalla LCD (blanco) -->
  <rect x="57.657" y="95.005" width="223.68" height="147.945" rx="8" fill="#E8E8E8" stroke="#003D8F" stroke-width="3"/>
  
  <!-- Detalles de la pantalla -->
  <rect x="70" y="110" width="198" height="100" rx="4" fill="#A0C8E8" stroke="#003D8F" stroke-width="2"/>
  
  <!-- Botones laterales (naranja) -->
  <circle cx="90" cy="340" r="20" fill="#FF6B35" stroke="#003D8F" stroke-width="2"/>
  <circle cx="252" cy="340" r="20" fill="#FF6B35" stroke="#003D8F" stroke-width="2"/>
  
  <!-- Botón central (gris oscuro) -->
  <rect x="135" y="360" width="71" height="42.792" rx="6" fill="#4A4A4A" stroke="#003D8F" stroke-width="2"/>
  
  <!-- Puertos de entrada (negro) -->
  <g fill="#2A2A2A" stroke="#003D8F" stroke-width="2">
    <rect x="135" y="290" width="71" height="40" rx="4"/>
    <line x1="145" y1="300" x2="145" y2="320" stroke="#FF6B35" stroke-width="2"/>
    <line x1="160" y1="300" x2="160" y2="320" stroke="#FF6B35" stroke-width="2"/>
    <line x1="175" y1="300" x2="175" y2="320" stroke="#FF6B35" stroke-width="2"/>
    <line x1="190" y1="300" x2="190" y2="320" stroke="#FF6B35" stroke-width="2"/>
  </g>
  
  <!-- Indicadores LED (verde/rojo) -->
  <circle cx="60" cy="70" r="6" fill="#32CD32"/>
  <circle cx="80" cy="70" r="6" fill="#FF4500"/>
  
  <!-- Logo MINDSTORMS simulado -->
  <rect x="240" y="65" width="80" height="20" rx="3" fill="#FFFFFF" opacity="0.9"/>
  
  <!-- Puerto USB superior -->
  <rect x="251.45" y="0" width="73.428" height="33.591" rx="4" fill="#6B6B6B" stroke="#003D8F" stroke-width="2"/>
  
  <!-- Antena WiFi -->
  <rect x="19.51" y="0" width="212.745" height="33.591" rx="4" fill="#8B8B8B" stroke="#003D8F" stroke-width="2"/>
  <circle cx="125" cy="16.8" r="8" fill="#0055BF"/>
  
  <!-- Base inferior (gris) -->
  <rect x="17.474" y="480.446" width="307.894" height="31.554" rx="4" fill="#5A5A5A" stroke="#003D8F" stroke-width="3"/>
  
  <!-- Detalles de la base -->
  <circle cx="60" cy="496" r="8" fill="#2A2A2A"/>
  <circle cx="280" cy="496" r="8" fill="#2A2A2A"/>
</svg>`,
    color: "rgb(220, 20, 20)",
    fullDescription: "Aprende robótica y programación con el kit LEGO Mindstorms EV3, construye y programa robots autónomos.",
    objectives: [
      "Entender los componentes del robot EV3",
      "Programar movimientos básicos",
      "Utilizar sensores para navegación autónoma",
      "Crear proyectos de robótica interactivos"
    ],
    topics: [
      "Componentes del EV3: motores y sensores",
      "Programación con bloques EV3",
      "Navegación y detección de obstáculos",
      "Proyectos prácticos de robótica"
    ],
    requirements: [
      "Kit LEGO Mindstorms EV3",
      "Software EV3 instalado",
      "Cable USB o Bluetooth"
    ],
    duration: "3-4 horas",
    modules: [
      {
        id: 1,
        title: "Conociendo el EV3",
        description: "Introducción a los componentes y estructura del robot EV3.",
        duration: "30 min",
        difficulty: "Fácil"
      },
      {
        id: 2,
        title: "Primeros Movimientos",
        description: "Programa el robot para moverse hacia adelante, atrás y girar.",
        duration: "45 min",
        difficulty: "Fácil"
      },
      {
        id: 3,
        title: "Usando Sensores",
        description: "Aprende a usar sensores táctiles, de color y ultrasónicos.",
        duration: "1 hora",
        difficulty: "Intermedio"
      },
      {
        id: 4,
        title: "Navegación Autónoma",
        description: "Crea un robot que evite obstáculos automáticamente.",
        duration: "1 hora",
        difficulty: "Avanzado"
      }
    ]
  },
  {
    id: 3,
    title: "Brazo Robótico",
    description: "Diseña, construye y programa un brazo robótico para realizar tareas de manipulación.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 512 512"><path fill="#FF6B35" d="M324.563 39.156a17 17 0 0 0-3.438.407c-9.223 2.097-15.004 11.275-12.906 20.5c.006.032.022.06.03.093l-22.813 28.188l-3.25 4l1.688 4.906l13.906 40.563l-142.655 24.03c12.343 10.045 19.98 25.555 19.28 42.595a52 52 0 0 1-1.5 10.437l130.532-53.438l-.125-.968c5.93 7.795 15.912 12.005 26.375 10.124c14.91-2.68 24.684-16.683 22.063-31.5c-2.294-12.967-13.248-22.02-25.938-22.28c-1.812-.04-3.636.1-5.5.436c-3.173.57-6.11 1.66-8.75 3.156l-8.343-24.344l18.592-22.968c2.22.41 4.566.407 6.907-.125c9.223-2.1 15.003-11.277 12.905-20.5c-1.835-8.07-9.098-13.487-17.063-13.314zm115 29.032c-1.277.04-2.56.218-3.844.562a17.05 17.05 0 0 0-9.814 7.063l-38.687-6.126l-3.97-.624l-3.188 2.437l-38.656 29.688a46.2 46.2 0 0 1 16.53 10.874l30.314-23.28l37.656 5.968c3.954 5.975 11.386 9.05 18.688 7.094c9.138-2.45 14.542-11.83 12.094-20.97c-1.99-7.422-8.55-12.396-15.844-12.686c-.42-.017-.856-.014-1.28 0zm-39.188 57.906l-1.875.125l-30.375 2.093a45.1 45.1 0 0 1 2.625 18.562L397.938 145l28.03 9.5c.094.592.186 1.19.344 1.78c2.45 9.14 11.863 14.575 21 12.126s14.543-11.862 12.094-21c-2.448-9.136-11.832-14.54-20.97-12.094a17.1 17.1 0 0 0-4.717 2.063l-31.564-10.688zm-34.563 38.5a46.5 46.5 0 0 1-11.937 14.78l42.594 23.564a17.1 17.1 0 0 0 .56 5.53c2.45 9.14 11.832 14.574 20.97 12.126c9.138-2.45 14.542-11.862 12.094-21c-2.448-9.136-11.833-14.542-20.97-12.094c-.408.11-.793.238-1.187.375l-42.125-23.28zm-244.125 4.187c-15.272.178-28.172 10.388-32.156 24.532l63.626-4.125c-4.89-11.59-16.144-19.853-29.72-20.375a35 35 0 0 0-1.75-.03zm33.626 39l-65.688 4.282c3.957 13.412 16.086 23.334 31 23.907c17.34.664 31.975-11.602 34.688-28.19zm8.53 26c-10.032 13.228-26.167 21.558-43.937 20.876a52 52 0 0 1-3.312-.22l53.47 84.19c8.282-19.396 26.015-33.782 47.155-37.532l-53.376-67.313zm63.813 85.064c-23.575.275-42.9 18.79-43.875 42.5a44.1 44.1 0 0 0 3.5 19.187l71.907-49.217c-7.55-7.335-17.78-11.998-29.25-12.438c-.768-.03-1.52-.04-2.28-.03zm41.844 28.03l-71.375 48.876c7.424 6.734 17.208 10.987 28.125 11.406c24.605.945 45.182-17.993 46.188-42.47c.258-6.297-.803-12.316-2.938-17.81zm-86.406 60.188l-7.47 43.438H280l-9.03-41.563c-11.892 11.045-27.98 17.576-45.408 16.907c-16.657-.64-31.6-7.736-42.468-18.78zm-38.53 62.125v24.75h169.374v-24.75H144.563z"/></svg>`,
    color: "rgb(220, 20, 20)",
    fullDescription: "Aprende los principios de la robótica industrial trabajando con un brazo robótico de múltiples ejes.",
    objectives: [
      "Comprender la cinemática de un brazo robótico",
      "Programar movimientos precisos",
      "Controlar servomotores y actuadores",
      "Realizar tareas de pick and place"
    ],
    topics: [
      "Grados de libertad y cinemática",
      "Control de servomotores",
      "Programación de trayectorias",
      "Aplicaciones industriales"
    ],
    requirements: [
      "Kit de brazo robótico",
      "Arduino o controlador compatible",
      "Software de programación"
    ],
    duration: "4-5 horas",
    modules: [
      {
        id: 1,
        title: "Fundamentos del Brazo Robótico",
        description: "Aprende sobre grados de libertad y cinemática básica.",
        duration: "45 min",
        difficulty: "Fácil"
      },
      {
        id: 2,
        title: "Ensamblaje y Conexiones",
        description: "Ensambla el brazo y conecta los servomotores al controlador.",
        duration: "1 hora",
        difficulty: "Fácil"
      },
      {
        id: 3,
        title: "Control de Movimientos",
        description: "Programa movimientos básicos de cada articulación.",
        duration: "1.5 horas",
        difficulty: "Intermedio"
      },
      {
        id: 4,
        title: "Proyecto Pick and Place",
        description: "Crea un sistema automatizado para recoger y colocar objetos.",
        duration: "1.5 horas",
        difficulty: "Avanzado"
      }
    ]
  },
  {
    id: 4,
    title: "PLC - Controlador Lógico Programable",
    description: "Aprende a programar PLCs para automatización industrial y control de procesos.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 520" width="600" height="520">
  <!-- Rail superior -->
  <rect x="120" y="40" width="360" height="80" rx="12" ry="12" fill="#4169E1" stroke="#1E3A8A" stroke-width="18"/>
  <!-- Cuerpo principal -->
  <rect x="90" y="120" width="420" height="280" rx="18" ry="18" fill="#5B8DEE" stroke="#1E3A8A" stroke-width="18"/>
  <!-- Rail inferior -->
  <rect x="120" y="400" width="360" height="80" rx="12" ry="12" fill="#4169E1" stroke="#1E3A8A" stroke-width="18"/>
  
  <!-- Pines superiores -->
  <g fill="#FFD700" stroke="#1E3A8A" stroke-width="12">
    <line x1="150" y1="80" x2="150" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="150" cy="80" r="14"/>
    <line x1="210" y1="80" x2="210" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="210" cy="80" r="14"/>
    <line x1="270" y1="80" x2="270" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="270" cy="80" r="14"/>
    <line x1="330" y1="80" x2="330" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="330" cy="80" r="14"/>
    <line x1="390" y1="80" x2="390" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="390" cy="80" r="14"/>
    <line x1="450" y1="80" x2="450" y2="120" stroke="#FFD700" stroke-width="16"/>
    <circle cx="450" cy="80" r="14"/>
  </g>
  
  <!-- Pines inferiores -->
  <g fill="#FFD700" stroke="#1E3A8A" stroke-width="12">
    <line x1="150" y1="400" x2="150" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="150" cy="440" r="14"/>
    <line x1="210" y1="400" x2="210" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="210" cy="440" r="14"/>
    <line x1="270" y1="400" x2="270" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="270" cy="440" r="14"/>
    <line x1="330" y1="400" x2="330" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="330" cy="440" r="14"/>
    <line x1="390" y1="400" x2="390" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="390" cy="440" r="14"/>
    <line x1="450" y1="400" x2="450" y2="440" stroke="#FFD700" stroke-width="16"/>
    <circle cx="450" cy="440" r="14"/>
  </g>
  
  <!-- Pantalla y botón -->
  <rect x="170" y="190" width="160" height="110" rx="10" ry="10" fill="#000000" stroke="#1E3A8A" stroke-width="14"/>
  <circle cx="390" cy="245" r="60" fill="#DC1414" stroke="#1E3A8A" stroke-width="14"/>
</svg>`,
    color: "rgb(220, 20, 20)",
    fullDescription: "Domina la programación de PLCs utilizados en la automatización industrial y control de maquinaria.",
    objectives: [
      "Entender la arquitectura de un PLC",
      "Aprender lenguajes de programación Ladder",
      "Controlar entradas y salidas digitales",
      "Implementar lógica de control industrial"
    ],
    topics: [
      "Introducción a PLCs",
      "Programación en Ladder Logic",
      "Entradas y salidas digitales/analógicas",
      "Temporizadores y contadores"
    ],
    requirements: [
      "PLC o simulador de PLC",
      "Software de programación (TIA Portal, RSLogix, etc.)",
      "Conocimientos básicos de electricidad"
    ],
    duration: "4-6 horas",
    modules: [
      {
        id: 1,
        title: "Introducción a PLCs",
        description: "Qué es un PLC, su historia y aplicaciones industriales.",
        duration: "30 min",
        difficulty: "Fácil"
      },
      {
        id: 2,
        title: "Ladder Logic Básico",
        description: "Aprende el lenguaje de programación Ladder y sus símbolos.",
        duration: "1 hora",
        difficulty: "Fácil"
      },
      {
        id: 3,
        title: "Entradas y Salidas",
        description: "Configura y programa entradas/salidas digitales y analógicas.",
        duration: "1.5 horas",
        difficulty: "Intermedio"
      },
      {
        id: 4,
        title: "Temporizadores y Contadores",
        description: "Implementa temporizadores y contadores en tus programas.",
        duration: "1 hora",
        difficulty: "Intermedio"
      },
      {
        id: 5,
        title: "Proyecto de Automatización",
        description: "Crea un sistema completo de control industrial.",
        duration: "2 horas",
        difficulty: "Avanzado"
      }
    ]
  },
  {
    id: 5,
    title: "CNC - Máquina de Corte",
    description: "Opera y programa máquinas CNC para corte de precisión en diversos materiales.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- bancada superior -->
  <rect x="72" y="160" width="368" height="80" rx="20" ry="20" fill="#708090" stroke="#2F4F4F" stroke-width="14"/>

  <!-- columnas laterales -->
  <g>
    <!-- columna izquierda -->
    <rect x="88" y="60" width="48" height="140" rx="12" ry="12" fill="#778899" stroke="#2F4F4F" stroke-width="14"/>
    <!-- indicadores pequeños columna izquierda -->
    <g transform="translate(108,92)">
      <rect x="-6" y="-18" width="12" height="6" rx="3" ry="3" fill="#32CD32" stroke="none"/>
      <rect x="-6" y="-4" width="12" height="6" rx="3" ry="3" fill="#32CD32" stroke="none"/>
      <rect x="-6" y="10" width="12" height="6" rx="3" ry="3" fill="#32CD32" stroke="none"/>
    </g>

    <!-- columna derecha -->
    <rect x="376" y="60" width="48" height="140" rx="12" ry="12" fill="#778899" stroke="#2F4F4F" stroke-width="14"/>
  </g>

  <!-- travesaño superior -->
  <line x1="136" y1="74" x2="376" y2="74" stroke="#2F4F4F" stroke-width="14" stroke-linecap="round"/>

  <!-- carro/portaherramienta central -->
  <g>
    <!-- caja del carro -->
    <rect x="220" y="22" width="72" height="56" rx="12" ry="12" fill="#C0C0C0" stroke="#2F4F4F" stroke-width="14"/>
    <!-- descenso del husillo -->
    <rect x="242" y="74" width="28" height="34" rx="6" ry="6" fill="#A9A9A9" stroke="#2F4F4F" stroke-width="14"/>
    <!-- punta/herramienta -->
    <path d="M256 108 v18" stroke="#FFD700" stroke-width="10" stroke-linecap="round"/>
    <path d="M252 126 l8 8 l8 -8" stroke="#FFD700" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  </g>

  <!-- base inferior -->
  <g>
    <rect x="56" y="240" width="400" height="160" rx="12" ry="12" fill="#696969" stroke="#2F4F4F" stroke-width="14"/>
    <!-- rejilla vertical inferior -->
    <g stroke="#2F4F4F" stroke-width="12" stroke-linecap="round">
      <line x1="120" y1="300" x2="120" y2="380"/>
      <line x1="170" y1="300" x2="170" y2="380"/>
      <line x1="220" y1="300" x2="220" y2="380"/>
      <line x1="270" y1="300" x2="270" y2="380"/>
      <line x1="320" y1="300" x2="320" y2="380"/>
      <line x1="370" y1="300" x2="370" y2="380"/>
    </g>
    <!-- patas -->
    <rect x="96" y="392" width="40" height="30" rx="6" ry="6" fill="#808080" stroke="#2F4F4F" stroke-width="14"/>
    <rect x="376" y="392" width="40" height="30" rx="6" ry="6" fill="#808080" stroke="#2F4F4F" stroke-width="14"/>
  </g>

  <!-- botones/controles -->
  <g>
    <circle cx="360" cy="200" r="10" fill="#32CD32" stroke="#2F4F4F" stroke-width="2"/>
    <circle cx="388" cy="200" r="10" fill="#FF4500" stroke="#2F4F4F" stroke-width="2"/>
    <rect x="348" y="216" width="32" height="8" rx="4" ry="4" fill="#1E90FF" stroke="none"/>
    <rect x="392" y="216" width="16" height="8" rx="4" ry="4" fill="#1E90FF" stroke="none"/>
  </g>
</svg>
`,
    color: "rgb(220, 20, 20)",
    fullDescription: "Aprende a operar máquinas CNC para fabricación de precisión utilizando código G y software CAM.",
    objectives: [
      "Comprender el funcionamiento de máquinas CNC",
      "Aprender código G básico",
      "Usar software CAD/CAM",
      "Realizar operaciones de corte seguras"
    ],
    topics: [
      "Fundamentos de CNC",
      "Código G y programación",
      "Software CAD/CAM",
      "Seguridad en operación de máquinas"
    ],
    requirements: [
      "Acceso a máquina CNC o simulador",
      "Software CAD/CAM (Fusion 360, etc.)",
      "Conocimientos básicos de diseño"
    ],
    duration: "5-6 horas",
    modules: [
      {
        id: 1,
        title: "Introducción a CNC",
        description: "Qué es una máquina CNC y sus aplicaciones.",
        duration: "45 min",
        difficulty: "Fácil"
      },
      {
        id: 2,
        title: "Código G Básico",
        description: "Aprende los comandos fundamentales del código G.",
        duration: "1.5 horas",
        difficulty: "Intermedio"
      },
      {
        id: 3,
        title: "Software CAD/CAM",
        description: "Diseña piezas y genera código G automáticamente.",
        duration: "2 horas",
        difficulty: "Intermedio"
      },
      {
        id: 4,
        title: "Operación Segura",
        description: "Normas de seguridad y mejores prácticas.",
        duration: "1 hora",
        difficulty: "Intermedio"
      },
      {
        id: 5,
        title: "Proyecto de Corte",
        description: "Diseña y fabrica una pieza completa.",
        duration: "2 horas",
        difficulty: "Avanzado"
      }
    ]
  },
  {
    id: 6,
    title: "Domótica",
    description: "Automatiza tu hogar con sistemas inteligentes de control y monitoreo.",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24">
  <g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M8 19V11l4-5 4 5v8H8z"/>
    <path d="M11 19v-4h2v4"/>
    <path d="M12 16.5h.01"/>
    <path d="M12 17.5h.01"/>
    <path d="M8 13H5"/>
    <path d="M5 9v8"/>
    <path d="M5 9H3"/>
    <path d="M5 17H3"/>
    <circle cx="2" cy="9" r="1.5"/>
    <circle cx="2" cy="17" r="1.5"/>
    <path d="M16 13h3"/>
    <path d="M19 9v8"/>
    <path d="M19 9h2"/>
    <path d="M19 17h2"/>
    <circle cx="22" cy="9" r="1.5"/>
    <circle cx="22" cy="17" r="1.5"/>
    <path d="M12 19v2"/>
    <path d="M9 21h6"/>
    <circle cx="8" cy="21" r="1.5"/>
    <circle cx="16" cy="21" r="1.5"/>
  </g>
</svg>`,
    fullDescription: "Crea sistemas domóticos inteligentes para automatizar iluminación, temperatura, seguridad y más.",
    objectives: [
      "Comprender los fundamentos de domótica",
      "Implementar sistemas de control inteligente",
      "Integrar sensores y actuadores",
      "Crear interfaces de control remoto"
    ],
    topics: [
      "Introducción a la domótica",
      "Protocolos de comunicación (WiFi, Zigbee, etc.)",
      "Sensores y actuadores domésticos",
      "Plataformas IoT y aplicaciones móviles"
    ],
    requirements: [
      "Microcontrolador (Arduino, ESP32, Raspberry Pi)",
      "Sensores y relés",
      "Conocimientos básicos de electrónica y programación"
    ],
    duration: "4-5 horas",
    modules: [
      {
        id: 1,
        title: "Fundamentos de Domótica",
        description: "Qué es la domótica y sus beneficios.",
        duration: "30 min",
        difficulty: "Fácil"
      },
      {
        id: 2,
        title: "Control de Iluminación",
        description: "Automatiza el encendido y apagado de luces.",
        duration: "1 hora",
        difficulty: "Fácil"
      },
      {
        id: 3,
        title: "Sensores Ambientales",
        description: "Monitorea temperatura, humedad y calidad del aire.",
        duration: "1.5 horas",
        difficulty: "Intermedio"
      },
      {
        id: 4,
        title: "Control Remoto WiFi",
        description: "Controla tu hogar desde tu smartphone.",
        duration: "1.5 horas",
        difficulty: "Intermedio"
      },
      {
        id: 5,
        title: "Sistema Integrado",
        description: "Crea un sistema domótico completo y personalizado.",
        duration: "2 horas",
        difficulty: "Avanzado"
      }
    ]
  }
];
