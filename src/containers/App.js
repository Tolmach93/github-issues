import React, {Component} from 'react'
import {connect} from 'react-redux'
import {
    fetchIssuesIfNeeded,
    selectRepository,
    selectUser,
    selectUserAndRepository,
    selectPage,
    selectPerPage,
    invalidateRepository,
    fetchRepositoriesIfNeeded
} from '../actions'
import Search from '../components/Search';
import SearchItem from '../components/SearchItem'
import Loading from "../components/Loading";
import Pagination from "../components/Pagination";
import Options from "../components/Options";

const REFRESH_TIME = (10 * 60 * 1000); // 10 минут в миллисекундах

class App extends Component {
    constructor(props) {
        super(props);
        this.fetchContent = this.fetchContent.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleCheckUser = this.handleCheckUser.bind(this);
        this.changePage = this.changePage.bind(this);
        this.changePerPage = this.changePerPage.bind(this);
        this.refresh = this.refresh.bind(this);
    }


    componentWillReceiveProps(nextProps) {
        if ((nextProps.selectedRepository !== this.props.selectedRepository && nextProps.selectedRepository !== '')
            || (nextProps.selectedUser !== this.props.selectedUser && nextProps.selectedRepository !== '')
            || nextProps.selectedPage !== this.props.selectedPage
            || nextProps.didInvalidate
            || nextProps.selectedPerPage !== this.props.selectedPerPage) {
            this.fetchContent(nextProps);
        }
    }

    refresh(nextProps) {
        const {dispatch, selectedRepository, selectedUser, selectedPerPage, selectedPage} = nextProps ? nextProps.selectedPage ? nextProps : this.props : this.props;
        dispatch(invalidateRepository([selectedUser, selectedRepository, selectedPerPage, selectedPage].join('/')))
    }

    changePage(page) {
        this.props.dispatch(selectPage(page));
    }

    changePerPage(perPage) {
        this.props.dispatch(selectPerPage(perPage));
    }

    handleClick({user, repository}) {
        const {dispatch, selectedRepository, selectedUser} = this.props;
        if (user !== selectedUser && repository !== selectedRepository) {
            dispatch(selectUserAndRepository(user, repository));
        } else if (user !== selectedUser) {
            dispatch(selectUser(user));
        } else if (repository !== selectedRepository) {
            dispatch(selectRepository(repository));
        }
    }

    handleCheckUser(user) {
        const {dispatch, selectedUser} = this.props;
        if (user !== selectedUser) {
            dispatch(selectUserAndRepository(user, ''));
            dispatch(fetchRepositoriesIfNeeded(user));
        }
    }

    fetchContent({dispatch, selectedRepository, selectedUser, selectedPerPage, selectedPage, lastUpdated}) {
        if (lastUpdated ? lastUpdated + REFRESH_TIME < Date.now() : false) {
            this.refresh({dispatch, selectedRepository, selectedUser, selectedPerPage, selectedPage});
        } else {
            dispatch(fetchIssuesIfNeeded([selectedUser, selectedRepository, selectedPerPage, selectedPage].join('/')))

        }
    }

    render() {
        const {selectedUser, selectedRepository, issues, isFetching, errorMessage, users, total, selectedPage, selectedPerPage, repositories} = this.props;
        let content;
        if (isFetching) {
            content = <Loading/>;
        } else {
            content = issues.map(issue => <SearchItem key={issue.id} author={users[issue.userId]} issue={issue}/>);
        }
        const pagination = total > 1 ?
            <Pagination onClick={this.changePage} current={selectedPage} total={total}/> : null;
        return (
            <div>
                <Search value={`${selectedUser} ${selectedRepository}`.trim()}
                        help={repositories}
                        onCheckUser={this.handleCheckUser}
                        onClick={this.handleClick}/>
                { selectedUser.length && selectedRepository.length && !isFetching?
                    <Options onChange={this.changePerPage} value={selectedPerPage}
                             options={[10, 20, 30, 50, 100]}/> : null}
                { selectedUser.length && selectedRepository.length && !isFetching ? <div onClick={this.refresh}>Обновить</div> : null}
                {pagination}
                {content}
                {errorMessage ? <div>{errorMessage}</div> : null}
                {pagination}
            </div>
        )
    }
}

function mapStateToProps(state) {
    const {selectedUser, selectedRepository, entities, usersRepositories, issuesByRepository, selectedPerPage, selectedPage} = state;

    const issuePath = `${selectedUser}/${selectedRepository}/${selectedPerPage}/${selectedPage}`;

    const issues = issuesByRepository[issuePath]
        ? issuesByRepository[issuePath].items.map(idIssue => entities.issues[idIssue])
        : [];

    const repositories = usersRepositories[selectedUser]
        ? usersRepositories[selectedUser].items.map(item => selectedUser + ' ' + item)
        : [];

    let users = {};
    issues.forEach(issue => users[issue.userId] = entities.users[issue.userId]);

    const {isFetching, lastUpdated, fetchedPageCount, errorMessage, total, didInvalidate} = issuesByRepository[issuePath] || {
        isFetching: false,
        fetchedPageCount: 0,
        errorMessage: null,
        total: null
    };
    return {
        repositories,
        selectedRepository,
        selectedUser,
        selectedPerPage,
        selectedPage,
        issues,
        users,
        total,
        isFetching,
        errorMessage,
        fetchedPageCount,
        didInvalidate,
        lastUpdated
    }
}

export default connect(mapStateToProps)(App)