# Noticias TendenciaRD - Panel de Administración Local

Este es el sistema de administración de Noticias TendenciaRD configurado para ejecutarse localmente en tu PC. Todos los cambios que realices aquí se reflejarán automáticamente en tu sitio web conectado a Firebase.

## Requisitos Previos

1.  **Node.js**: Debes tener instalado Node.js en tu computadora. Puedes descargarlo desde [nodejs.org](https://nodejs.org/).
2.  **Firebase**: El sistema ya está conectado a tu proyecto de Firebase.

## Características del Panel Local

-   **Links Públicos**: Los botones de "Compartir" y "Copiar Enlace" generan automáticamente links que apuntan a tu sitio web público (`https://tendenciard-1.web.app`), no a tu dirección local. Esto permite compartir noticias reales directamente desde tu panel de control.
-   **Seguridad Local**: El panel está protegido para uso exclusivo en `localhost`. Si intentas abrirlo desde un dominio público, verás una advertencia de seguridad.

## Cómo Abrir el Panel

### En Windows:
1.  Haz doble clic en el archivo `AbrirTendenciaRD.bat`.
2.  Se abrirá una ventana negra (consola) que instalará las dependencias necesarias la primera vez.
3.  Tu navegador se abrirá automáticamente en `http://localhost:3000`.

### En Mac:
1.  Haz doble clic en el archivo `AbrirTendenciaRD.command`.
    *   *Nota: Si Mac te da un error de permisos, abre la Terminal, escribe `chmod +x ` (con un espacio al final), arrastra el archivo `.command` a la ventana y presiona Enter.*
2.  Tu navegador se abrirá automáticamente en `http://localhost:3000`.

## Configuración de Firebase

Si necesitas cambiar las credenciales de Firebase, edita el archivo:
`src/firebase.ts`

Busca la sección `firebaseConfig` y reemplaza los valores con los de tu nuevo proyecto.

## Estructura del Proyecto

-   `src/`: Contiene todo el código fuente del panel (React + TypeScript).
-   `src/components/AdminPanel.tsx`: El corazón del panel de administración.
-   `public/`: Archivos estáticos e imágenes.
-   `package.json`: Lista de dependencias y comandos del sistema.

## Notas
-   No cierres la ventana de la consola mientras estés usando el panel, ya que es el servidor que mantiene la aplicación funcionando.
-   Cualquier noticia o publicidad que edites se guarda directamente en la base de datos de Firebase en la nube.
