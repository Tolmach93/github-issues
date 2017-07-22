import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from './reducers'

let middlewareArray = [thunkMiddleware];

if(NODE_ENV === 'development'){
    middlewareArray.push(createLogger());
}


export default function configureStore() {
    return createStore(
        rootReducer,
        applyMiddleware(...middlewareArray)
    )
}