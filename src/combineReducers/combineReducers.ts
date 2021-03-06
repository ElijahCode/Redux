import {
  CombineReducerArgument,
  CombineReducerResult,
  Action,
  State,
} from "../types";

export function combineReducers(
  reducers: CombineReducerArgument
): (state?: State | undefined, action?: Action) => State {
  return (state?: State | undefined, action?: Action): State => {
    const result: State = {};
    Object.keys(reducers).forEach((el) => {
      if (state) {
        result[el] = reducers[el](state[el], action);
      } else {
        result[el] = reducers[el](state, action);
      }
    });
    return result;
  };
}
