#!/usr/bin/env node

const packageJson = require('./package.json');

const scriptDescriptions = [
  ['prepare', 'Builds the WebAssembly core and JavaScript library before publishing or local package linking.'],
  ['start', 'Runs the debugger, WebAssembly core watcher, and library watcher together for day-to-day development.'],
  ['start:ts', 'Runs the debugger with the TypeScript library build watcher instead of the WebAssembly library watcher.'],
  ['dev', 'Alias for start.'],
  ['watch', 'Alias for start.'],
  ['dev:ts', 'Alias for start:ts.'],
  ['watch:ts', 'Alias for start:ts.'],
  ['build', 'Builds the WebAssembly core and production library bundle.'],
  ['deploy', 'Builds and publishes the library and demo applications.'],
  ['help', 'Prints this npm script guide.'],
  ['help:check', 'Verifies every package.json script has a description in cli.js.'],
  ['prettier', 'Formats supported source files with the repo Prettier config.'],
  ['prettier:lint', 'Checks supported source files for Prettier formatting drift.'],
  ['prettier:lint:message', 'Prints the Prettier lint preamble used by prettier:lint.'],
  ['prettier:lint:list', 'Lists files that differ from the repo Prettier config.'],
  ['prettier:lint:fix', 'Writes Prettier formatting changes to supported source files.'],
  ['precommit', 'Runs the staged-file formatting check used by the git hook.'],
  ['core:watch', 'Rebuilds the AssemblyScript core whenever files under core/ change.'],
  ['core:build', 'Builds the AssemblyScript core and copies its artifacts into build/assets.'],
  ['core:build:asc', 'Compiles the AssemblyScript core to WebAssembly, text format, and a source map.'],
  ['core:build:ts', 'Builds the core through Rollup with the TypeScript environment.'],
  ['core:build:asc:measure', 'Runs the AssemblyScript compiler in measurement mode without emitting files.'],
  ['core:build:ts:measure', 'Runs TypeScript diagnostics for the core without emitting files.'],
  ['core:build:dist', 'Creates build asset directories and copies built core artifacts.'],
  ['core:build:dist:mkdir', 'Creates the build/assets directory.'],
  ['core:build:dist:cp', 'Copies built core artifacts from dist/core into build/assets.'],
  ['core:build:done', 'Prints the core build completion message.'],
  ['lib:build', 'Builds the library bundles and the getCore closure helper.'],
  ['lib:watch:wasm', 'Watches the production WebAssembly library Rollup build.'],
  ['lib:build:wasm', 'Builds the production WebAssembly library bundle.'],
  ['lib:watch:ts', 'Watches the TypeScript library Rollup build.'],
  ['lib:build:ts', 'Builds the production TypeScript library bundle.'],
  ['lib:build:ts:esnext', 'Builds the TypeScript library bundle for ESNext consumers.'],
  ['lib:build:ts:getcoreclosure', 'Builds the TypeScript getCore closure helper.'],
  ['lib:build:ts:getcoreclosure:closuredebug', 'Builds the getCore closure helper with closure debug output enabled.'],
  ['lib:deploy', 'Builds the core and library, then runs the npm publish workflow.'],
  ['lib:deploy:np', 'Runs np without cleanup for the library publish workflow.'],
  ['test', 'Runs the full accuracy test workflow.'],
  ['test:accuracy', 'Builds the project and runs accuracy tests.'],
  ['test:accuracy:nobuild', 'Runs accuracy tests against already-built artifacts.'],
  ['test:perf', 'Alias for test:performance.'],
  ['test:performance', 'Builds the project and runs performance tests.'],
  ['test:performance:nobuild', 'Runs performance tests against already-built artifacts.'],
  ['test:integration', 'Builds the project and runs browser-library and headless integration tests.'],
  ['test:integration:nobuild', 'Runs integration tests against already-built artifacts.'],
  ['test:integration:lib', 'Runs the browser-library integration test suite.'],
  ['test:integration:headless', 'Runs the headless Node integration smoke test.'],
  ['test:core', 'Builds the project and runs core save-state tests.'],
  ['test:core:nobuild', 'Runs core tests against already-built artifacts.'],
  ['test:core:savestate', 'Runs the core save-state test suite.'],
  ['debugger:dev', 'Alias for debugger:watch.'],
  ['debugger:watch', 'Serves and watches the debugger demo with Rollup.'],
  ['debugger:build', 'Builds the debugger demo.'],
  ['debugger:build:skiplib', 'Builds the debugger demo while reusing existing library artifacts.'],
  ['benchmark:build', 'Builds the benchmark demo.'],
  ['benchmark:build:skiplib', 'Builds the benchmark demo while reusing existing library artifacts.'],
  ['benchmark:dev', 'Alias for benchmark:watch.'],
  ['benchmark:watch', 'Serves and watches the benchmark demo with Rollup.'],
  ['amp:build', 'Builds the AMP demo.'],
  ['amp:build:skiplib', 'Builds the AMP demo while reusing existing library artifacts.'],
  ['amp:dev', 'Alias for amp:watch.'],
  ['amp:watch', 'Serves and watches the AMP demo with Rollup.'],
  ['iframe:dev', 'Alias for iframe:watch.'],
  ['iframe:watch', 'Serves and watches the iframe demo with Rollup.'],
  ['iframe:serve', 'Serves the built iframe demo from build/iframe on port 8080.'],
  ['iframe:build', 'Builds the iframe demo.'],
  ['iframe:build:skiplib', 'Builds the iframe demo while reusing existing library artifacts.'],
  ['demo:build', 'Builds the core, library, and all demo applications.'],
  ['demo:build:apps', 'Builds all demo applications using existing core and library artifacts.'],
  ['demo:cname', 'Writes the GitHub Pages CNAME file for wasmboy.app.'],
  ['demo:dist', 'Copies dist artifacts into the demo build directory.'],
  ['demo:gh-pages', 'Publishes the build directory to GitHub Pages.'],
  ['demo:deploy', 'Builds and deploys all demo applications.'],
  ['wasmerboy:build', 'Builds the WasmerBoy WebAssembly module.'],
  ['wasmerboy:start', 'Runs the WasmerBoy demo through wapm with the Tobu Tobu Girl ROM.']
];

const categoryMatchers = [
  ['Core', name => name.startsWith('core:')],
  ['Library', name => name.startsWith('lib:')],
  ['Tests', name => name === 'test' || name.startsWith('test:')],
  ['Debugger', name => name.startsWith('debugger:')],
  ['Benchmark', name => name.startsWith('benchmark:')],
  ['AMP', name => name.startsWith('amp:')],
  ['Iframe', name => name.startsWith('iframe:')],
  ['Demo Deployment', name => name.startsWith('demo:')],
  ['WasmerBoy', name => name.startsWith('wasmerboy:')],
  ['Formatting', name => name.startsWith('prettier') || name === 'precommit'],
  ['Top Level', () => true]
];

const descriptions = new Map(scriptDescriptions);
const scripts = Object.keys(packageJson.scripts);

function getMissingDescriptions() {
  return scripts.filter(scriptName => !descriptions.has(scriptName));
}

function groupScripts() {
  const groups = categoryMatchers.map(([title]) => [title, []]);

  scripts.forEach(scriptName => {
    const groupIndex = categoryMatchers.findIndex(([, matches]) => matches(scriptName));
    groups[groupIndex][1].push(scriptName);
  });

  return groups.filter(([, scriptNames]) => scriptNames.length > 0);
}

function printHelp() {
  const commandWidth = Math.max(...scripts.map(scriptName => `npm run ${scriptName}`.length)) + 2;

  console.log('WasmBoy npm scripts');
  console.log('');
  console.log('Usage:');
  console.log('  npm run help');
  console.log('  npm run help:check');
  console.log('');

  groupScripts().forEach(([title, scriptNames]) => {
    console.log(title);
    console.log('-'.repeat(title.length));
    scriptNames.forEach(scriptName => {
      const command = `npm run ${scriptName}`;
      console.log(`${command.padEnd(commandWidth)} ${descriptions.get(scriptName)}`);
    });
    console.log('');
  });
}

function checkDescriptions() {
  const missing = getMissingDescriptions();
  if (missing.length === 0) {
    console.log(`All ${scripts.length} package.json scripts have descriptions.`);
    return;
  }

  console.error('Missing script descriptions in cli.js:');
  missing.forEach(scriptName => console.error(`- ${scriptName}`));
  process.exitCode = 1;
}

if (process.argv.includes('--check')) {
  checkDescriptions();
} else {
  printHelp();
}
