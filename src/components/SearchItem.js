/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import Issue from '../components/Issue';
import User from '../components/User';
import '../sass/SearchItem.sass'

export default class SearchItem extends Component {
    render() {
        const {issue, author} = this.props;
        return (
            <div className="search-item">
                <User user={author}/>
                <Issue issue={issue}/>
            </div>
        );
    }
}