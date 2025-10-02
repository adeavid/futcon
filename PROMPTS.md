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

## Interacción 3
**Fecha y hora (Europe/Madrid):** 2025-10-02 03:33  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Implementar vista de detalle de vendor, navegación enlazada desde los rankings y extender utilidades de formateo/estadísticas con cobertura de tests  
**Prompt exacto enviado:**
```
Genera el código del Paso 3 (Vendor Detail) siguiendo estas instrucciones
  estrictas. Formato de salida: para cada archivo, bloque encabezado ### <ruta>
  seguido de código completo en bloque …. Limítate a los archivos que se listan
  abajo. No resumas.

  ### Contexto actual

  - Monorepo con backend FastAPI (/api/vendors) ya operativo.
  - Frontend React 18 + TypeScript + Vite + Tailwind; TanStack Router/Query;
  Vitest + Testing Library.
  - Rutas existentes: / (clasificación global), /ranking-tecnologia.
  - VendorTable reutilizable, helpers en src/lib/vendor.ts (parseSpeed,
  formatSpeed, computeAverage, listTechnologies, computeTechnologyRanking).
  - TanStack Router usa Route exportado por cada archivo de src/routes.

  ### Objetivo del ciclo

  Implementar la página de detalle de vendor, navegación accesible desde
  listados, utilidades de formateo (fecha y velocidades), tests que cubran la
  nueva ruta y helpers. Debe mostrar logo, nombre, fecha formateada, estadística
  de velocidades, y listado de antenas por tecnología.

  ### Archivos a crear/modificar

  1. frontend/src/lib/vendor.ts
      - Añadir función formatFoundationDate(epochMs: number): string (fecha
  legible locale-es, ej. “12 de mayo de 1996”).
      - Añadir helper normalizeTechnology(value: string): string reutilizado
  para comparaciones (retorna uppercase).
      - Añadir util summarizeVendorSpeeds(antennas: Antenna[]) que devuelva
  { average: number; min: number; max: number } (en Mbps, usa parseSpeed),
  manejando arrays vacíos (devuelve 0 en todos los campos).
      - Exportar nuevos helpers y tipos si aplica.
  2. frontend/src/api/vendors.ts
      - Exponer selector selectVendorById(vendors: Vendor[], vendorId: string):
  Vendor | undefined para uso en rutas (pure function exportada).
      - Asegurar fetchVendors y tipos se mantienen (no breaking changes).
  3. frontend/src/components/VendorCard.tsx (nuevo)
      - Props: { vendor: Vendor; summary: ReturnType<typeof
  summarizeVendorSpeeds> }.
      - Renderizar logo (img con alt), nombre, fecha (formatFoundationDate),
  estadísticos (media/mín/max formateados con formatSpeed).
      - Aplicar Tailwind (rounded-md, shadow, etc.), sin inline styles.
      - Incluir aria-label o estructura semántica (<dl> o <div> con headings)
  accesible.
  4. frontend/src/components/AntennaList.tsx (nuevo)
      - Props: { antennas: Antenna[] }.

  - Ordenar antenas por tecnología (alphabetic uppercase) y velocidad desc.
  - Renderizar lista <ul> o <table> (elige tabla con <thead>/<tbody> y <caption>
  “Antenas disponibles”).
  - Mostrar tecnología y velocidad formateada (2 decimales). Asegurar key
  estable.
  - Estados vacíos: mensaje accesible “Este vendor no tiene antenas
  registradas.”

  5. frontend/src/routes/vendor-detail.tsx (nuevo)
      - TanStack route path: '/vendor/$vendorId'.
      - Uso de useVendorsQuery para obtener data; manejar isLoading, isError
  (mismos patrones de otras rutas).
      - Localizar vendor via selectVendorById; si no existe, mostrar alerta
  accesible “Vendor no encontrado” + link de regreso a /.
      - Mostrar VendorCard + AntennaList.
      - Botón Volver (Link TanStack) para regresar a listado global.
      - Asegurar que errorComponent y pendingComponent se cubren dentro del
  render (no rely on root error boundary).
  6. frontend/src/routes/__root.tsx
      - Añadir enlace nav (opcional) a “Detalle de vendor” como placeholder?
  NO: en vez de enlace, asegurarse de que Link al detalle desde listas use
  Link/Navigate (ver sig. punto). Aquí solo asegúrate de que nav existente no
  se rompe.
  7. frontend/src/routes/global-ranking.tsx
      - En la tabla usar Link por vendor a /vendor/${id} (en la celda de
  nombre). Usa Link de TanStack (@tanstack/react-router), conserva estilos
  (subrayado al hover). Asegura aria-label descriptivo.
  8. frontend/src/routes/technology-ranking.tsx
      - Igual que global: en la tabla, nombre vendor enlaza al detalle.
      - Mantener caption dinámico.
  9. frontend/src/main.tsx
      - Importar Route as VendorDetailRoute y añadirlo al árbol
  (RootRoute.addChildren([...])).
  10. Tests (Vitest):
      - frontend/src/tests/vendor-utils.test.ts
          - Añadir casos para formatFoundationDate, normalizeTechnology,
  summarizeVendorSpeeds.
      - frontend/src/tests/vendor-detail.test.tsx (nuevo)
          - Config similar a otros tests con QueryClient.
          - Cobertura: loading, error (mock rejection), vendor encontrado
  (verifica logo alt, fecha, velocidades min/max), vendor no encontrado (fetch
  ok, pero id inexistente → muestra mensaje y link de retorno).
          - Simula click desde lista? No es necesario; testear route en
  aislamiento.
      - Actualizar tests existentes si es necesario debido a Link (asegurar se
  usan RouterProvider con route tree que incluya vendor detail o mock.
  11. frontend/src/tests/global-ranking.test.tsx y frontend/src/tests/
  technology-ranking.test.tsx
      - Ajustar toMatch snapshot? No. Solo actualizar consultas para adaptarse
  al Link (p.ej. getByRole('link', { name: /Vendor A/ })).
      - Añadir verificación de href en uno de los tests (asegura navegabilidad).

  ### Requisitos adicionales

  - Mantén tipado estricto; sin any.
  - Normaliza tecnologías con normalizeTechnology.
  - No usar useEffect innecesarios; preferir useMemo.
  - Tailwind, sin inline styles (excepto spinner existente).
  - Accesibilidad: VendorCard debe usar encabezados o dl. La tabla de antenas
  debe tener <caption> y scope en headers.
  - Tests deben mockear fetch por vendor detail similar a otras suites (usa
  vi.spyOn(global, 'fetch')).

  ### Validación esperada

  - pnpm test --run debe pasar tras cambios.
  - Navegación manual: desde ranking global/tecnología se puede abrir vendor
  detail correctamente.

  Entrega únicamente los archivos solicitados en formato especificado.
```
**Resumen del resultado:** Se creó la ruta `/vendor/:vendorId` con tarjeta detallada, lista de antenas y enlaces de retorno; los rankings enlazan al detalle y se añadieron helpers (`normalizeTechnology`, `formatFoundationDate`, `summarizeVendorSpeeds`) con pruebas unitarias e integración.  
**Uso dentro del proyecto:** Cambios en `frontend/src/lib/vendor.ts`, `frontend/src/api/vendors.ts`, `frontend/src/components/VendorCard.tsx`, `frontend/src/components/AntennaList.tsx`, `frontend/src/routes/vendor-detail.tsx`, integraciones en `frontend/src/routes/global-ranking.tsx`, `frontend/src/routes/technology-ranking.tsx`, `frontend/src/components/VendorTable.tsx`, `frontend/src/main.tsx`, más tests en `frontend/src/tests/vendor-utils.test.ts`, `frontend/src/tests/global-ranking.test.tsx`, `frontend/src/tests/technology-ranking.test.tsx` y `frontend/src/tests/vendor-detail.test.tsx`.

## Interacción 4
**Fecha y hora (Europe/Madrid):** 2025-10-02 03:48  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Pulir UI/UX con layout responsive, sidebar contextual, theming claro/oscuro y mejoras de accesibilidad (skip link, focus states), actualizando tests y docs  
**Prompt exacto enviado:**
```
Genera el código del Paso 4 (UI polish & theming) con estas metas:
  - Tailwind refactor para layout responsive (max-w, grid en desktop, spacing
  consistente).
  - Añadir barra lateral o cards destacadas según vendor (mejor usabilidad).
  - Implementar tema claro/oscuro (preferencia sistema con toggle accesible
  en header).
  - Reforzar accesibilidad: enlaces “Saltar al contenido”, focus states
  personalizados, aria-current en nav.
  - Ajustar tests si cambian estructuras.
  - Documentar nuevas decisiones en README (sección Diseño/Accesibilidad) y
  actualizar PROMPTS.md.

  Formato: bloques `### <ruta>` + código completo. Archivos:
  - `frontend/src/routes/__root.tsx` (layout + toggle tema + skip link).
  - `frontend/src/main.tsx` (ThemeProvider o contexto).
  - Componentes existentes donde se apliquen clases nuevas.
  - `frontend/src/index.css` si necesitas variables de color.
  - Tests relevantes para asegurar toggle y navigation no se rompen.

  Mantén Tailwind, sin librerías extras salvo necesitar @headlessui
  (justificar). Verifica `pnpm test --run`.
```
**Resumen del resultado:** Se añadió `ThemeProvider` con persistencia de preferencia, toggle accesible en la cabecera y footer con estado del tema; se introdujeron skip link y focus styles reutilizables, se modernizaron los layouts (grid con sidebar, tarjetas y tablas con borde/variables de color) y se actualizaron los tests para funcionar con el router real.  
**Uso dentro del proyecto:** Ajustes en `frontend/src/index.css`, `frontend/src/routes/__root.tsx`, `frontend/src/main.tsx`, `frontend/src/components/VendorTable.tsx`, `frontend/src/components/VendorCard.tsx`, `frontend/src/components/AntennaList.tsx`, `frontend/src/components/TechnologyRankingControls.tsx`, rutas `frontend/src/routes/global-ranking.tsx`, `frontend/src/routes/technology-ranking.tsx`, `frontend/src/routes/vendor-detail.tsx` y tests `frontend/src/tests/*`. Documentación actualizada en `README.md`.

## Interacción 5
**Fecha y hora (Europe/Madrid):** 2025-10-02 04:17  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Añadir hero de KPIs globales y tarjeta de insights por tecnología, aplicando animaciones/shadows premium y actualizar documentación  
**Prompt exacto enviado:**
```
Incorporar una “Vendor Insight Card” con visualización ligera en el detalle
▌   (por ejemplo, una micro‐barra horizontal o sparkline que compare velocidades
▌   por tecnología). Puedes generar los dataset con computeTechnologyRanking
▌   por vendor y usar un gráfico minimalista basado en Tailwind (divs con width
▌   en %); evita librerías pesadas. Así iluminas patrones visuales sin romper
▌   simplicidad. Añade modos de tarjeta en la página principal (hero con KPIs globales: top
▌   vendor, velocidad media total, variación).
▌   2. Introduce animaciones suaves (transition, hover:) y sombras sutiles
▌   (shadow-md/hover:shadow-lg) para dar sensación premium.
▌   3. Ajusta tipografía (tracking, tamaño base 15/16 px) y espaciados uniformes
▌   (gap-6, p-6) para mantener armonía.
▌   4. Usa degradados discretos en header/CTA (ej. bg-gradient-to-r from-sky-
▌   500/10 to-blue-500/10). Luego actualiza Prompts.md y el readme en caso de ser necesario
```
**Resumen del resultado:** Se incorporó un hero con KPIs (vendor líder, media global, brecha) y una tarjeta “Vendor Insight” con micro-barras por tecnología; se ajustaron degradados, sombras y animaciones suaves. Tests y README actualizados.  
**Uso dentro del proyecto:** Cambios en `frontend/src/lib/vendor.ts`, nuevo componente `frontend/src/components/VendorInsightCard.tsx`, actualizaciones en `frontend/src/routes/__root.tsx`, `frontend/src/routes/vendor-detail.tsx`, y pruebas `frontend/src/tests/vendor-utils.test.ts`, `frontend/src/tests/vendor-detail.test.tsx`.

## Interacción 6
**Fecha y hora (Europe/Madrid):** 2025-10-02 04:26  
**Herramienta / Modelo:** ChatGPT – GPT-5 (Codex TL)  
**Objetivo:** Hacer la UI totalmente responsive, añadir iconografía ligera y refinar la experiencia móvil con navegación inferior y animaciones suaves  
**Prompt exacto enviado:**
```
Objetivos
  - Hacer la UI totalmente responsive (breakpoints xs/sm, spacing/typografía
  adaptables, ver hero, tablas, tarjetas).
  - Añadir iconos ligeros (Hero KPIs, tarjetas de insight, sidebar) usando
  Heroicons outline vía componentes SVG propios (sin libs extra).
  - Mejorar visibilidad mobile: reorganizar grid → una sola columna con tarjetas
  apiladas, barra inferior de navegación opcional, ajustar tamaños de fuente
  (base 15px).
  - Añadir animaciones suaves (hover/focus) y sombras graduales.
  - Mantener accesibilidad (aria-label en iconos decorativos con `aria-hidden`,
  focus rings).
  - Actualizar tests si cambia markup clave (hero/tests de detalle).
  - Documentar en README la iconografía y el soporte responsive, registrar
  interacción en PROMPTS.md.

  Archivos a tocar
  - `frontend/src/routes/__root.tsx` (layout responsivo, iconos en hero/sidebar/
  nav, nav mobile si procede).
  - `frontend/src/components/VendorInsightCard.tsx` y `VendorCard.tsx` (iconos y
  spacing mobile).
  - `frontend/src/components/VendorTable.tsx`, `TechnologyRankingControls.tsx`,
  `AntennaList.tsx` (responsivo + iconos donde aplique).
  - `frontend/src/index.css` (tipografía base, media queries si faltan).
  - Tests relevantes (`vendor-detail`, `global-ranking`, `technology-ranking`)
  para confirmar estructura y links siguen accesibles.
  - README y PROMPTS.md si hay cambios notables.

  Mantén Tailwind; sin dependencias nuevas. Verifica `pnpm test --run`.
 actualizar luego prompts.md y readme
```
**Resumen del resultado:** Se creó un set de iconos SVG, se añadió navegación inferior móvil, se ajustó la tipografía base a 15/16px, se actualizó el hero y tarjetas con iconografía y animaciones, y se reforzó el responsive. README y tests fueron actualizados.  
**Uso dentro del proyecto:** Nuevo archivo `frontend/src/components/icons.tsx`, cambios en `frontend/src/index.css`, componentes `VendorCard`, `VendorInsightCard`, `TechnologyRankingControls`, `AntennaList`, tabla `VendorTable`, ruta `frontend/src/routes/__root.tsx`, y tests (`frontend/src/tests/vendor-detail.test.tsx`, `frontend/src/tests/vendor-utils.test.tsx`).

## 📝 Ejemplo de entrada en PROMPTS.md
## Interacción 1
Herramienta/Modelo: ChatGPT – GPT-4o
Objetivo: Crear tabla de ranking en React
Prompt exacto:
"Genera un componente React con TypeScript llamado RankingTable..."
Resumen del resultado: Tabla con props tipadas y enlaces
Uso: src/components/RankingTable.tsx
