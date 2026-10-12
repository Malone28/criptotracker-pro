# CriptoTracker PRO: Reglas de Despliegue y Arquitectura

1. **PROHIBICIÓN ESTRICTA DE GIT:**
   - NUNCA ejecutar `git add`, `git commit`, `git push` ni manipular ramas remotas.
   - Cualquier despliegue a producción web se realiza exclusivamente mediante la CLI de Vercel: `npx vercel --prod`.

2. **ARQUITECTURA APP SHELL EN IOS (iPhone / Capacitor):**
   - El header (`.app-header`) debe permanecer inmóvil y anclado en la parte superior sin verse afectado por el scroll vertical.
   - El scroll se aísla exclusivamente dentro de `.main-content` con `-webkit-overflow-scrolling: touch` y `overscroll-behavior-y: contain`.
   - El indicador de balance/portfolio (`.portfolio-fab`) permanece fijo en la esquina inferior derecha respetando el Home Indicator (`env(safe-area-inset-bottom)`).
