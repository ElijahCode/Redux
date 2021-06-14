import { compose } from "../compose/compose";
import { createStore } from "../createStore/createStore";
import {
  Action,
  Store,
  CreateStore,
  Reducer,
  Middleware,
  State,
} from "../types";

export function applyMiddleware(...middleware: Middleware[]): any {
  return (reducer: Reducer, preLoadedState?: State): Store => {
    let state: State;
    if (!preLoadedState) {
      state = reducer(null, { type: "INIT" });
    } else {
      state = preLoadedState;
    }
    const store = createStore(reducer, state);

    const chain = middleware.map((el) => el(store));
    store.dispatch = compose(...chain)(store.dispatch.bind(store));
    return store;
  };
}
