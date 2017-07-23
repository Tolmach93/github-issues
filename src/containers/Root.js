import React, {Component} from 'react'
import {Provider} from 'react-redux'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import configureStore from '../configureStore'
import App from '../containers/App'
import Issue from '../containers/Issue'


const store = configureStore();

export default class Root extends Component {
    render() {
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path='/' component={App}/>
                        <Route exact path='/repos/:owner/:repo/issues/:number' component={Issue} />
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}