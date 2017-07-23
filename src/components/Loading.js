/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import '../sass/Loading.sass'

export default class Loading extends Component {
    render() {
        return (
            <div className="loading">
                <svg width="40px" height="40px" viewBox="0 0 66 66"
                     xmlns="http://www.w3.org/2000/svg">
                    <circle className="path" fill="none" strokeWidth="5" strokeLinecap="round" cx="33" cy="33"
                            r="30"></circle>
                </svg>
            </div>
        );
    }
}