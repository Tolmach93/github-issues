/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import '../sass/User.sass'

export default class User extends Component {
    render() {
        const {user} = this.props;

        return (
            <a href={user.html_url} target="_blank" className="user">
                <img className="user__avatar" src={user.avatar_url}/>{user.login}
            </a>
        );
    }
}