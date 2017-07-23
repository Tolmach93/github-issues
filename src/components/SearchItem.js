/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import { Link } from 'react-router-dom';
import Issue from '../components/Issue';
import User from '../components/User';
import '../sass/SearchItem.sass'

export default class SearchItem extends Component {
    render() {
        const {issue, author, selectedRepository, selectedUser} = this.props;
        return (
            <div className="search-item">
                <User user={author}/>
                <Link to={`/repos/${selectedUser}/${selectedRepository}/issues/${issue.number}`}>
                    <Issue issue={issue}/>
                </Link>
            </div>
        );
    }
}