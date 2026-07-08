# Contributing to WasmBoy

Thanks for taking the time to improve WasmBoy. The project has three main areas:

- `core`: the AssemblyScript Game Boy core that compiles to WebAssembly.
- `lib`: the JavaScript API and runtime wrapper around the core.
- `demo`: debugger, benchmark, iframe, AMP, and WasmerBoy demo applications.

Open an issue before starting large features, accuracy changes, public API changes, or demo UX changes. Small fixes, docs updates, and focused tests can go straight to a pull request.

## Setup

Use Node 20 or newer and npm 10 or newer.

```bash
npm install
npm run help
```

The repo includes an `.npmrc` that enables the legacy peer dependency resolution required by the older Rollup and Svelte plugin graph.

## Script Guide

Run the local script guide any time you need the current command list:

```bash
npm run help
```

When adding, renaming, or deleting npm scripts, update `cli.js` and verify the guide:

```bash
npm run help:check
```

## Common Workflows

Run the debugger, core watcher, and library watcher together:

```bash
npm run dev
```

Build the core and production WebAssembly library bundle:

```bash
npm run build
```

Check formatting before opening a pull request:

```bash
npm run prettier:lint
```

Run focused tests when possible. Useful entry points include:

```bash
npm run test:integration
npm run test:core
npm run test:accuracy
```

The accuracy suite is slower than the focused integration and core tests. Prefer the narrowest test that proves your change, then run broader tests for emulator behavior, cross-area changes, or release work.

## Pull Requests

- Keep changes focused on one bug, behavior, or documentation topic.
- Add or update tests for emulator behavior and public API changes.
- Include the exact commands you ran in the pull request description.
- Do not commit generated `dist/` or `build/` artifacts unless the release process explicitly requires them.
- For accuracy fixes, mention the ROM or hardware behavior that proves the change.
