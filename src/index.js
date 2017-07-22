/**
 * Created by tolmach on 20.07.17.
 */

import App from './components/App';
import React from 'react';
import ReactDOM from 'react-dom';

if (NODE_ENV === 'development') {
    const liveReloadScript = document.createElement('script');
    liveReloadScript.src = 'http://localhost:35729/livereload.js';
    document.body.appendChild(liveReloadScript);
}

ReactDOM.render(<App/>, document.getElementById('app'));