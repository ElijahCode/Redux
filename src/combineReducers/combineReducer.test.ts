import { combineReducers } from "./combineReducers";
import { createStore } from "../createStore/createStore";
import { State, Action } from "../types";

describe("combineReducers", () => {
  it("returns a reducer based on the config (initial state)", () => {
    const reducer = combineReducers({
      a: (state = 2, action) => state,
      b: (state = "hop", action) => state,
    });
    expect(reducer(undefined, { type: "unknown" })).toEqual({
      a: 2,
      b: "hop",
    });
  });

  it("calls subreducers with proper values", () => {
    const config = {
      a: jest.fn((state = 5, action) => state + action.payload),
      b: jest.fn((state = 6, action) => state - action.payload),
    };
    const reducer = combineReducers(config);

    const state: State = {
      a: 55,
      b: 66,
    };
    const action1 = { payload: 1 };
    const newState1 = reducer(state, { payload: 1 });

    expect(config.a).toHaveBeenCalledWith(55, action1);
    expect(config.b).toHaveBeenCalledWith(66, action1);

    expect(newState1).toEqual({
      a: 56,
      b: 65,
    });

    const action2 = { payload: 2 };
    const newState2 = reducer(newState1, action2);
    expect(config.a).toHaveBeenCalledWith(56, action2);
    expect(config.b).toHaveBeenCalledWith(65, action2);
    expect(newState2).toEqual({
      a: 58,
      b: 63,
    });
  });
});

describe("Complex test with createStore", () => {
  const fun1 = (state: State, action: Action): State => {
    let result = state;
    switch (action.type) {
      case "Fun1 is active":
        result = "Fun1On";
        break;
      default:
        result = [];
    }
    return result;
  };

  const fun2 = (state: State, action: Action) => {
    let result = state;
    switch (action.type) {
      case "Fun2 is active":
        result = "Fun2On";
        break;
      default:
        result = [];
    }
    return result;
  };

  const store = createStore(combineReducers({ a: fun1, b: fun2 }), []);

  it("Will return {a: Fun1, b: []}", () => {
    store.dispatch({ type: "Fun1 is active" });
    expect(store.getState().a).toBe("Fun1On");
    expect(store.getState().b).toStrictEqual([]);
  });

  it("Will return {a: [], b: Fun2}", () => {
    store.dispatch({ type: "Fun2 is active" });
    expect(store.getState().a).toStrictEqual([]);
    expect(store.getState().b).toBe("Fun2On");
  });

  it("Will return {a: [], b: []}", () => {
    store.dispatch({ type: "Fun1 is active" });
    expect(store.getState().a).toBe("Fun1On");
    expect(store.getState().b).toStrictEqual([]);
  });
});
