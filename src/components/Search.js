/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';

export default class Search extends Component {
    render() {
        const { value, onClick} = this.props;
        return (
            <div className="Search">
                <input type="text" defaultValue={value} placeholder="Введите имя пользователя и навание репозитория"/>
                <button onClick={e => onClick(e.target.previousElementSibling.value)}>Поиск</button>
            </div>
        );
    }
}