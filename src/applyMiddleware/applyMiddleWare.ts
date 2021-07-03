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
    const state = preLoadedState;
    const store = createStore(reducer, state);
    // if(middleware.length === 1){
    //   store.dispatch = middleware[0](store)(store.dispatch.bind(store));
    //   return store;
    // }
    const chain = middleware.map((el) => el(store));
    store.dispatch = compose(...chain)(store.dispatch.bind(store));
    return store;
  };
}
