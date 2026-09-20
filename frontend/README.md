# aircraft-calculator frontend

An interactive aircraft-design teaching tool. The user builds up a plane
(profile → wing → tail → fuselage → power unit) and each step is both a
**calculator** and a **narrated 3D lesson** rendered with react-three-fiber.

React 18 + TypeScript + Vite. Three.js via react-three-fiber, animation via
react-spring, state via zustand, styling via Tailwind + daisyUI.

## Running it

```bash
npm install
npm start
```

| Script            | What it does                                    |
| ----------------- | ----------------------------------------------- |
| `npm start`       | Vite dev server                                 |
| `npm run host`    | Dev server exposed on the LAN                   |
| `npm run build`   | `tsc --noEmit` then `vite build` into `build/`  |
| `npm run typecheck` | Typecheck only                                |
| `npm run lint`    | ESLint over `src`                               |
| `npm test`        | Jest (`*.spec.ts`)                              |
| `npm run serve`   | Preview a production build                      |

Vite does **not** typecheck while serving, so `npm run typecheck` is the only
thing that catches type errors during development. `npm run build` gates on it.

## Layout

```
src/
  index.tsx          route table (react-router BrowserRouter/Routes)
  App.tsx            shell: the <Canvas>, navigation, subtitles
  features/
    aerodynamics/    profile, wing, tail, fuselage: the biggest feature
      three/         all r3f components for this feature
        tutorials/   the narrated lessons
      stores/        zustand stores for this feature
      utils/wing/    Profile/Wing classes: the actual aerodynamic maths
    power_unit/      engine + propeller, incl. GPU surface plots (GLSL)
    compass/         hyperbolic/elliptic radio navigation
    turn/, performance/   stubs, not yet implemented
    common/
      three/         reusable r3f pieces: LineChart, Hover, Camera, AnimatedHtml
      drawings/      technical-drawing primitives (dimension lines, arrows, angles)
      subtitles/     the lesson narration engine
      inputs/        form inputs shared across features
    navigation/      PlaneBuilder (the main screen), step navigation
  utils/             interpolation, colour parsing, debounce
  scripts/           generators for the checked-in data files (run by hand)
```

A feature owns its own `three/`, `stores/`, `hooks/` and `utils/`. Anything two
features need moves to `features/common/`.

## State

Every store is a zustand hook, named `useXStore`, colocated in the owning
feature's `stores/`. There is no single root store; a store is one topic
(`useWing`, `useEngine`, `useTheme`). Components subscribe with a selector:

```ts
const span = useWingStore((state) => state.span);
```

Stores are also read and written **outside** React: the lesson engine and the
3D drag handlers use `useWingStore.getState()` / `.setState()` directly so they
can run inside `useFrame` and inside async lesson scripts without re-rendering.

## The lesson system

A lesson is an `async` function that awaits subtitles. `features/common/subtitles`
provides the engine; `useSubs()` hands you `sub()` and `pause()`:

```ts
await sub("Air flows faster over the upper surface", () =>
  useHoverProfileStore.setState({ airVectorsUpper: true })
);
await pause(0);            // 0 = wait for a click
```

`sub(text, sideEffect)` shows the subtitle, runs the side effect, and waits for
a duration derived from the text length. The side effects flip flags in "hover"
stores (`useHoverProfile`, `useBernoulli`, `useInducedDrag`, …); the 3D
components watch those flags and spring themselves in and out. So a lesson is a
script of store mutations, and the visuals are a pure function of store state.

Cancellation works by `throw "done"` from inside `useSubs` when the user
navigates away, which unwinds the awaiting lesson function.

## Adding a route

1. Add the page component under its feature.
2. Register it in the route table in `src/index.tsx`.
3. If the page shows the 3D plane, it belongs under `aerodynamics/*` or
   `navigation/*`, which both render `PlaneBuilder`; the sub-path drives the
   camera. Camera positions per pathname live in `features/common/three/Camera.tsx`.
4. Add it to the step navigation in `features/navigation/Steps.tsx` if it is part
   of the build-a-plane sequence.

## Charts

Every chart is drawn inside the 3D canvas by
`features/common/three/LineChart.tsx`, so it can be hovered in sync with the
model. There is no charting library: the axes, ticks and traces are all r3f.

`LineChartNew.tsx` + `Chart.ts` are an in-progress replacement that moves the
axis maths into a `Chart` class. Both are currently shipped, and `LineChartNew`
computes its axes twice, once via `useAxes` and once via `new Chart(...)`.
Finishing that migration means moving everything `useAxes` returns onto
`Chart`, memoising the construction, and deleting `useAxes`.

## Regenerating data

Several files under `features/*/data/` are generated, not hand-written. Their
generators live in `src/scripts/`, and **nothing imports them**: that is the
point, not an oversight.

| Script | Entry point | Produces |
| --- | --- | --- |
| `scripts/generator.ts` | `generate_coefficients()` | `aerodynamics/data/profiles_interpolated.ts` and the profile min/max table |
| `scripts/plateGenerator.ts` | `plateGenerator()` | the flat-plate and brick entries in `aerodynamics/data/profiles.ts` |
| `scripts/meshGeneration.ts` | `generate_verts()`, `generate_verts_rev()` | the `Float32Array` layout held by `power_unit/data/verts.ts` |

Each one `console.log`s its result for pasting back into the data file. There is
no CLI runner: the sources use extensionless imports, so `ts-node` cannot
resolve them without rewriting every import, and `"type": "module"` rules out
its CommonJS mode. To run one, import it into a component, load the dev server,
and copy the output out of the browser console.

`generator.ts` reads the raw wind-tunnel points in `profiles.ts` and emits
evenly-spaced interpolated curves, so a new profile's raw data goes into
`profiles.ts` first and gets regenerated from there. It also carries
`symmetrical_fixer()`, a one-off repair for the `0009` zero-lift offset.

## Known rough edges

- `npm run lint` reports ~57 errors and ~304 warnings. The errors worth reading
  are `react-hooks/rules-of-hooks` (3, all genuine bugs: a conditional
  `useAnimation` in `useProfileAnimation`, a conditional store subscription in
  `useChartUnits`, and `useLoader` called inside the `Fuselage` constructor) and
  `react-hooks/set-state-in-effect` (11).
- Every route except the 3D lessons is crashed in a **production** build:
  `data/steps.ts` filters `steps` to `["/", "aerodynamics"]` under
  `import.meta.env.PROD`, so `Steps.tsx` indexes `steps[-1]`. Dev is unaffected.
- MathJax (loaded from a CDN `<script>` in `index.html`) and KaTeX are both
  live. `Formula` still runs a full-document `MathJax.typeset()` on every `tex`
  change, which is the likeliest render cost in the lessons.
- `jest.config.ts` only transforms `^.+\.ts?$`, so `.tsx` files cannot be
  tested at all.
