/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';

export default class Item extends Component {
    render() {
        const {item} = this.props;
        const divStyle = {
            padding: '20px',
        };

        return (
            <div style={divStyle} className="item">
                {item.title};
            </div>
        );
    }
}