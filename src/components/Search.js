/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e) {
        const input = e.target.value ? e.target : e.target.previousElementSibling;
        let [user, repository] = input.value.trim().split(' ');
        if(!repository) return false;
        input.value = `${user} ${repository}`;
        return this.props.onClick({user, repository})
    }

    handleKeyPress(e) {
        if (e.key === 'Enter') return this.handleClick(e);
    }

    render() {
        return (
            <div className="Search">
                <input type="text" onKeyPress={this.handleKeyPress} defaultValue={this.props.value}
                       placeholder="Введите имя пользователя и навание репозитория"/>
                <button onClick={this.handleClick}>Поиск</button>
            </div>
        );
    }
}