/* jsdom interaction flow test — full user journey against the real App.
   Requires the dev-only package jsdom (not in package.json on purpose):
     npm i jsdom --no-save
   Usage (from repo root):
     npx esbuild .smoke/flow.jsx --bundle --jsx=automatic --format=cjs \
       --platform=node --outfile=.smoke/flow.cjs --loader:.css=empty \
       --external:react --external:react/jsx-runtime --external:react-dom --external:jsdom
     node .smoke/bootstrap-flow.cjs
*/
const { JSDOM } = require('jsdom')
const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  url: 'http://localhost:5173/',
  pretendToBeVisual: true
})
global.IS_REACT_ACT_ENVIRONMENT = true
global.window = dom.window
global.document = dom.window.document
global.navigator = dom.window.navigator
global.location = dom.window.location
global.history = dom.window.history
global.HTMLElement = dom.window.HTMLElement
global.Event = dom.window.Event
global.MouseEvent = dom.window.MouseEvent
global.scrollTo = () => {}

require('./flow.cjs').runFlow({ window: dom.window, document: dom.window.document })
  .then(() => console.log('\nFLOW COMPLETE'))
  .catch((e) => { console.error('FLOW ERROR:', e); process.exitCode = 1 })
