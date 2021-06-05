import { Store, Action } from "../types";
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
      stateAfterReducer: "",
    };

    const log2 = {
      isRun: false,
      stateBeforeReducer: "",
      action: "",
    };

    const logger = (store: Store) => (next: Store["storeReducer"]) => (
      action: Action
    ) => {
      log.action = action.type as string;
      const result = next(store.getState(), action);
      log.stateAfterReducer = result;
      return result;
    };

    const logger2 = (store: Store) => (next: Store["storeReducer"]) => (
      action: Action
    ) => {
      log2.isRun = true;
      log2.action = action.type as string;
      log2.stateBeforeReducer = store.getState();
      return next(store.getState(), action);
    };

    const store = createStore((state) => state + 1, 1, [logger]);

    expect(log.action).toBe("");
    expect(log.stateAfterReducer).toBe("");
    expect(store.getState()).toBe(1);

    store.dispatch({ type: "Action4" });

    expect(log.action).toBe("Action4");
    expect(log.stateAfterReducer).toBe(2);
    expect(store.getState()).toBe(2);

    store.replaceReducer((state) => state + 5);
    store.dispatch({ type: "Action5" });

    expect(log.action).toBe("Action5");
    expect(log.stateAfterReducer).toBe(7);
    expect(store.getState()).toBe(7);

    log.action = "";
    log.stateAfterReducer = "";

    const store2 = createStore((state) => state + 3, 1, [logger, logger2]);

    expect(log.action).toBe("");
    expect(log.stateAfterReducer).toBe("");
    expect(log2.isRun).toBeFalsy();
    expect(log2.action).toBe("");
    expect(log2.stateBeforeReducer).toBe("");
    expect(store2.getState()).toBe(1);

    store2.dispatch({ type: "tiptop" });

    expect(log.action).toBe("tiptop");
    expect(log.stateAfterReducer).toBe(4);
    expect(log2.isRun).toBeTruthy();
    expect(log2.action).toBe("tiptop");
    expect(log2.stateBeforeReducer).toBe(1);
    expect(store2.getState()).toBe(4);
  });
});
