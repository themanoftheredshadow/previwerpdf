# Changelog

Todos los cambios relevantes de este proyecto se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [1.0.0] - 2026-10-28

### Añadido
- Reglas declarativas para forzar `Content-Disposition: inline` en URLs de PDF.
- Content script con `MutationObserver` que elimina el atributo `download`.
- Soporte para el patrón `forcedownload=1` de Moodle.
- Compatibilidad con Chrome, Edge, Brave y Firefox 113+.