import { Store, Reducer, State, Action } from "../types";

export function createStore(reducer: Reducer, preLoadedState?: State): Store {
  const store: Store = {
    state: preLoadedState,
    listeners: [],
    storeReducer(state: State, action: Action): State {
      return reducer(state, action);
    },
    getState() {
      return this.state;
    },
    dispatch(action: Action): void {
      this.state = this.storeReducer(this.state, action);
      this.listeners.forEach((el) => el());
    },
    subscribe(param) {
      this.listeners.push(param);
      return () => this.listeners.splice(0);
    },
    replaceReducer(nextReducer: Reducer): void {
      this.storeReducer = nextReducer;
    },
  };

  return store;
}
