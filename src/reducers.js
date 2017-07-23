import {combineReducers} from 'redux'
import {
    REQUEST_ISSUES, RECEIVE_ISSUES,
    SELECT_REPOSITORY, SELECT_USER,
    INVALIDATE_REPOSITORY, SELECT_PER_PAGE,
    FAIL_RECEIVE_ISSUES, SELECT_USER_AND_REPOSITORY,
    SELECT_PAGE,
} from './actions'

function selectedPage(state = 1, action) {
    switch (action.type) {
        case SELECT_PAGE:
            return action.page;
        case SELECT_REPOSITORY:
        case SELECT_USER:
        case SELECT_USER_AND_REPOSITORY:
        case SELECT_PER_PAGE:
            return 1;
        default:
            return state
    }
}

function selectedRepository(state = '', action) {
    switch (action.type) {
        case SELECT_REPOSITORY:
        case SELECT_USER_AND_REPOSITORY:
            return action.repository;
        default:
            return state
    }
}
function selectedUser(state = '', action) {
    switch (action.type) {
        case SELECT_USER:
        case SELECT_USER_AND_REPOSITORY:
            return action.user;
        default:
            return state
    }
}
function selectedPerPage(state = 10, action) {
    switch (action.type) {
        case SELECT_PER_PAGE:
            return action.perPage;
        default:
            return state
    }
}

function entities(state = {
    issues: {},
    users: {}
}, action) {
    switch (action.type) {
        case RECEIVE_ISSUES:
            let issues = {};
            let users = {};
            action.issues.forEach(issue => {
                const userId = issue.user.id;
                users[userId] = {
                    ...issue.user,
                    lastUpdated: action.receivedAt
                };
                delete issue.user;
                issues[issue.id] = {
                    ...issue,
                    userId,
                    lastUpdated: action.receivedAt
                };
            });
            return Object.assign({}, state, {
                issues: Object.assign({}, state.issues, issues),
                users: Object.assign({}, state.users, users)
            });
        default:
            return state
    }
}


function issues(state = {
    isFetching: false,
    didInvalidate: false,
    items: [],
}, action) {
    switch (action.type) {
        case INVALIDATE_REPOSITORY:
            return Object.assign({}, state, {
                didInvalidate: true,
                errorMessage: null,
                total: null,
                lastUpdated: null
            });
        case REQUEST_ISSUES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false,
                errorMessage: null
            });
        case FAIL_RECEIVE_ISSUES:
            return Object.assign({}, state, {
                isFetching: false,
                errorMessage: !action.response ? 'Нет соединения с интернетом!' : action.response.data && action.response.data.message ? action.response.data.message : 'Server error!'
            });
        case RECEIVE_ISSUES:
            return Object.assign({}, state, {
                total: action.total,
                isFetching: false,
                didInvalidate: false,
                items: action.issues.map(issue => issue.id),
                lastUpdated: state.lastUpdated ? state.lastUpdated : action.receivedAt
            });
        default:
            return state
    }
}

function issuesByRepository(state = {}, action) {
    switch (action.type) {
        case INVALIDATE_REPOSITORY:
        case RECEIVE_ISSUES:
        case REQUEST_ISSUES:
        case FAIL_RECEIVE_ISSUES:
            return Object.assign({}, state, {
                [action.issuePath]: issues(state[action.issuePath], action)
            });
        default:
            return state
    }
}

const rootReducer = combineReducers({
    issuesByRepository,
    selectedRepository,
    selectedPerPage,
    selectedUser,
    selectedPage,
    entities
});

export default rootReducer