import {combineReducers} from 'redux'
import {
    REQUEST_ISSUES, RECEIVE_ISSUES,
    SELECT_REPOSITORY, SELECT_USER,
    INVALIDATE_REPOSITORY, SELECT_PER_PAGE
} from './actions'

function selectedRepository(state = '', action) {
    switch (action.type) {
        case SELECT_REPOSITORY:
            return action.repository;
        default:
            return state
    }
}
function selectedUser(state = '', action) {
    switch (action.type) {
        case SELECT_USER:
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
    fetchedPageCount: 0,
    items: []
}, action) {
    switch (action.type) {
        case INVALIDATE_REPOSITORY:
            return Object.assign({}, state, {
                didInvalidate: true,
                fetchedPageCount: 0,
            });
        case REQUEST_ISSUES:
            return Object.assign({}, state, {
                isFetching: true,
                didInvalidate: false
            });
        case RECEIVE_ISSUES:
            return Object.assign({}, state, {
                isFetching: false,
                didInvalidate: false,
                fetchedPageCount: state.fetchedPageCount + 1,
                items: state.items.concat(action.issues.map(issue => issue.id)),
                lastUpdated: action.receivedAt
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
            return Object.assign({}, state, {
                [action.repository]: issues(state[action.repository], action)
            });
        case SELECT_PER_PAGE:
            let keys = Object.keys(state);
            keys = keys.filter(key => state[key].fetchedPageCount);
            return Object.assign({}, state, ...keys.map(key => {
                const fetchedPageCount = parseInt(state[key].items.length / action.perPage);
                const items = state[key].items.slice(0, action.perPage * fetchedPageCount);
                return Object.assign({}, state[key], {
                    fetchedPageCount,
                    items
                });
            }));
        default:
            return state
    }
}

const rootReducer = combineReducers({
    issuesByRepository,
    selectedRepository,
    selectedPerPage,
    selectedUser,
    entities
});

export default rootReducer