export type State = any;

export type Action = { [key: string]: string | number };

export type Reducer = (state: State | undefined, action: Action) => State;

export type Store = {
  state: State;
  listeners: any[];
  storeReducer(state: State, action: Action): State;
  getState(): State;
  dispatch(action: Action): void;
  subscribe(fun: () => void): () => void;
  replaceReducer(nextReducer: Reducer): void;
};

export type CombineReducerArgument = {
  [key: string]: any;
  a: Reducer;
  b: Reducer;
};

export type CombineReducerResult = { [keys: string]: State };
