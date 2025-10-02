# Registro de prompts y uso de IA

Este documento registra las interacciones con IA usadas para generar o asistir en la prueba.

## Resumen de herramientas
- Chat/Modelos utilizados:
  - Herramienta/Modelo:
  - Versión/Build (si se conoce):
  - URL o entorno:
- Recursos generados por IA: (lista de imágenes/textos/código y rutas)

---

## Interacción 1
**Fecha y hora (Europe/Madrid):** 2025-10-01 15:31  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Definir plan de ciclo 1, criterios, prompts y scaffolding inicial  
**Prompt exacto enviado:**
```
Genera el código del Paso 1 siguiendo estas instrucciones estrictas. Formato
  de salida: para cada archivo, bloque encabezado ### <ruta> seguido de código
  completo en bloque ts|py|json|.... Incluye sólo archivos listados abajo. No
  resumir.

  Contexto general:

  - Monorepo con carpetas backend/ (Python FastAPI) y frontend/ (React 18 +
  TypeScript + Vite + Tailwind + TanStack Router v1 + TanStack Query v5 + Vitest
  + Testing Library).
  - Usar pnpm por defecto (scripts pnpm dev, pnpm build, pnpm test).
  - Tailwind sólo vía clases utilitarias.
  - Nada de estilos inline salvo spinners loading (si se usa, justificar con
  comentario).
  - TS estrictamente tipado ("strict": true).
  - Arquitectura FE: src/api, src/components, src/lib, src/routes, src/tests.

  Archivos y requisitos:

  1. backend/pyproject.toml
      - Configura proyecto Poetry mínimo o project PEP621 con dependencias
  fastapi, uvicorn[standard].
      - Define script uvicorn backend.app.main:app --reload.
  2. backend/app/data/vendors.json
      - Contiene al menos 3 vendors con antenas 2G–5G, foundationDate en epoch
  ms negativos/positivos, speedMbps como strings "### Mbps".
  3. backend/app/main.py
      - FastAPI app con CORS permitiendo http://localhost:5173 y
  http://127.0.0.1:5173.

  - Endpoint GET /api/vendors retornando lista del JSON (leer archivo una vez
  al levantar).
  - Incluir modelo Pydantic opcionalmente tipado pero puede retornar
  JSONResponse.
  - Añadir @app.get("/health", ...).

  4. frontend/package.json
      - Scripts dev, build, preview, test.
      - Dependencias: react, react-dom, @tanstack/react-router, @tanstack/react-
  query, @tanstack/router-devtools (dev), @vitejs/plugin-react, typescript,
  vite, tailwindcss, postcss, autoprefixer, vitest, @testing-library/react,
  @testing-library/user-event, @testing-library/jest-dom.
  5. frontend/vite.config.ts
      - Plugin React con SWC.
      - Proxy /api hacia http://127.0.0.1:8000.
  6. frontend/tailwind.config.cjs y frontend/postcss.config.cjs
      - Config estándar apuntando a ./index.html y ./src/**/*.{ts,tsx}.
  7. frontend/tsconfig.json + tsconfig.node.json
      - Strict true, paths base src.
  8. frontend/src/index.css
      - Importa directivas Tailwind.
  9. frontend/src/main.tsx
      - Crea QueryClient, configura Router (TanStack) con __root y global-
  ranking route.
      - Wrap con QueryClientProvider y React.StrictMode.
      - Añadir TanStackRouterDevtools en dev guardado por import.meta.env.DEV.
  10. frontend/src/routes/__root.tsx
      - Layout base con cabecera nav simple (links a Global Ranking, placeholder
  para otras vistas), <Outlet />.
      - Manejar errorComponent con mensaje accesible.
  11. frontend/src/routes/global-ranking.tsx
      - Exporta Route con TanStack Router (lazy), usa useVendorsQuery.
      - Mientras carga: contenedor con role="status" y animación tailwind
  (animate-pulse o spinner con border).
      - En error: texto accesible, botón Retry que dispare refetch.
      - Al éxito: renderiza <VendorTable vendors={data} />.
  12. frontend/src/components/VendorTable.tsx
      - Props: lista vendors (tipar con Vendor interface).
      - Calcula media usando helpers (no duplicar lógica).
      - Tabla con <caption>Clasificación global por velocidad media</caption>,
  <thead>, <tbody>, usar aria-live="polite" si procede.
      - Ordena por media desc; mostrar ranking 1..n, nombre vendor, velocidad
  media (ej. 540.25 Mbps).
      - Usa Tailwind (table-auto, border, etc.).
  13. frontend/src/api/vendors.ts
      - Define tipos Vendor, Antenna.
      - fetchVendors: fetch('/api/vendors'), maneja errores HTTP, parsea a
  Vendor[]
      - useVendorsQuery: useQuery con key ['vendors'], staleTime razonable.
  14. frontend/src/lib/vendor.ts
      - Funciones parseSpeed(speed: string): number, formatSpeed(value: number):
  string (2 decimales y Mbps), computeAverage(antennas).
      - Garantizar que strings mal formadas lanzan error controlado.
      - Exportar util tests.
  15. frontend/src/tests/global-ranking.test.tsx
      - Usa Vitest + Testing Library.
      - Mockear fetch para resolver con datos sample.
      - Tests: render loading state, error state (fetch rechaza), orden correcto
  (1er row mayor media), accesibilidad <caption>.
  16. frontend/vitest.config.ts
      - Setup con jsdom, include setupFiles (crear inline) para
  expect.extend(matchers).
  17. PROMPTS.md
      - Copiar plantilla provista en el enunciado tal cual.

  Consideraciones adicionales:

  - Tipar fechas como number (epoch ms). Conversión a fecha legible se hará en
  iteraciones futuras.
  - No usar any. Utilizar zod no obligatorio aquí.
  - Añadir comentarios sólo cuando aporten contexto (p.ej. explicar cálculo
  memoizado).
  - Proveer pnpm-lock.yaml omitido (placeholder) si necesario? No generar.

  Tests:

  - pnpm test debe pasar.
  - Asegurar global-ranking.test.tsx cubra medias y orden descendente.
  - Mock global.fetch en cada test con vi.spyOn(global, 'fetch').
```
**Resumen del resultado:** Se generó el scaffolding completo para backend FastAPI y frontend React/TanStack con tabla de ranking accesible, utilidades de parsing/ordenación y prueba de integración inicial. Se añadieron correcciones posteriores (favicon embebido, init packages, ajustes de test y retry) partiendo del mismo prompt.  
**Uso dentro del proyecto:** Código creado/actualizado en `backend/app/main.py`, `backend/app/data/vendors.json`, `frontend/src/main.tsx`, `frontend/src/components/VendorTable.tsx`, `frontend/src/api/vendors.ts`, `frontend/src/tests/global-ranking.test.tsx`, y configuración asociada (`vite.config.ts`, Tailwind, Vitest, etc.).
**Notas adicionales:** Iteración completada con tests (`pnpm test --run`) y revisión de estados loading/error; ajustes manuales documentados para compatibilidad TanStack Router Devtools y retry de queries.

## Interacción 2
**Fecha y hora (Europe/Madrid):** 2025-10-01 16:26  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Incorporar ranking por tecnología, refactor de tabla reutilizable y cobertura de pruebas asociadas  
**Prompt exacto enviado:**
```
Genera el código del Paso 2 (Ranking por tecnología) siguiendo las
  instrucciones. Formato de salida: bloques ### <ruta> + código completo. Solo
  archivos mencionados. No resumas.

  Contexto existente:

  - Monorepo con backend FastAPI ya operativo.
  - Frontend React+TS con TanStack Router/Query, Tailwind, Vitest.
  - Tabla de ranking global en VendorTable.
  - Query useVendorsQuery disponible.
  - Tests con Vitest + Testing Library; userEvent instalado.

  Tareas:

  1. frontend/src/lib/vendor.ts
      - Añadir listTechnologies(vendors: Vendor[]): string[] para obtener
  tecnologias únicas ordenadas.
      - Añadir computeTechnologyRanking(vendors: Vendor[], technology: string)
  que devuelve { vendorId, vendorName, averageSpeed }[] ordenado desc.
      - Asegurar que ignora vendors sin antenas de esa tecnología; lanza error
  legible si technology vacío.
      - Exportar nuevos tipos y asegurar tests puedan importar.
  2. frontend/src/components/TechnologyRankingControls.tsx
      - Crear componente con props { technologies: string[]; selected: string;
  onChange: (technology: string) => void; }.
      - Renderizar label + select accesibles (id, aria-label), opciones
  ordenadas; manejar disabled si lista vacía.
      - Tailwind minimalista (flex, gap, etc.).
  3. frontend/src/components/VendorTable.tsx
      - Permitir caption configurable vía prop opcional caption.
      - Soportar datasets con campos { vendorName, averageSpeed }[] cuando se
  pase rows precomputados (sin romper compatibilidad actual).
      - Mantener aria-live. Reutilizar formato de velocidad.
  4. frontend/src/routes/technology-ranking.tsx
      - Crear route TanStack (path: '/ranking-tecnologia').
      - Usar useVendorsQuery. Mientras carga/error reutilizar patrones del
  global ranking.
      - Cuando hay datos:
          - Obtener tecnologías via helper, elegir default (primera) usando
  useState.
          - Calcular ranking memoizado para tecnología seleccionada; si lista
  vacía, mostrar mensaje “No hay datos para esta tecnología”.
          - Renderizar TechnologyRankingControls y VendorTable con caption
  Ranking por tecnología (${technology}).
      - Botón retry disponible en error state.
  5. frontend/src/routes/__root.tsx
      - Actualizar nav: enlace a /ranking-tecnologia activo cuando corresponda
  (sin cursor-not-allowed), aria-current.
  6. frontend/src/main.tsx
      - Importar y registrar Route as TechnologyRankingRoute en routeTree.
  7. Tests:
      - frontend/src/tests/technology-ranking.test.tsx:
          - Simular fetch con vendors sample que cubran tecnologías; usar render
  con QueryClient.
          - Verificar loading → tabla.
          - Usar userEvent.selectOptions para cambiar tecnología y confirmar
  orden correctos.
          - Test error state (fetch rechaza) con retry.
          - Test mensaje cuando tecnología sin datos (forzar dataset con
  tecnología atípica).
      - frontend/src/tests/vendor-utils.test.ts:
          - Tests unitarios para listTechnologies, computeTechnologyRanking,
  parseSpeed edge (reutilizar mocks).
          - Cobertura para vendors sin antena, tecnología inexistente.
  8. Ajustar imports donde corresponda (index.ts no hay) y mantener lint.
  9. Asegurar pnpm test --run pasa.

  Estilo:

  - Tailwind utilitario, sin inline.
  - Comentarios sólo si clarifican lógica no obvia.
  - Tipado estricto; sin any.
  - Manejar lowercase/uppercase tecnología consistentemente (normalizar a
  uppercase al comparar).
```
**Resumen del resultado:** Se añadió la vista de ranking por tecnología con selector accesible, se refactorizó `VendorTable` para soportar filas agregadas, se extendieron los helpers (`listTechnologies`, `computeTechnologyRanking`) y se cubrieron con pruebas unitarias e integración.  
**Uso dentro del proyecto:** Cambios en `frontend/src/lib/vendor.ts`, `frontend/src/components/VendorTable.tsx`, nueva UI `frontend/src/components/TechnologyRankingControls.tsx`, la ruta `frontend/src/routes/technology-ranking.tsx`, integración en `frontend/src/main.tsx` y `frontend/src/routes/__root.tsx`, más tests en `frontend/src/tests/vendor-utils.test.ts` y `frontend/src/tests/technology-ranking.test.tsx`.

## 📝 Ejemplo de entrada en PROMPTS.md
## Interacción 1
Herramienta/Modelo: ChatGPT – GPT-4o
Objetivo: Crear tabla de ranking en React
Prompt exacto:
"Genera un componente React con TypeScript llamado RankingTable..."
Resumen del resultado: Tabla con props tipadas y enlaces
Uso: src/components/RankingTable.tsx
