# IAmAZING CONTENT // website

Sitio estático (HTML + CSS + JS, sin build), publicado con GitHub Pages desde `master`.

```
index.html              → home: carrusel de clientes, speech, prueba de trabajo, footer
portafolio/index.html   → reels, canales de YouTube, CTA, planes
assets/css/iamc.css     → estilos (tokens del brandbook, mobile first)
assets/js/config.js     → DATOS EDITABLES: contacto, clientes, reels, precios, formulario
assets/js/app.js        → efectos (fondo ASCII, intro, scramble, contadores) y render
assets/brand/           → logos e iconos del Kit-IA (brandbook)
assets/video/           → intro.mp4 y reels del portafolio (.mp4 9:16, < 8 MB)
```

## Ver en local
Abre `index.html` con doble clic, o en esta carpeta: `npx serve` → http://localhost:3000

## Cambiar contenido
Casi todo se cambia en `assets/js/config.js`. Lo marcado `[ PENDIENTE ]` lo completa el equipo.

## Flujo de trabajo
1. Rama nueva por cambio (`feat/...`, `fix/...`).
2. Pull request → revisión del equipo → merge a `master`.
3. GitHub Pages publica solo al entrar a `master`.
