import applyMiddleware from 'redux/lib/applyMiddleware'
import compose from 'redux/lib/compose'
import createStore from 'redux/lib/createStore'

import createRootReducer from './reducer'

export class State {
  constructor (initialState = {}) {
    const enhancers = []
    const middleware = []

    let composeEnhancers = compose

    // if (__DEV__) {
    //   const composeWithDevToolsExtension = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__; // eslint-disable-line no-underscore-dangle,max-len
    //   if (typeof composeWithDevToolsExtension === 'function') {
    //     composeEnhancers = composeWithDevToolsExtension;
    //   }
    // }

    this.store = createStore(
      createRootReducer({}),
      initialState,
      composeEnhancers(
        applyMiddleware(...middleware),
        ...enhancers
      )
    )
    this.store.asyncReducers = {}

    if (module.hot) {
      module.hot.accept('./reducer', () => {
        this.store.replaceReducer(createRootReducer(this.store.asyncReducers))
      })
    }
  }

  injectReducer (key, reducer) {
    if (this.store.asyncReducers.hasOwnProperty(key)) return

    this.store.asyncReducers[key] = reducer
    this.store.replaceReducer(createRootReducer(this.store.asyncReducers))
  }
}

export default new State()