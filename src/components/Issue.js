/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';

export default class Issue extends Component {
    render() {
        const {issue} = this.props;
        const divStyle = {
            padding: '20px',
            display: 'inline-block'
        };

        return (
            <div style={divStyle} className="issue">
                {issue.number}) {issue.title} - {new Date(issue.created_at).toDateString()};
            </div>
        );
    }
}