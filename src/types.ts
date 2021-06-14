export type State = any;

export interface Action {
  [key: string]: any;
  type: string;
}

export type Reducer = (state: State | undefined, action: Action) => State;

export type Middleware = (
  store: Store // eslint-disable-line no-use-before-define
) => (next: (action: Action) => any) => (action: Action) => any;

export interface Store {
  state: State;
  listeners: any[];
  middlewareList: Middleware[];
  storeReducer(state: State, action: Action): State;
  getState(): State;
  dispatch(action: Action): void;
  subscribe(fun: () => void): () => void;
  replaceReducer(nextReducer: Reducer): void;
  middleware(action: Action): void;
}

export interface CombineReducerArgument {
  [key: string]: State;
}

export interface CombineReducerResult {
  [keys: string]: State;
}

export interface CreateStore {
  (reducer: Reducer, preLoadedState?: State, middlewares?: Middleware[]): Store;
}
