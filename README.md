

# Proyecto Base: Pruebas Visual Regression Testing (VRT) con ResembleJS

[ResembleJS](https://github.com/rsmbl/Resemble.js/blob/master/README.md) es una biblioteca de código abierto para comparación visual de imágenes. Es usada en procesos de prueba de regresión visual automatizada, donde se desea detectar diferencias entre dos capturas de pantalla o imágenes.

## Caracteristicas Principles:
1. *Comparación visual a nivel de píxel*
Detecta cambios precisos entre dos imágenes, resaltando diferencias por color, brillo, transparencia o desplazamientos.
2. *Imagen de diferencia (diff)*
Genera automáticamente una imagen que resalta las diferencias encontradas.
3. *Métricas cuantitativas*
Devuelve un porcentaje de diferencia (misMatchPercentage), útil para automatizar decisiones.
4. *Opciones de comparación avanzadas*
	- Ignorar antialiasing (suavizado).
	- Ignorar diferencias de color.
	- Ignorar canal alfa (transparencia).
	- Escalar imágenes para ajustarlas si tienen diferentes tamaños.
5. *Soporte para múltiples entornos*
	- Puede usarse en el navegador o en Node.js.


## Detalles adicionales:

*Región personalizada:* 
Se pueden comparar solo partes específicas de las imágenes usando coordenadas.*Output configurable:* Personalización del color de las diferencias, transparencia del dif, o formato de imagen resultante.
*Integración con herramientas de testing:* 
Muy utilizado junto con frameworks como Playwright, Puppeteer o Cypress para verificar visualmente cambios en interfaces.


## Requisitos Básicos

- Node.js (versión 18.x.x). para una mayor compatibilidad.
- npm o yarn para la gestión de dependencias.


## Instalación

Instala las dependencias necesarias utilizando npm: En el ejemplo se usa 18.18.2

```bash
npm install 18.18.2
```

## Configuracion

Se va a usar Playwright para automatizar la prueba:

```bash
npm install playwright

```

Para la libreria de ResembleJS: 

```bash
npm install resemblejs

```

Para que resemblejs funcione correctamente con canvas, necesitas tener instaladas ciertas bibliotecas:

```bash
npm install canvas

```
Canvas se encarga de comparacion de pixeles entre imagenes.

En el codigo consiste simplemente es llamar la libreria:

```javacript
const resemble = require('resemblejs');
```

y la comparacion consiste en ajustar las configuracion para determinar que tan exacta puedo comparar las imagenes:

vconst compareImages = require("resemblejs/compareImages");
const fs = require("mz/fs");

```javascript
async function getDiff() {
    const options = {
        output: {
            errorColor: {
                red: 255,
                green: 0,
                blue: 255
            },
            errorType: "movement",
            transparency: 0.3,
            largeImageThreshold: 1200,
            useCrossOrigin: false,
            outputDiff: true
        },
        scaleToSameSize: true,
        ignore: "antialiasing"
    };


    const data = await compareImages(await fs.readFile("./your-image-path/People.jpg"), await fs.readFile("./your-image-path/People2.jpg"), options);

    await fs.writeFile("./output.png", data.getBuffer());
}

getDiff();

```

## Ejecución de Pruebas VRT

- Para ejecutar las pruebas

    ```bash
    node index.js
    
    ```

Una vez terminada la ejecucion, Los resultados aparecen en la consola para Chromium, Firefox y Webkit

```
Execution finished. Check the report under the results folder
{
  chromium: {
    isSameDimensions: true,
    dimensionDifference: { width: 0, height: 0 },
    rawMisMatchPercentage: 1.9823133680555556,
    misMatchPercentage: '1.98',
    diffBounds: { top: 58, left: 14, bottom: 305, right: 701 },
    analysisTime: 38
  },
  webkit: {
    isSameDimensions: true,
    dimensionDifference: { width: 0, height: 0 },
    rawMisMatchPercentage: 1.8945312499999998,
    misMatchPercentage: '1.89',
    diffBounds: { top: 58, left: 14, bottom: 286, right: 701 },
    analysisTime: 43
  },
  firefox: {
    isSameDimensions: true,
    dimensionDifference: { width: 0, height: 0 },
    rawMisMatchPercentage: 1.9097222222222223,
    misMatchPercentage: '1.91',
    diffBounds: { top: 61, left: 14, bottom: 329, right: 701 },
    analysisTime: 31
  }
}
```
