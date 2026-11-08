# Changelog

Todos los cambios relevantes de este proyecto se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] - 2026-10-28

### Añadido
- Reglas declarativas para forzar `Content-Disposition: inline` en URLs de PDF.
- Content script con `MutationObserver` que elimina el atributo `download`.
- Soporte para el patrón `forcedownload=1` de Moodle.
- Compatibilidad con Chrome, Edge, Brave y Firefox 113+.
## [1.1.0] - 2026-11-08

### Añadido
- Alt+clic en enlaces a PDF para descargarlos en lugar de previsualizarlos.
- Botón en la barra para pausar y reactivar la extensión.
- Permisos `downloads` y `storage`.