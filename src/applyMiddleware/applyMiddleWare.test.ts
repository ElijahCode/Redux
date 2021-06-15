import { Action, Store } from "../types";
import { applyMiddleware } from "./applyMiddleWare";

describe("applyMiddleware testing", () => {
  it("Test #1", () => {
    const spy1 = jest.fn();
    const middleware1 = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      spy1();
      return action;
    };

    const store = applyMiddleware(middleware1)((state = 1) => state + 1);
    store.dispatch({ type: "ACTION" });
    expect(spy1).toHaveBeenCalledTimes(1);
    expect(store.getState()).toBe(2);
  });
  it("Test #2", () => {
    const spy1 = jest.fn();
    const spy2 = jest.fn();
    const spy3 = jest.fn();

    const middleware1 = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      spy1();
      return next(action);
    };
    const middleware2 = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      spy2();
      return next(action);
    };
    const middleware3 = (store: Store) => (next: (action: Action) => any) => (
      action: Action
    ) => {
      spy3();
      return action;
    };

    const store = applyMiddleware(
      middleware1,
      middleware2,
      middleware3
    )((state = 1) => state + 1);

    store.dispatch({ type: "ACTION" });

    expect(spy1).toHaveBeenCalledTimes(1);
    expect(spy2).toHaveBeenCalledTimes(1);
    expect(spy3).toHaveBeenCalledTimes(1);
    expect(store.getState()).toBe(2);
  });
});
