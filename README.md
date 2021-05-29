[![Coverage Status](https://coveralls.io/repos/github/ElijahCode/Redux/badge.svg?branch=master)](https://coveralls.io/github/ElijahCode/Redux?branch=master)

# ElijahCode Redux

This is my version of the [Redux library](https://github.com/reduxjs/redux), a popular predictable container for javascript applications.

Currently, my option supports creating a store, getting its state, changing the reducer, and using middlewares, as well as the combineReducers feature, which allows you to create one reducer from several.

## Usage

### Creating store

You can create new store using function createStore. This function have next signature:

    createStore(
        reducer, preloadedState?, [... middlewares]?
        ) => store;

Let's watch on argumets of this function:

1.  reducer is clean function that input state of system and action and return new state of system. It's have signature:

        reducer(state, action) => newState

    state may have any type of data, action - object with string keys's type and any type of data as value;

2.  preloadedState is optional argument, that config initital state of system. It's can have any type of data.
3.  [... middlewares] is optional argument, that is an array of function, that perfom actions between getting action and calculated new state of systems. This functions must contain in themselfs next functionality:

            middlewares = storage => next => action {
                ... // some actions
                return next(storage.getState(), action);
            }

    Finally, now we can see example of using creating store function:

        function reducer(state, action) {
            let result;
            switch (action.type) {
                case"On":
                    result = { appState: "Is running" };
                    break;
                default:
                    result = { appState: "Is stopped" };
            }
            return result;
        }

        const preLoadedState = { appState: 'Not defined' };

        const logger = storage => next => action => {
            console.log('Current state: ' + storage.getState());
            console.log('Action: ' + action);
            const result = next(storage.getState(), action);
            console.log(result);
            return result
        }

        const middlewares = [logger];

        const store = createStore(reducer, preLoadedState, middlewares);

        const storeWithoutMiddlewares = createStore(reducer, preLoadedState);

        const storeWithOnlyReducer = createStore(reducer);

For wathcing work of methods store object I will use store that I created in last block of code.

### store.getState();

That method is return current state of system:

    console.log(store.getState()) // -> Not defined

### store.dispatch(action);

This method call reducer and get him action, in this way we get new state of system

    store.dispatch({type: 'On'});
    console.log(store.getState()); // -> { appState: 'Is running'}

### store.subscribe(param)

This method allows call function, that given in param then state is changing. It's return function, that unsubscribe all subscribed functions;

    function spy() => {
        console.log("I see that state is change!");
    }

    const unsubscribe = store.subsctibe(spy);

    store.dispactch({type: 'Off'});

    // -> I see that state is change!

    unsubscribe();

    store.dispactch({type: 'On'});

### store.replaceRuducer(reducer)

This method change current reducer in store.

    function newReducer(state, action) {
        let result;
        switch (action.work) {
            case"work":
                result = { taskState: "In work" };
                break;
            default:
                result = { taskState: "Not in  work" };
        }
        return result;
    }

    store.replaceReducer(newReducer);
    store.dispatch({work: 'work'});

    console.log(store.getState()) // -> { taskState: "In work" }

# combineReducers

This function get a object, that values is reducers function, as argument and return new state of function, that given reducers is calculated.

## Signature

This function have next signature

    combineReducers(reducers) => state

## Usage

Well, get store, reducer and newReducer from last section and use it with combineReducer function

    store.replaceReducer(combineReducer(reducer, newReducer));

    store.dispatch({
        type: 'On',
        work: "In work"
    })

    console.log(store.getState());
    // -> {applyState: 'On', taskState: 'In work'}
