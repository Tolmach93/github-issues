/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import Header from './Header';
import './../sass/App.sass';


class App extends Component {
    render() {
        return (
            <div className="app">
                <Header/>
            </div>
        );
    }
}
export default App