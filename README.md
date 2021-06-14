[![Coverage Status](https://coveralls.io/repos/github/ElijahCode/Redux/badge.svg?branch=development)](https://coveralls.io/github/ElijahCode/Redux?branch=development)

# ElijahCode Redux

This is my version of the [Redux library](https://github.com/reduxjs/redux), a popular predictable container for javascript applications.

Currently, my option supports creating a store, getting its state, changing the reducer, and using middlewares, as well as the combineReducers feature, which allows you to create one reducer from several.

## Usage

### Creating store

You can create new store using function createStore. This function have next signature:

```ts
createStore(
    reducer, preloadedState?, applyMiddleware?
) => store;
```

Let's watch on argumets of this function:

1. reducer is clean function that input state of system and action and return new state of system. It's have signature:

```ts
reducer(state, action) => newState
```

state may have any type of data, action - object with string keys's type and any type of data as value;

2.  preloadedState is optional argument, that config initital state of system. It's can have any type of data.
3.  applyMiddleware is optional parameter. For more information about using it watch applyMiddlewatr section.

```js
middlewares = storage => next => action {
    ... // some actions
    return next(storage.getState(), action);
}
```

Finally, now we can see example of using creating store function:

```js
function reducer(state, action) {
  let result;
  switch (action.type) {
    case "On":
      result = { appState: "Is running" };
      break;
    default:
      result = { appState: "Is stopped" };
  }
  return result;
}

const preLoadedState = { appState: "Not defined" };

const store = createStore(reducer, preLoadedState);

const storeWithOnlyReducer = createStore(reducer);
```

For wathcing work of methods store object I will use store that I created in last block of code.

### store.getState();

That method is return current state of system:

```js
console.log(store.getState()); // -> Not defined
```

### store.dispatch(action);

This method call reducer and get him action, in this way we get new state of system

```js
store.dispatch({ type: "On" });
console.log(store.getState()); // -> { appState: 'Is running'}
```

### store.subscribe(param)

This method allows call function, that given in param then state is changing. It's return function, that unsubscribe all subscribed functions;

```js
function spy() => {
    console.log("I see that state is change!");
}

const unsubscribe = store.subsctibe(spy);

store.dispactch({type: 'Off'});
// -> I see that state is change!

unsubscribe();

store.dispactch({type: 'On'});
```

### store.replaceRuducer(reducer)

This method change current reducer in store.

```js
function newReducer(state, action) {
  let result;
  switch (action.work) {
    case "work":
      result = { taskState: "In work" };
      break;
    default:
      result = { taskState: "Not in  work" };
  }
  return result;
}

store.replaceReducer(newReducer);
store.dispatch({ work: "work" });

console.log(store.getState()); // -> { taskState: "In work" }
```

# combineReducers

This function get a object, that values is reducers function, as argument and return new state of function, that given reducers is calculated.

## Signature

This function have next signature

```js
combineReducers(reducers) => state
```

## Usage

Well, get store, reducer and newReducer from last section and use it with combineReducer function:

```js
store.replaceReducer(combineReducer(reducer, newReducer));

store.dispatch({
  type: "On",
  work: "In work",
});

console.log(store.getState());
// -> {applyState: 'On', taskState: 'In work'}
```

# applyMiddleware

## Description

This function let you run functions(calling middleware's) when running dispatch methnod but before running reducer.

Whith middleware's you create loggers, API points and other features.

## Usage

You can use appleMiddleware like this:

```ts
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

    const store = createStore(
      reducer,
      state,
      applyMiddleware(logger, logger2)
    );

    store.dispatch({ type: "ACTION" });

    console.log(log.action); // -> "ACTION"
    console.log(log.state); // -> 5

    console.log(log2.action); // -> "ACTION"
    console.log(log2.isRun); // -> true
    console.log(log2.state); // -> 5
    console.log(store.getState(); // -> 6
```

# ChangeLog

## 2.0.0

1. Remove middleware method from store.
2. Add supporting function compose.
3. Add appleMiddleware function
4. Add support appleMiddlware to createStore function;
