# CriptoTracker PRO - Reglas Obligatorias del Proyecto

## 1. REGLA ESTRICTA DE DESPLIEGUE Y GIT (MANDATORIA)
- **PROHIBICIÓN TOTAL DE COMANDOS GIT:** Bajo ninguna circunstancia se debe ejecutar `git add`, `git commit`, `git push` ni manipular repositorios o ramas remotas.
- **DESPLIEGUE EXCLUSIVO A VERCEL:** Cualquier subida o actualización a producción se realiza exclusivamente mediante la CLI de Vercel (`npx vercel deploy --prod --yes` o similar) sin pasar por Git.
- **COMPILACIÓN ESTRICTA EN CAPACITOR:** Al modificar código web (`js/`, `css/`, `index.html`), es OBLIGATORIO ejecutar `npm run sync` antes de compilar o relanzar la app nativa (ej. `xcodebuild` o `npx cap run ios`), para evitar que el empaquetador cachee y ejecute código obsoleto.

## 2. ARQUITECTURA APP SHELL EN IOS (iPhone / Capacitor)
- En dispositivos iPhone y Capacitor iOS, el header (`.app-header`) debe permanecer completamente fijo e inmóvil en la parte superior, utilizando aceleración por hardware (`translateZ(0)`).
- El scroll vertical debe estar estrictamente confinado dentro del contenedor `.main-content` con `-webkit-overflow-scrolling: touch` y `overscroll-behavior-y: contain`.
- La barra lateral derecha de scroll no debe influir ni mover el header ni el indicador inferior de saldo (`.portfolio-fab`).

## 3. NOMBRE OFICIAL DE LA APLICACIÓN Y MARCA (MANDATORIA)
- **MARCA Y NOMBRE OFICIAL:** El nombre oficial de la aplicación y marca es **`CryptoTracker.Pro`** (con "y" y extensión ".Pro", correspondiente al dominio oficial `criptotracker.pro`).
- **PRESENCIA UNIVERSAL:** Debe utilizarse `CryptoTracker.Pro` en todos los lugares donde figure la marca o el logo:
  - Cabecera de la aplicación (`.logo-main-name`)
  - Menú lateral hamburguesa (`#mobile-nav-drawer .logo-main-name`)
  - Título de la página (`<title>`) y etiquetas OpenGraph / meta tags
  - Claves de internacionalización (`i18n.js`: `app_title`, `logo_title`, etc.)
  - Pie de página, avisos legales y diálogos de autenticación

## 4. POLÍTICA DE AUTENTICACIÓN SOCIAL NATIVA (GOOGLE Y APPLE)
- **PROHIBICIÓN DE FORMULARIOS SIMULADOS:** Jamás se debe degradar un inicio de sesión social (Google o Apple) a un formulario interno que pida al usuario contraseña manual bajo el pretexto del proveedor social.
- **FLUJO OAUTH OFICIAL EXCLUSIVO:** Los botones de "Continuar con Google" y "Continuar con Apple" deben ejecutar exclusivamente el flujo oficial de autenticación:
  - En Web/Safari: Mediante popup o redirección directa (`signInWithRedirect`) a las pasarelas oficiales (`accounts.google.com` y `appleid.apple.com`).
  - En iOS/Capacitor: Mediante el SDK nativo o redirección OAuth directa.
- **GESTIÓN DE ERRORES TRANSPARENTE:** Si un proveedor no está completado en la consola de Firebase (como el caso de Apple, que exige Service ID, Team ID y clave privada .p8 de Apple Developer), el sistema debe mostrar un mensaje claro y transparente indicando los requisitos de configuración en la consola, en lugar de solicitar credenciales manualmente.
- **MANEJO DE ERRORES EN REDIRECCIONES MÓVILES (OBLIGATORIO):** En entornos móviles o Capacitor donde se emplee `signInWithRedirect()`, es imperativo que cualquier fallo asíncrono capturado por `firebaseAuth.getRedirectResult().catch()` tenga reflejo en la interfaz (UI). Jamás se deben silenciar estos errores (ej. usando solo `console.warn`), para evitar que el usuario quede bloqueado sin saber por qué falló el inicio de sesión.
- **RESTRICCIÓN DE FIREBASE EN CAPACITOR:** El SDK web clásico de Firebase bloquea intencionalmente `signInWithRedirect` en entornos Capacitor/Cordova, lanzando el código de error `auth/invalid-cordova-configuration` de manera síncrona. Cualquier intento de login social móvil con este método debe capturar obligatoriamente este error en el `.catch()` inicial para mostrar el aviso visual adecuado (como el modal de configuración de Apple), evitando lanzar excepciones técnicas sin procesar.

## 5. SOPORTE MULTIPLATAFORMA UNIFICADO (WEB, IOS Y ANDROID)
- El código y la interfaz deben mantenerse 100% alineados, funcionales y sincronizados para las tres plataformas: **Web**, **iOS (Capacitor)** y **Android (Capacitor)**.
- Apple (iOS) queda descongelado para permitir la aplicación uniforme de todas las pautas de interfaz, arquitectura y diseño acordadas en el proyecto.

## 6. REGLAS ESTRICTAS DE CAPACITOR ANDROID Y FIREBASE
- **Nivel de API y SDK de Android (MANDATORIO):** Google Play Console exige orientarse al nivel 36 de la API de Android (`targetSdkVersion = 36`).
  - Es **obligatorio** mantener en `android/variables.gradle` la siguiente configuración compatible con Play Store:
    ```groovy
    compileSdkVersion = 36
    targetSdkVersion = 36
    androidxActivityVersion = '1.9.3'
    androidxAppCompatVersion = '1.7.0'
    androidxCoreVersion = '1.15.0'
    androidxFragmentVersion = '1.8.5'
    coreSplashScreenVersion = '1.0.1'
    ```
- **Login Nativo de Google:** La autenticación de Google en entornos móviles debe usar obligatoriamente el plugin `@capacitor-firebase/authentication`.
  - **Requisito del Capacitor Config:** El archivo `capacitor.config.json` DEBE contener siempre `"providers": ["google.com"]` dentro del bloque `plugins.FirebaseAuthentication`.
  - **Cierre del Modal (UI):** Dado que el plugin nativo devuelve una conexión asíncrona, el código frontend (ej. `js/auth.js`) DEBE cerrar explícitamente el modal con un `.then(function() { closeModal(); })` tras `firebaseAuth.signInWithCredential()`, ya que no se cierra solo.

## 7. TEXTO DE LOS SUBTÍTULOS DE LA MARCA (MANDATORIA)
- El subtítulo que aparece debajo del logo en la cabecera y en el menú lateral debe ser estrictamente **"Dashboard Premium"** si el usuario tiene una cuenta PRO o VIP, y **"Dashboard Free"** si está en el plan gratuito.
- No se deben utilizar traducciones como "Dashboard Gratuito" ni "Free Dashboard". Debe mantenerse consistente en el código JS y HTML (`app-user-tier-subtitle`).

## 8. PAUTAS DE INTERFAZ DEL MENÚ LATERAL (DRAWER) MULTIPLATAFORMA
- **Aplicación Universal:** Las siguientes reglas aplican por igual en Web, iOS y Android:
  1. **Sección de Idiomas:** Omitir el rótulo o encabezado de texto "Idioma / Language". Sin embargo, **deben mostrarse claramente los idiomas existentes** en la aplicación (ej. botones/selectores para English y Español con sus banderas).
  2. **Sección de Usuario:** En el apartado de usuario del menú solo debe figurar el **nombre del usuario** (sin emails secundarios, sin etiquetas de rol ni textos de sincronización con proveedores en el drawer).
  3. **Descargas de Aplicación Nativa:** Queda estrictamente prohibido mostrar tarjetas o botones de descarga de aplicaciones nativas (APK, DMG, IPA) en el menú lateral.
  4. **Acceso PRO en Footer:** En la parte inferior del menú, el botón de suscripción debe mostrar exclusivamente el texto **"Desbloquear acceso pro"** (o "Unlock PRO Access" según el idioma).
  5. **Prohibición de Menciones a Stripe:** Queda terminantemente prohibido hacer cualquier mención o referencia a la palabra "Stripe" en los botones, avisos o textos del menú lateral y de desbloqueo.

