# VidaFinanciera — Guía de instalación

Gracias por comprar VidaFinanciera. Esta guía te lleva desde cero hasta tener el sitio funcionando en menos de 15 minutos.

---

## Requisitos previos

- [Node.js 20+](https://nodejs.org)
- [pnpm](https://pnpm.io) — instalar con `npm install -g pnpm`
- Una base de datos PostgreSQL (opciones gratuitas: [Neon](https://neon.tech), [Supabase](https://supabase.com), [Railway](https://railway.app))
- Cuenta de Google AdSense (para monetizar)

---

## Paso 1 — Instalar dependencias

```bash
pnpm install
```

---

## Paso 2 — Configurar la base de datos

Crea un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL=postgresql://usuario:contraseña@host:5432/nombre_db
SESSION_SECRET=una-cadena-aleatoria-larga-aqui
```

Luego empuja el esquema a tu base de datos:

```bash
pnpm --filter @workspace/db run push
```

Y siembra los artículos de ejemplo:

```bash
pnpm --filter @workspace/db run seed
```

---

## Paso 3 — Ejecutar en desarrollo

Abre dos terminales:

```bash
# Terminal 1 — API
pnpm --filter @workspace/api-server run dev

# Terminal 2 — Frontend
pnpm --filter @workspace/finanzas-salud run dev
```

El sitio estará en **http://localhost:5173**

---

## Paso 4 — Conectar tu AdSense

1. Abre `artifacts/finanzas-salud/index.html`
2. El `data-ad-client` ya está configurado — solo asegúrate de que coincide con tu Publisher ID
3. Para anuncios manuales por zona, añade tu `data-ad-slot` en cada componente `<AdSenseSlot slot="TU_SLOT_ID" />`

Los slots disponibles son:
- `id="adsense-top-banner"` — banner 728×90 en el home
- `id="adsense-sidebar-rect"` — rectángulo 300×250 en el sidebar
- `id="adsense-article-top"` — banner en la parte superior del artículo
- `id="adsense-article-bottom"` — rectángulo al pie del artículo

---

## Paso 5 — Desplegar en producción

### Opción A: Replit (más fácil)
1. Importa el repositorio en [replit.com](https://replit.com)
2. Replit detecta el proyecto automáticamente
3. Haz clic en **Publish** — listo

### Opción B: Vercel + Railway
1. **Frontend** → importa en Vercel, configura `VITE_API_URL`
2. **API** → despliega en Railway con `DATABASE_URL`

### Opción C: VPS (DigitalOcean, Hetzner)
```bash
# Build
pnpm --filter @workspace/finanzas-salud run build
pnpm --filter @workspace/api-server run build

# Servir
node artifacts/api-server/dist/index.mjs
# Frontend: sirve artifacts/finanzas-salud/dist/public con nginx
```

---

## Paso 6 — Añadir tu propio contenido

Los artículos están en la base de datos. Puedes:

**A) Editar directamente en PostgreSQL** con cualquier cliente (TablePlus, DBeaver, etc.) en la tabla `articles`.

**B) Usar la API REST:**
```bash
# Ver artículos existentes
curl http://localhost:8080/api/articles

# Estructura de un artículo
{
  "slug": "mi-articulo",
  "lang": "es",           # es | en | pt
  "title": "Mi artículo",
  "excerpt": "Resumen...",
  "content": "# Contenido en Markdown",
  "category": "finance",  # finance | health
  "imageUrl": "https://...",
  "featured": false,
  "tags": ["ahorro", "inversión"]
}
```

---

## Personalización rápida

| Qué cambiar | Dónde |
|-------------|-------|
| Nombre del sitio | `artifacts/finanzas-salud/index.html` (title) y `artifacts/finanzas-salud/src/components/Layout.tsx` |
| Colores | `artifacts/finanzas-salud/src/index.css` (variables CSS) |
| Traducciones | `artifacts/finanzas-salud/src/lib/i18n.ts` |
| Logo | Reemplaza el texto en `Layout.tsx` con un `<img>` |

---

## Soporte

Si tienes problemas con la instalación, revisa primero:
1. Que `DATABASE_URL` apunta a una base de datos PostgreSQL accesible
2. Que ejecutaste `pnpm install` antes de cualquier otro comando
3. Que las versiones de Node.js (20+) y pnpm (8+) son correctas
