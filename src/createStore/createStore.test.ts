import { applyMiddleware } from "../applyMiddleware/applyMiddleWare";
import { Store, Action, State } from "../types";
import { createStore } from "./createStore";

describe("functional interface", () => {
  it("returns state based on initial state", () => {
    const state = { name: "Bob" };
    expect(createStore(() => null).getState()).toBe(undefined);
    expect(createStore(() => null, state).getState()).toBe(state);
  });

  it("calculates new state with reducer call", () => {
    const action1 = { type: "Action1" };
    const action2 = { type: "Action2" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = createStore(reducer);
    store.dispatch(action1);
    expect(reducer).toHaveBeenCalledWith(undefined, action1);
    expect(store.getState()).toBe(2);
    store.dispatch(action2);
    expect(reducer).toHaveBeenCalledWith(2, action2);
    expect(store.getState()).toBe(3);
  });

  it("notifies listeners about updates", () => {
    const action1 = { type: "Action1" };
    const action2 = { type: "Action2" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = createStore(reducer);
    const spy = jest.fn();
    store.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    store.dispatch(action1);
    expect(spy).toHaveBeenCalled();
    store.dispatch(action2);
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("allows to unsubscribe from the events", () => {
    const action1 = { type: "Action1" };
    const action2 = { type: "Action2" };
    const reducer = jest.fn((state = 1) => state + 1);
    const store = createStore(reducer);
    const spy = jest.fn();
    const unsubscribe = store.subscribe(spy);
    expect(spy).not.toHaveBeenCalled();
    store.dispatch(action1);
    expect(spy).toHaveBeenCalled();
    unsubscribe();
    store.dispatch(action2);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it("change a reducer", () => {
    const action1 = { type: "Action3" };
    const reducer = jest.fn((state = 3) => state + 1);
    const store = createStore(reducer);
    store.dispatch(action1);
    expect(reducer).toHaveBeenCalledWith(undefined, action1);
    expect(store.getState()).toBe(4);
    const nextReducer = jest.fn((state) => state - 2);
    store.replaceReducer(nextReducer);
    store.dispatch(action1);
    expect(reducer).toHaveBeenCalledWith(undefined, action1);
    expect(store.getState()).toBe(2);
  });

  it("middleware", () => {
    const log = {
      action: "",
      state: "",
    };

    const log2 = {
      isRun: false,
      state: "",
      action: "",
    };

    const logger = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      log.action = action.type as string;
      log.state = store.getState().counter;
      return next(action);
    };

    const logger2 = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      log2.isRun = true;
      log2.action = action.type as string;
      log2.state = store.getState().counter;
      return next(action);
    };

    function reducer(state: State, action: Action): State {
      return { counter: state.counter + 1 };
    }
    const state = { counter: 5 };

    const store = createStore(reducer, state, applyMiddleware(logger, logger2));

    store.dispatch({ type: "ACTION" });

    expect(log.action).toBe("ACTION");
    expect(log.state).toBe(5);

    expect(log2.action).toBe("ACTION");
    expect(log2.isRun).toBeTruthy();
    expect(log2.state).toBe(5);
    expect(store.getState().counter).toBe(6);
  });
});
