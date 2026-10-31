# Rumbo · Gestión de proyectos y tareas

Aplicación multiplataforma (PWA / híbrida) para gestionar proyectos y tareas de un equipo.
Proyecto del módulo **Desarrollo de Interfaces (0488)** · CFGS DAM.

**Stack:** Ionic 8 + Angular 19 (standalone, signals) · Supabase (PostgreSQL + REST + JWT) · Firebase Firestore (tiempo real) · Chart.js · jsPDF · Compodoc · GitHub Actions · Vercel.

## Funcionalidades
| Área | Detalle |
|---|---|
| Arquitectura | Menú lateral responsive, **lazy loading** de todas las rutas, estado global con *store* de signals |
| Seguridad | Login **simulado** con sesión en `sessionStorage` + Signals, **Functional Guards** (`authGuard`, `guestGuard`, factoría `roleGuard('admin')`) con redirección por `UrlTree`, interceptor HTTP, contraseñas con hash SHA-256 |
| Roles | **Administrador** (CRUD completo, panel, usuarios) · **Usuario estándar** (consulta proyectos, gestiona tareas) |
| Formularios | Reactivos, con **validación asíncrona** (¿el correo ya existe?, vía RPC en BD), validadores de grupo y errores accesibles |
| Componentes | `app-data-table`, `app-stat-widget`, `app-chart-card`, `app-page-header` (Inputs/Outputs, `OnPush`, `ngOnDestroy`) |
| Datos | SQL (Supabase REST) + NoSQL (Firestore en tiempo real), cargas concurrentes con `forkJoin` |
| Informes | Panel con gráficos reactivos al filtro · exportación **PDF** (con diseño) y **CSV** |
| Accesibilidad | WCAG 2.2 AA: contraste, texto escalable (A−/A/A+), teclado completo, skip-link, ARIA, `prefers-reduced-motion` |
| Despliegue | CI/CD con tests que **bloquean** el despliegue, PWA con service worker |

## Puesta en marcha
```bash
git clone <URL-DEL-REPO> && cd gestor-proyectos
npm ci
cp .env.example .env        # y rellena tus claves (ver docs/GUIA_GIT_Y_DESPLIEGUE.md)
npm start                   # http://localhost:4200
```
Scripts útiles: `npm run test:ci` (tests) · `npm run build` (producción) · `npm run docs` (Compodoc → `docs/api`).

> Las claves **no se guardan en el repositorio**: `scripts/set-env.mjs` genera `environment.generated.ts` (ignorado por Git) desde variables de entorno.

## Estructura
```
src/app
├─ core/        models · services (auth, API, Firestore, export) · guards · interceptors · state (store)
├─ shared/      components reutilizables (data-table, stat-widget, chart-card, page-header)
├─ layout/      shell con menú lateral
└─ pages/       login · register · dashboard · projects · tasks · users · help
supabase/schema.sql   esquema, RLS, función de validación y datos sintéticos
firestore.rules       reglas de seguridad de Firestore
.github/workflows     CI/CD
docs/                 manual de usuario, guía de Git/despliegue, API generada (Compodoc)
```

## Modelo arquitectónico (MVVM)
- **Modelo:** interfaces en `core/models` y datos en PostgreSQL/Firestore.
- **Vista:** plantillas declarativas de Angular/Ionic.
- **Vista-Modelo:** componentes + `ProjectsStore` (signals y `computed`): las vistas solo leen señales de solo lectura y llaman a métodos del store.

## Usuarios de prueba (login simulado, datos sintéticos)
| Rol | Usuario | Contraseña | Al entrar va a |
|---|---|---|---|
| Administrador | `admin` | `123` | `/panel` (alias `/admin`) |
| Usuario estándar | `operador` | `123` | `/user-dashboard` |

Un usuario estándar que escriba `/admin` o `/panel` en la barra de direcciones es redirigido a `/user-dashboard` por `roleGuard`.
Las cuentas nuevas se registran en la base de datos (rol usuario estándar) y también pueden iniciar sesión.

## Nota de seguridad (modo demo)
El login es simulado (según la guía de laboratorio de guards), por lo que **no hay un JWT por usuario**: la API de Supabase se usa con la clave `anon` y las políticas RLS de `projects` y `tasks` están abiertas en modo demo. El control por rol se aplica en el cliente (guards y UI). En un producto real se volvería a Supabase Auth y las políticas se restringirían por rol.

## Manual de usuario
Ver [`docs/MANUAL_USUARIO.md`](docs/MANUAL_USUARIO.md). También está integrado en la app (menú **Ayuda**).

## Calidad
- Tests unitarios (Jasmine/Karma): `npm run test:ci`.
- Auditoría Lighthouse: ver `docs/GUIA_GIT_Y_DESPLIEGUE.md` (apartado 7).
