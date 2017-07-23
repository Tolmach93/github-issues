import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchIssueIfNeeded} from '../actions'
import Loading from "../components/Loading";

class Issue extends Component {
    constructor(props) {
        super(props);

    }

    componentDidMount() {
        const {dispatch} = this.props;
        const {owner, repo, number} = this.props.match.params;
        const issuePath = `/repos/${owner}/${repo}/issues/${number}`;
        dispatch(fetchIssueIfNeeded(issuePath))
    }

    render() {
        const {owner, repo, number} = this.props.match.params;
        const issuePath = `/repos/${owner}/${repo}/issues/${number}`;
        const divStyle = {
            wordWrap: 'break-word'
        };
        return (
            <div>
                <Link to='/'>Главная</Link>
                {
                    this.props.issues[issuePath]
                        ? this.props.issues[issuePath].isFetching
                        ? <Loading/>
                        : <div>
                            <h2>{this.props.issues[issuePath].title}</h2>
                            <div style={divStyle} dangerouslySetInnerHTML={{__html: this.props.issues[issuePath].body.replace(/\n/g, "<br />")}}/>
                        </div>
                        : null
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        issues: state.entities.issues
    }
}

export default connect(mapStateToProps)(Issue)