# Proyecto Base: Pruebas Visual Regression Testing (VRT) con ResembleJS

[ResembleJS](https://github.com/rsmbl/Resemble.js/blob/master/README.md) es una biblioteca de código abierto para comparación visual de imágenes. Es usada en procesos de prueba de regresión visual automatizada, donde se desea detectar diferencias entre dos capturas de pantalla o imágenes.

## Caracteristicas Principles

1. _Comparación visual a nivel de píxel_
   Detecta cambios precisos entre dos imágenes, resaltando diferencias por color, brillo, transparencia o desplazamientos.
2. _Imagen de diferencia (diff)_
   Genera automáticamente una imagen que resalta las diferencias encontradas.
3. _Métricas cuantitativas_
   Devuelve un porcentaje de diferencia (misMatchPercentage), útil para automatizar decisiones.
4. _Opciones de comparación avanzadas_
   - Ignorar antialiasing (suavizado).
   - Ignorar diferencias de color.
   - Ignorar canal alfa (transparencia).
   - Escalar imágenes para ajustarlas si tienen diferentes tamaños.
5. _Soporte para múltiples entornos_
   - Puede usarse en el navegador o en Node.js.

## Detalles adicionales

1. _Región personalizada:_
   Se pueden comparar solo partes específicas de las imágenes usando coordenadas.
2. _Output configurable:_ Personalización del color de las diferencias, transparencia del dif, o formato de imagen resultante.
3. _Integración con herramientas de testing:_
   Muy utilizado junto con frameworks como Playwright, Puppeteer o Cypress para verificar visualmente cambios en interfaces.

## Requisitos Básicos

- Node.js (versión 22 o superior). Recomendamos utilizar la versión `lts/jod`.
- npm para la gestión de dependencias.
- Herramientas de compilación nativas requeridas por el addon `canvas`:
  - **macOS**: Xcode Command Line Tools (`xcode-select --install`)
  - **Linux**: `build-essential`, `libcairo2-dev`, `libpango1.0-dev`, `libjpeg-dev`, `libgif-dev`, `librsvg2-dev`
  - **Windows**: `windows-build-tools` vía `npm install --global windows-build-tools`

## Instalación

Desde la **raíz del repositorio**:

```bash
npm run resemblejs:install
npm run resemblejs:prepare
```

O bien, desde el directorio del módulo:

```bash
npm install
npm run prepare
```

> **Nota:** La dependencia `canvas` es un addon nativo. Si la instalación falla, asegúrate de tener instaladas las herramientas de compilación nativas listadas en los requisitos.

## Ejecución de Pruebas

Desde la **raíz del repositorio**:

- Para ejecutar las pruebas de regresión visual con Chromium (navegador por defecto):

  ```bash
  npm run resemblejs:test
  ```

  Los resultados se registran en la consola por navegador y se almacenan en `test-results/`.

- Para ver el reporte HTML de Playwright una vez termine la ejecución:

  ```bash
  npx playwright show-report
  ```

- Para generar el reporte básico con las imágenes comparadas (ejecutar después de `resemblejs:test`):

  ```bash
  npm run resemblejs:report
  ```

> **Nota:** El módulo usa `"type": "module"` (ES Modules). ResembleJS es una librería CommonJS, por lo que se importa usando `createRequire` de Node.js para garantizar compatibilidad. Las opciones de comparación se configuran en `vrt.config.json`.
