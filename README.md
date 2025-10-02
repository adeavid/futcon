# Telco Vendor Performance

Aplicación full-stack para visualizar el rendimiento de vendors de telecomunicaciones. Incluye backend FastAPI que expone los datos de vendors y frontend en React + TanStack Router/Query con tabla de ranking global y ranking filtrado por tecnología.

## Requisitos

- Python 3.10+
- Node.js 18+ y pnpm 8+

## Instalación

### Backend (FastAPI)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r <(python - <<'PY'
import tomllib
project = tomllib.load(open('pyproject.toml', 'rb'))
deps = project['project']['dependencies']
print('\n'.join(deps))
PY
)
```

> También puedes usar `pip install fastapi uvicorn[standard]` si prefieres instalar manualmente.

### Frontend (React + Vite)

```bash
cd frontend
pnpm install
```

## Scripts útiles

Backend (`backend/`):

- `uvicorn backend.app.main:app --reload` – inicia FastAPI en `http://127.0.0.1:8000`.

Frontend (`frontend/`):

- `pnpm dev` – levanta Vite en `http://localhost:5173` con proxy a FastAPI.
- `pnpm build` – compila el frontend para producción.
- `pnpm preview` – sirve la build generada.
- `pnpm test` / `pnpm test --run` – ejecuta Vitest (modo watch / una vez).

## Variables de entorno

No se requieren variables para el entorno local. Para despliegues puedes parametrizar:

- `API_BASE_URL` (frontend) si el backend vive en un dominio distinto.
- `PORT`/`HOST` para uvicorn en entornos gestionados.

## Ejecución local (dos terminales)

1. **Terminal A** – Backend:
   ```bash
   cd backend
   uvicorn backend.app.main:app --reload
   ```
2. **Terminal B** – Frontend:
   ```bash
   cd frontend
   pnpm dev
   ```
3. Abre `http://localhost:5173/` y navega entre “Clasificación global” y “Ranking por tecnología”.

## Guía de tests

- Ejecuta en `frontend/`:
  ```bash
  pnpm test --run
  ```
  Cubre utilidades (`parseSpeed`, `listTechnologies`, `computeTechnologyRanking`) y las páginas de ranking global/tecnología (estados loading/error/sin datos, interacción con el selector).

## Uso

- **Clasificación global** (`/`): tabla ordenada por velocidad media total de cada vendor. El caption describe la tabla, se incluyen estados de carga y error con botón de reintento.
- **Ranking por tecnología** (`/ranking-tecnologia`): selector accesible de tecnologías disponibles (2G, 3G, 4G, LTE, 5G, etc.). La tabla se recalcula con `useMemo` usando `computeTechnologyRanking`; vendors sin antenas para la tecnología seleccionada se omiten. Si un filtro no tiene datos se muestra mensaje contextual.
- **Detalle de vendor** (`/vendor/:vendorId`): tarjeta con logo, fecha de fundación formateada (`formatFoundationDate`), resumen de velocidades (media/mín/max) generado por `summarizeVendorSpeeds` y tabla de antenas ordenadas por tecnología/velocidad. Incluye estado “vendor no encontrado” y enlaces de retorno accesibles.

## Estructura del proyecto

```
.
├── backend/
│   ├── app/
│   │   ├── data/vendors.json
│   │   └── main.py
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── lib/
│   │   ├── routes/
│   │   └── tests/
│   ├── package.json
│   └── vite.config.ts
├── PROMPTS.md
└── README.md
```

## Decisiones arquitectónicas

- **TanStack Router + Query**: se centraliza la obtención de vendors con `useVendorsQuery` para aprovechar caché y estados controlados.
- **Helpers puros en `src/lib/vendor.ts`**: facilitan testabilidad y reutilización (ranking global/tecnología, normalización de tecnologías, resumen de velocidades y formateo de fechas).
- **`VendorTable` reutilizable**: acepta vendors crudos o filas precomputadas, manteniendo accesibilidad (`caption`, `aria-live`) y permitiendo renderización de nombres custom (links al detalle).
- **Tailwind utilitario**: evita dependencias UI pesadas, mantiene estilos consistentes sin inline styling.
- **Rutas cohesionadas**: TanStack Router provee navegación entre listados y detalle con estados de carga/error consistentes.

## Deploy en Render

### Backend (FastAPI)

1. Crear servicio “Web Service” apuntando al repo.
2. Build Command: `pip install -r requirements.txt` (o script equivalente tras exportar dependencias).
3. Start Command: `uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT`.

> Alternativa: usar Dockerfile con `uvicorn` y `python -m pip install .` basado en `pyproject.toml`.

### Frontend (Vite)

1. Crear “Static Site”.
2. Build Command: `pnpm install && pnpm build`.
3. Publish directory: `frontend/dist`.
4. Configura variable `VITE_API_BASE_URL` (si se separa el dominio) apuntando al backend desplegado.

## Próximos pasos sugeridos

1. Refinar UI/UX (temas claro/oscuro, improve responsive layout, focus visible, skip links).
2. Añadir vista de detalle extendida (gráficos comparativos, breadcrumbs, CTA).
3. Validar respuesta de la API con Zod y manejar estados vacíos en backend.
4. Incluir MSW para pruebas de integración sin mock manual de `fetch`.
5. Automatizar despliegue (CI) para ejecutar `pnpm test --run` y publicar en Render.
