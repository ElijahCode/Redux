import {
  CombineReducerArgument,
  CombineReducerResult,
  Action,
  State,
} from "../types";

export function combineReducers(
  someobject: CombineReducerArgument
): (state?: State | undefined, action?: Action) => CombineReducerResult {
  return (state?: State | undefined, action?: Action): CombineReducerResult => {
    const result: CombineReducerResult = {};
    Object.keys(someobject).forEach((el) => {
      if (state) {
        result[el] = someobject[el](state[el], action);
      } else {
        result[el] = someobject[el](state, action);
      }
    });
    return result;
  };
}
