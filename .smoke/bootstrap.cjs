/* SSR smoke-test bootstrap — zero-dependency view rendering check.
   Usage (from repo root):
     npx esbuild .smoke/entry.jsx --bundle --jsx=automatic --format=cjs \
       --platform=node --outfile=.smoke/run.cjs --loader:.css=empty \
       --external:react --external:react/jsx-runtime --external:react-dom
     node .smoke/bootstrap.cjs
*/
const store = (() => {
  const m = new Map()
  return {
    getItem: (k) => (m.has(k) ? m.get(k) : null),
    setItem: (k, v) => m.set(k, String(v)),
    removeItem: (k) => m.delete(k)
  }
})()
global.window = {
  location: { hash: '', pathname: '/', origin: 'http://localhost:5173', search: '' },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  history: { replaceState() {} },
  scrollTo() {},
  localStorage: store,
  setTimeout, clearTimeout
}
global.document = {
  querySelector: () => null,
  createElement: () => ({ style: {}, setAttribute() {}, select() {}, remove() {} }),
  body: { appendChild() {} },
  execCommand: () => false
}
global.navigator = { clipboard: null }
global.localStorage = store
global.location = global.window.location
global.history = global.window.history

require('./run.cjs').runAll().then(() => {
  console.log('\nSSR smoke complete')
}).catch((e) => { console.error('SMOKE ERROR:', e); process.exitCode = 1 })
