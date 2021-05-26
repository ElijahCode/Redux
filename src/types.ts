export type State = any;

export type Action = { type: string };

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
