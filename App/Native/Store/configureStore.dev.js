import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import reducers from './reducers'
import createLogger from 'redux-logger'

// create a store that has redux-thunk middleware, and dev tooling enabled.
// the logger middleware logs the previous state, the action, and the next
// state in the browser's console for easy debuggin' and instrementing the
// dev tools allows for us to commit different actions and go forwards and
// backwards in time using magic
const createDevStoreWithMiddleware = compose(
  applyMiddleware(thunk),
  applyMiddleware(createLogger())
)(createStore)

export default function configureStore () {
  const store = createDevStoreWithMiddleware(reducers)

  // enable webpack hot module replacement for reducers
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers')
      store.replaceReducer(nextRootReducer)
    })
  }

  return store
}
