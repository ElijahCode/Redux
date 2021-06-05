import { Store, Reducer, State, Action, Middleware } from "../types";
export { combineReducers } from '../combineReducers/combineReducers'

export function createStore(
  reducer: Reducer,
  preLoadedState?: State,
  middlewareList?: Middleware[]
): Store {
  const store: Store = {
    state: preLoadedState,
    listeners: [],
    middlewareList: middlewareList || [],
    storeReducer(state: State, action: Action): State {
      return reducer(state, action);
    },
    getState() {
      return this.state;
    },
    dispatch(action: Action): void {
      if (this.middlewareList.length > 0) {
        this.middleware(action);
      } else {
        this.state = this.storeReducer(this.state, action);
      }
      this.listeners.forEach((el) => el());
    },
    subscribe(param) {
      this.listeners.push(param);
      return () => this.listeners.splice(0);
    },
    replaceReducer(nextReducer: Reducer): void {
      this.storeReducer = nextReducer;
    },
    middleware(action: Action): void {
      if (this.middlewareList.length === 1) {
        this.state = this.middlewareList[0](store)(() =>
          this.storeReducer(this.state, action)
        )(action);
      } else {
        let result;
        this.middlewareList.forEach((el) => {
          result = el(store)(() => this.storeReducer(this.state, action))(
            action
          );
        });
        this.state = result;
      }
    },
  };

  return store;
}
