const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const root = path.resolve(__dirname, '../..');

// Load the application's TypeScript without adding a test-runner dependency.
function createLoader(overrides = {}) {
  const cache = new Map();
  function load(file) {
    const absolute = path.resolve(root, file);
    if (cache.has(absolute)) return cache.get(absolute).exports;
    const mod = { exports: {} };
    cache.set(absolute, mod);
    const { outputText } = ts.transpileModule(fs.readFileSync(absolute, 'utf8'), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
    });
    function localRequire(id) {
      if (Object.hasOwn(overrides, id)) return overrides[id];
      if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`);
      return require(id);
    }
    new Function('require', 'module', 'exports', outputText)(localRequire, mod, mod.exports);
    return mod.exports;
  }
  return load;
}

function createMemoryStore(initial) {
  const records = structuredClone(initial);
  const calls = [];
  const get = (obj, key) => key.split('.').reduce((value, part) => value?.[part], obj);
  function matches(row, filter) {
    return Object.entries(filter).every(([key, value]) =>
      value && typeof value === 'object' && '$in' in value
        ? value.$in.includes(get(row, key))
        : get(row, key) === value
    );
  }
  function update(name, filter, change) {
    calls.push({ name, filter, change });
    const row = records[name].find((row) => matches(row, filter));
    if (!row) return { matchedCount: 0, modifiedCount: 0 };
    for (const [key, value] of Object.entries(change.$set)) {
      const parts = key.split('.');
      const last = parts.pop();
      const parent = parts.reduce((obj, part) => (obj[part] ??= {}), row);
      parent[last] = value;
    }
    return { matchedCount: 1, modifiedCount: 1 };
  }
  const models = Object.fromEntries(Object.keys(records).map((name) => [name, {
    countDocuments: async () => records[name].length,
    create: async (row) => records[name].push(structuredClone(row)),
    insertMany: async (rows) => records[name].push(...structuredClone(rows)),
    updateOne: async (filter, change) => update(name, filter, change),
  }]));
  return { records, calls, models, matches, update };
}

module.exports = { createLoader, createMemoryStore };
