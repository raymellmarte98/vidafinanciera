# VidaFinanciera — Sitio web de finanzas y salud multilingüe

Sitio editorial de contenido en tres idiomas (ES/EN/PT) sobre finanzas personales y salud, con zonas de publicidad AdSense integradas y backend completo con API REST.

**Demo en vivo:** https://finanzas-salud-global--angelmarte458.replit.app

---

## Run & Operate

```bash
# Desarrollo (levanta frontend + API)
pnpm --filter @workspace/finanzas-salud run dev   # Frontend (Vite)
pnpm --filter @workspace/api-server run dev        # API (Express, puerto 8080)

# Tipado
pnpm run typecheck          # Tipado completo (libs + apps)
pnpm run typecheck:libs     # Solo librerías compartidas

# Base de datos
pnpm --filter @workspace/db run push    # Empujar cambios de schema
pnpm --filter @workspace/db run seed    # Sembrar artículos de ejemplo

# Codegen (OpenAPI → hooks tipados)
pnpm --filter @workspace/api-spec run codegen
```

**Variables de entorno requeridas:**
- `DATABASE_URL` — Cadena de conexión a PostgreSQL (provista automáticamente por Replit DB)
- `SESSION_SECRET` — Secreto de sesión Express

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | React 19, Vite 7, TypeScript 5.9, TailwindCSS v4 |
| Routing | Wouter |
| UI | shadcn/ui (Radix UI) |
| Tipografía | Playfair Display + Plus Jakarta Sans (Google Fonts) |
| Backend | Express 5, Node.js 24, TypeScript |
| Base de datos | PostgreSQL + Drizzle ORM |
| Validación | Zod v4, drizzle-zod |
| API codegen | Orval (OpenAPI 3.1 → React Query hooks + Zod schemas) |
| Queries frontend | TanStack Query v5 |
| Monorepo | pnpm workspaces |
| Build | Vite (frontend), esbuild (API) |
| Deploy | Replit Autoscale |

---

## Estructura del monorepo

```
artifacts/
  finanzas-salud/          # Frontend React (sirve en /)
  api-server/              # API Express (sirve en /api)

lib/
  db/                      # Schema Drizzle + cliente PostgreSQL
  api-spec/                # OpenAPI 3.1 spec + config Orval
  api-client-react/        # Hooks React Query generados (codegen)
  api-zod/                 # Schemas Zod generados (codegen)
```

---

## Páginas del sitio

| Ruta | Descripción |
|------|-------------|
| `/` | Home — artículo destacado, estadísticas, artículos recientes, newsletter |
| `/finanzas` | Categoría finanzas — artículos filtrados |
| `/salud` | Categoría salud — artículos filtrados |
| `/articulos/:slug` | Artículo completo con artículos relacionados |

---

## API endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/articles` | Lista artículos (filtros: lang, category, featured, limit, offset) |
| GET | `/api/articles/:slug` | Artículo por slug (filtro: lang) |
| GET | `/api/categories` | Categorías con conteo de artículos |
| GET | `/api/stats` | Estadísticas generales del sitio |
| POST | `/api/newsletter` | Suscripción al boletín (409 si email duplicado) |

---

## AdSense

- Publisher ID: `ca-pub-1824513245358227`
- Zonas activas: banner superior, rectángulo en artículo (top + bottom), contenido
- Para activar anuncios manuales: añadir `slot="TU_SLOT_ID"` a cada `<AdSenseSlot>`
- Auto Ads ya funciona con solo el script en `<head>`

---

## Arquitectura — decisiones clave

- **OpenAPI-first**: el contrato de la API vive en `lib/api-spec/openapi.yaml`. Nunca escribir hooks ni tipos a mano — siempre regenerar con `pnpm --filter @workspace/api-spec run codegen`.
- **Orval zod config**: los campos `schemas` y `workspace` están eliminados del output zod para evitar colisión TS2308 en nombres `*Params`. El barrel `lib/api-zod/src/index.ts` es manual.
- **Sin librería i18n**: las traducciones viven en `artifacts/finanzas-salud/src/lib/i18n.ts` como objeto plano — suficiente para ES/EN/PT sin overhead de i18next.
- **Markdown seguro**: `MarkdownContent.tsx` renderiza el contenido de artículos convirtiendo Markdown a React elements, sin `dangerouslySetInnerHTML`.
- **Unique constraint (slug, lang)**: garantiza que cada artículo tenga un slug único por idioma.

---

## User preferences

- Idioma principal del sitio: Español
- Nombre del sitio: VidaFinanciera
- Paleta: azul medianoche (#1a2744) + verde bosque (#2d6a4f) + dorado (#c9a84c)
