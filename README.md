# PREVIWERPDF

Extensión de navegador (Manifest V3) de código abierto que evita la descarga
automática de archivos PDF y fuerza su previsualización en el navegador.

![Licencia MIT](https://img.shields.io/badge/licencia-MIT-green)
![Manifest V3](https://img.shields.io/badge/manifest-v3-blue)

## Características

- Reescribe la cabecera `Content-Disposition` de `attachment` a `inline` en
  respuestas de URLs que apuntan a un PDF.
- Elimina el atributo `download` de los enlaces a PDF, también en contenido
  cargado dinámicamente.
- Limpia el parámetro `forcedownload=1` (típico de Moodle).
- Sin recopilación de datos, sin servidores externos, sin analítica.

## Navegadores compatibles

| Navegador | Estado |
|---|---|
| Google Chrome | Compatible |
| Microsoft Edge, Brave (Chromium) | Compatible |
| Firefox 113 o superior | Compatible (ver nota de permisos) |
| Safari | No soportado |

## Instalación

Descarga o clona el repositorio:

```bash
git clone https://github.com/themanoftheredshadow/previwerpdf.git
```

### Chrome / Edge / Brave

1. Abre `chrome://extensions` (o `edge://extensions`, `brave://extensions`).
2. Activa el **Modo de desarrollador**.
3. Pulsa **Cargar descomprimida** y selecciona la carpeta del proyecto.
4. Comprueba que el visor de PDF integrado esté activo, por ejemplo en
   `chrome://settings/content/pdfDocuments` ("Abrir PDF en Chrome").

### Firefox

1. Abre `about:debugging#/runtime/this-firefox`.
2. Pulsa **Cargar complemento temporal** y selecciona `manifest.json`.
3. En `about:addons`, entra en la extensión, pestaña **Permisos**, y activa
   el acceso a los datos de todos los sitios web. Sin este paso no actúa.
4. En `about:preferences` → General → Aplicaciones → PDF, elige
   **Abrir en Firefox**.

Los complementos temporales de Firefox se pierden al cerrar el navegador.

## Cómo funciona

1. `rules.json` define reglas de `declarativeNetRequest` que, mediante
   expresiones regulares sobre la URL, modifican las cabeceras de respuesta
   de documentos y marcos.
2. `content.js` recorre el DOM con un `MutationObserver` y corrige los
   enlaces a PDF que fuerzan la descarga desde la propia interfaz.

## Limitaciones

- La detección se basa en la URL (extensión `.pdf` o parámetros de tipo PDF).
  Un PDF servido desde una URL sin ninguna pista no se interceptará.
- No afecta a descargas generadas con JavaScript (blobs, `fetch` + `click()`).
- Si un servidor devuelve una página de error HTML en una URL `.pdf`, se
  mostrará como PDF roto, porque la extensión fuerza `Content-Type`.

## Permisos

| Permiso | Motivo |
|---|---|
| `declarativeNetRequest` | Modificar cabeceras de respuesta |
| `scripting` | Reservado para futuras mejoras |
| `host_permissions: <all_urls>` | Actuar en cualquier sitio web |

## Privacidad

La extensión no recopila, almacena ni transmite ningún dato. Todo el
procesamiento ocurre localmente en tu navegador.

## Estructura del proyecto

```
├── manifest.json   # Configuración y permisos
├── rules.json      # Reglas declarativas de cabeceras
├── content.js      # Limpieza de enlaces en el DOM
├── CHANGELOG.md
└── LICENSE
```

## Estado del proyecto

Este proyecto se publica como código abierto, pero por ahora **no acepta
contribuciones externas** (issues ni pull requests). Puedes usarlo, copiarlo
y modificarlo libremente según los términos de la licencia MIT, incluso
haciendo tu propio fork.

## Licencia

[MIT](LICENSE)
