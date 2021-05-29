export type State = any;

export type Action = { [key: string]: string | number };

export type Reducer = (state: State | undefined, action: Action) => State;

export type Middleware = (
  store: Store // eslint-disable-line no-use-before-define
) => (next: (action: Action) => any) => (action: Action) => any;

export type Store = {
  state: State;
  listeners: any[];
  middlewareList: Middleware[];
  storeReducer(state: State, action: Action): State;
  getState(): State;
  dispatch(action: Action): void;
  subscribe(fun: () => void): () => void;
  replaceReducer(nextReducer: Reducer): void;
  middleware(action: Action): void;
};

export type CombineReducerArgument = {
  [key: string]: any;
};

export type CombineReducerResult = { [keys: string]: State };
