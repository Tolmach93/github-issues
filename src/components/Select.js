import React, {Component} from 'react'
import '../sass/Select.sass'

export default class Select extends Component {
    render() {
        const {value, onChange, options} = this.props;
        return (
            <div className="select">
                <select className="select__input" onChange={e => onChange(+e.target.value)}
                        defaultValue={value}>
                    {options.map(option =>
                        <option value={option} key={option}>
                            {option}
                        </option>)
                    }
                </select>
            </div>
        )
    }
}