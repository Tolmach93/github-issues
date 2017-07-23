/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import Select from './Select'
import '../sass/NavSearch.sass'

export default class NavSearch extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {refresh, changePerPage, selectedPerPage} = this.props;

        return (
            <div className="nav-search">
                <Select onChange={changePerPage} value={selectedPerPage}
                         options={[10, 20, 30, 50, 100]}/>
                <div className="nav-search__refresh" onClick={refresh}>Обновить</div>
            </div>
        );
    }
}