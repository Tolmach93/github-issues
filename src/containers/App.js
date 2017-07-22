import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchIssuesIfNeeded, selectRepository, selectUser} from '../actions'
import Search from '../components/Search';
import Item from '../components/Item';

class App extends Component {
    constructor(props) {
        super(props);
        this.fetchContent = this.fetchContent.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if (nextProps.selectedRepository !== this.props.selectedRepository) {
            this.fetchContent(nextProps);
        }
    }

    handleClick(data) {
        let [user, repository] = data.trim().split(' ');
        const {dispatch} = this.props;
        dispatch(selectUser(user));
        dispatch(selectRepository(repository));
    }

    fetchContent({dispatch, selectedRepository}) {
        dispatch(fetchIssuesIfNeeded(selectedRepository))
    }

    render() {
        const {selectedUser, selectedRepository, issues} = this.props;
        return (
            <div>
                <Search value={`${selectedUser} ${selectedRepository}`.trim()}
                        onClick={this.handleClick}/>
                {
                    issues.map(issue => <Item key={issue.id} item={issue}/>)
                }
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {selectedUser, selectedRepository, entities, issuesByRepository} = state;

    const issues = issuesByRepository[selectedRepository]
        ? issuesByRepository[selectedRepository].items.map(idIssue => entities.issues[idIssue])
        : [];

    const {isFetching, lastUpdated, fetchedPageCount} = issuesByRepository[selectedRepository] || {
        isFetching: true,
        fetchedPageCount: 0
    };

    return {
        selectedRepository,
        selectedUser,
        issues,
        isFetching,
        fetchedPageCount,
        lastUpdated
    }
}

export default connect(mapStateToProps)(App)