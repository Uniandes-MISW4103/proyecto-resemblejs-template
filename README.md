# Proyecto Base: Pruebas de Regresión Visual (VRT) con ResembleJS

[ResembleJS](https://github.com/rsmbl/Resemble.js) compara dos imágenes y calcula el porcentaje de
píxeles distintos (`misMatchPercentage`), el área donde están las diferencias y una imagen que las
resalta. Permite ignorar el _antialiasing_, los colores o la transparencia. En este módulo se
combina con [Playwright Test](https://playwright.dev), que toma las capturas de pantalla.

Este módulo contiene la configuración base y un ejemplo de regresión visual que pueden usar como
punto de partida para comparar versiones de la aplicación del proyecto.

## Requisitos

- Node.js 24 (`lts/krypton`). El módulo incluye un `.nvmrc`, por lo que pueden usar `nvm use`.
- npm (incluido con Node.js).
- Navegador: `prepare` descarga Chromium para Playwright. En Linux (por ejemplo, en un servidor de
  CI) también se necesitan librerías del sistema: `npx playwright install --with-deps chromium`.
- ResembleJS usa [`canvas`](https://github.com/Automattic/node-canvas), un módulo nativo. El módulo
  incluye `canvas` 3, que trae binarios precompilados para macOS, Linux y Windows, así que
  normalmente no hace falta compilar nada (ver [Sobre `canvas`](#sobre-canvas)).

## Instalación

Desde la **raíz del repositorio** del proyecto:

```bash
npm run resemblejs:install
npm run resemblejs:prepare
```

> [!IMPORTANT]
> Instalen siempre desde la raíz. `resemblejs:install` deja las dependencias del módulo en su propia
> carpeta `node_modules`, aisladas de los demás módulos. Un `npm install` dentro de la carpeta del
> módulo instala en la raíz del repositorio y modifica el `package-lock.json` raíz sin ese aislamiento.

## Ejecución

| Acción | Desde la raíz | Desde `vrt/misw-4103-resemblejs` |
|---|---|---|
| Tomar las capturas y compararlas | `npm run resemblejs:test` | `npm test` |
| Generar el reporte de imágenes (después de `test`) | `npm run resemblejs:report` | `npm run report` |
| Ver el reporte HTML de Playwright | — | `npx playwright show-report` |

El porcentaje de diferencia se imprime en la consola y queda en `result-<navegador>.json`. El reporte
de imágenes queda en `test-results/<carpeta-de-la-prueba>/index.html` dentro del módulo, junto a las
capturas `before-*.png`, `after-*.png` y la diferencia `compare-*.png`.

## Estructura

```plaintext
misw-4103-resemblejs/
├── .nvmrc
├── package.json
├── abp.cjs                # lee la configuración de la aplicación bajo pruebas (.env)
├── playwright.config.js   # configuración de Playwright Test
├── vrt.config.json        # página del ejemplo y opciones de ResembleJS
├── index.js               # genera el reporte HTML de imágenes
├── public/index.css       # estilos del reporte
└── e2e/
    └── example.spec.js    # ejemplo incluido
```

`test-results/` y `playwright-report/` están en el `.gitignore`, igual que todos los `*.png` y
`*.html` del módulo.

## Configuración

La URL de las dos versiones y el administrador de la aplicación bajo pruebas (ABP) están en el
archivo `.env` de la raíz del repositorio, el mismo que usa `npm run abp:up` para desplegar Ghost. No
los copien en el módulo: `abp.cjs` lee ese archivo. Las variables disponibles son `ABP_URL` (versión
base), `ABP_RC_URL` (versión nueva), `ABP_ADMIN_NAME`, `ABP_ADMIN_EMAIL` y `ABP_ADMIN_PASSWORD`. Una
variable de entorno con el mismo nombre tiene prioridad sobre el `.env`; fuera de un repositorio del
proyecto (sin `.env`) se usan los valores por defecto de `abp.cjs`. Las pruebas importan las variables así:

```javascript
import abp from "../abp.cjs";

await page.goto(`${abp.ABP_RC_URL}/ghost/`);
```

- **`playwright.config.js`**: `use.baseURL` es `ABP_URL`, la versión base de la aplicación
  (`page.goto("/ghost/")`); `outputDir` es `./test-results`; solo se usa Chromium.
- **`vrt.config.json`**:
  - `url`: página que compara el ejemplo y que se muestra en el reporte.
  - `options`: opciones de `compareImages` de ResembleJS, por ejemplo `ignore` (`"antialiasing"`,
    `"colors"`, `"alpha"`, `"less"`, `"nothing"`), `scaleToSameSize` y `output` (color y tipo de
    resaltado de las diferencias). Ver la
    [documentación de opciones](https://github.com/rsmbl/Resemble.js#nodejs).

## Ejemplo incluido

`e2e/example.spec.js` abre la página de registro del demo
[angular-6-registration-login-example](https://angular-6-registration-login-example.stackblitz.io) alojado en StackBlitz (no la ABP, `url` de
`vrt.config.json`), inicia el proyecto y toma una captura; llena el formulario con el nombre, el
correo y la contraseña de `ABP_ADMIN_*`, toma otra captura y las compara con ResembleJS. Muestra cómo
usar las credenciales del `.env` sin resolver las pruebas del proyecto. Guarda la imagen de diferencias y un `result-<navegador>.json` con
`misMatchPercentage`, `diffBounds` y otros datos; `report` arma una página con las tres imágenes y el
porcentaje.

El ejemplo **no tiene aserciones**: siempre pasa y sirve para ver el flujo completo. En sus pruebas
usen `misMatchPercentage` para decidir si hay una regresión, y comparen la misma página en las dos
versiones de la aplicación (`ABP_URL` y `ABP_RC_URL`).

## Sobre `canvas`

ResembleJS 5.0.0 (su última versión) pide exactamente `canvas` 2.11.2, que no tiene binarios
precompilados para Node 22 o superior. Al instalar, npm intenta compilarlo:

- Si el equipo tiene las herramientas de compilación, `canvas` 2.11.2 se compila y se usa (la
  instalación tarda más).
- Si no, npm lo omite (es opcional) y ResembleJS usa el `canvas` 3 que incluye este módulo.

En ambos casos las pruebas funcionan. Por eso `npm ls canvas` puede mostrar
`invalid: canvas@3.2.3`: es esperado.

## Solución de problemas

- **`Executable doesn't exist at …`**: falta el navegador; ejecuten `npm run resemblejs:prepare`.
- **Errores de `node-gyp`/`canvas` durante la instalación**: si la instalación termina, son los
  intentos de compilar `canvas` 2.11.2 y se pueden ignorar. Si la instalación falla, verifiquen que
  `canvas` 3 se haya instalado (`npm ls canvas` desde la carpeta del módulo).
- **`No test result folders found`** al generar el reporte: ejecuten antes `resemblejs:test`. Si
  cambian el nombre del archivo, del `describe` o de la prueba, actualicen `OUTPUT_FOLDER_PREFIX` en
  `index.js`, porque Playwright nombra la carpeta de resultados con ellos.
- **Al fallar una prueba la terminal se queda esperando**: Playwright abrió su reporte HTML; usen
  `Ctrl+C` o definan `PW_TEST_HTML_REPORT_OPEN=never`.
- **Advertencia `EBADENGINE`**: están usando una versión de Node.js anterior a la 24.

## Referencias

- [ResembleJS](https://github.com/rsmbl/Resemble.js)
- [node-canvas](https://github.com/Automattic/node-canvas)
- [Capturas de pantalla en Playwright](https://playwright.dev/docs/screenshots)
