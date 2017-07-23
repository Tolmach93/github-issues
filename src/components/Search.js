/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import '../sass/Search.sass'

export default class Search extends Component {
    constructor(props) {
        super(props);
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.state = {
            inputValue: props.value
        }
    }

    handleClick(e, value) {
        let [user, repository] = value && !value.target ? value.split(' ') : this.state.inputValue.trim().split(' ');
        if (!repository) return false;
        return this.props.onClick({user, repository})
    }

    handleKeyPress(e) {
        let value = e.target.value;
        this.setState({
            inputValue: value
        });
        if (e.key === 'Enter') return this.handleClick(e, value);
        if (e.key === ' ') {
            if (value.length && value.split(' ').length === 1) {
                this.props.onCheckUser(value);
            }
        }
    }

    render() {
        const helpList = this.props.help.filter(repo => ~repo.indexOf(this.state.inputValue))
            .map((repo, index) => <div onMouseDown={(e) => {
                const value = e.target.innerText;
                this.setState({
                    inputValue: value
                });
                this.handleClick(e, value);
            }} key={index}>{repo}</div>)

        return (
            <div className="search">
                <div className="search__input-wrapper">
                    <input className="search__input" type="text" onKeyPress={this.handleKeyPress}
                           value={this.state.inputValue}
                           onInput={this.handleKeyPress}
                           placeholder="Имя и репозиторий"/>
                    { helpList.length ? <div className="search__data-list">{helpList}</div> : null }
                </div>
                <div className="search__button" onClick={this.handleClick}>Поиск</div>
            </div>
        );
    }
}