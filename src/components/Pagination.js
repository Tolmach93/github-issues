/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';

export default class Pagination extends Component {
    render() {
        const {current, total, onClick} = this.props;
        const active = {
            background: 'black',
            color: 'white'
        };
        const pages = new Array(total).fill(0).map((item, index) => index + 1)
            .filter(item => item === 1 || (item >= current - 1 && item <= current + 1) || item === total)
            .map(page => <button style={page === current ? active : null} onClick={() => onClick(page)}
                                 key={page}>{page}</button>);
        return (
            <div className="pogination">
                {current !== 1 ? <button onClick={() => onClick(current - 1)}>Предыдущая</button> : null}
                {pages}
                {current !== total ? <button onClick={() => onClick(current + 1)}>Следующая</button> : null}
            </div>
        );
    }
}