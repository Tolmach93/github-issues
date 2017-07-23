/**
 * Created by tolmach on 20.07.17.
 */

import React, {Component} from 'react';
import '../sass/Pagination.sass'


export default class Pagination extends Component {
    render() {
        const {current, total, onClick} = this.props;
        const active = {
            background: 'rgba(0, 0, 0, 0.8)'
        };
        const pages = new Array(total).fill(0).map((item, index) => index + 1)
            .filter(item => item === 1 || (item >= current - 1 && item <= current + 1) || item === total)
            .map(page => <div style={page === current ? active : null} onClick={() => onClick(page)}
                                 key={page}>{page}</div>);
        return (
            <div className="pagination">
                {current !== 1 ? <div onClick={() => onClick(current - 1)}>Предыдущая</div> : null}
                {pages}
                {current !== total ? <div onClick={() => onClick(current + 1)}>Следующая</div> : null}
            </div>
        );
    }
}