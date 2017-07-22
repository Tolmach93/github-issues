if (NODE_ENV === 'development') {
    const liveReloadScript = document.createElement('script');
    liveReloadScript.src = 'http://localhost:35729/livereload.js';
    document.body.appendChild(liveReloadScript);
}

import Root from './containers/Root';
import React from 'react';
import {render} from 'react-dom';

render(<Root/>, document.getElementById('app'));