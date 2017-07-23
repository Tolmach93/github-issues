/**
 * Created by tolmach on 22.07.17.
 */

export const REQUEST_ISSUES = 'REQUEST_ISSUES';
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES';
export const FAIL_RECEIVE_ISSUES = 'FAIL_RECEIVE_ISSUES';
export const REQUEST_ISSUE = 'REQUEST_ISSUE';
export const RECEIVE_ISSUE = 'RECEIVE_ISSUE';
export const FAIL_RECEIVE_ISSUE = 'FAIL_RECEIVE_ISSUE';
export const REQUEST_REPOSITORIES = 'REQUEST_REPOSITORIES';
export const RECEIVE_REPOSITORIES = 'RECEIVE_REPOSITORIES';
export const FAIL_RECEIVE_REPOSITORIES = 'FAIL_RECEIVE_REPOSITORIES';
export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const SELECT_USER = 'SELECT_USER';
export const SELECT_USER_AND_REPOSITORY = 'SELECT_USER_AND_REPOSITORY';
export const SELECT_PER_PAGE = 'SELECT_PER_PAGE';
export const INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';
export const SELECT_PAGE = 'SELECT_PAGE';

export function selectPage(page) {
    return {
        type: SELECT_PAGE,
        page
    }
}

export function selectPerPage(perPage) {
    return {
        type: SELECT_PER_PAGE,
        perPage
    }
}
export function selectUserAndRepository(user, repository) {
    return {
        type: SELECT_USER_AND_REPOSITORY,
        user,
        repository
    }
}

export function selectRepository(repository) {
    return {
        type: SELECT_REPOSITORY,
        repository
    }
}

export function selectUser(user) {
    return {
        type: SELECT_USER,
        user
    }
}

export function invalidateRepository(issuePath) {
    return {
        type: INVALIDATE_REPOSITORY,
        issuePath
    }
}

function requestIssues(issuePath) {
    return {
        type: REQUEST_ISSUES,
        issuePath
    }
}

function failReceiveIssues(issuePath, response) {
    return {
        type: FAIL_RECEIVE_ISSUES,
        issuePath,
        response,
    }
}

function receiveIssues(issuePath, response, total) {
    return {
        type: RECEIVE_ISSUES,
        issuePath,
        total,
        issues: response.data,
        receivedAt: Date.now()
    }
}

function fetchIssues({selectedPerPage, selectedRepository, selectedUser, selectedPage}, issuePath) {
    return dispatch => {
        dispatch(requestIssues(issuePath));
        return axios.get(`https://api.github.com/repos/${selectedUser}/${selectedRepository}/issues?page=${selectedPage}&per_page=${selectedPerPage}`)
            .then(response => {
                if (response.headers && response.data && response.data.map) {
                    let lastPage;
                    if (response.headers.link && ~response.headers.link.indexOf('rel="last"')) {
                        let lastPageLink = response.headers.link.split(',')[1];
                        lastPage = +lastPageLink.slice(lastPageLink.indexOf('=') + 1, lastPageLink.indexOf('&'));
                    } else {
                        lastPage = selectedPage;
                    }
                    dispatch(receiveIssues(issuePath, response, lastPage));

                } else {
                    dispatch(failReceiveIssues(issuePath, response));
                }
            })
            .catch(err => dispatch(failReceiveIssues(issuePath, err.response)))
    }
}

function shouldFetchIssues({issuesByRepository}, issuePath) {
    const issues = issuesByRepository[issuePath];
    if (!issues) {
        return true
    } else if (issues.isFetching) {
        return false
    } else {
        return issues.didInvalidate
    }
}

export function fetchIssuesIfNeeded(issuePath) {
    return (dispatch, getState) => {
        let state = getState();
        if (shouldFetchIssues(state, issuePath)) {
            return dispatch(fetchIssues(state, issuePath))
        }
    }
}


function requestRepositories(user) {
    return {
        type: REQUEST_REPOSITORIES,
        user
    }
}

function failReceiveRepositories(user) {
    return {
        type: FAIL_RECEIVE_REPOSITORIES,
        user,
    }
}

function receiveRepositories(user, response) {
    return {
        type: RECEIVE_REPOSITORIES,
        user,
        repositories: response.data
    }
}

function fetchRepositories(user) {
    return dispatch => {
        dispatch(requestRepositories(user));
        return axios.get(`https://api.github.com/users/${user}/repos`)
            .then(response => {
                if (response.data && response.data.map) {
                    dispatch(receiveRepositories(user, response));
                } else {
                    dispatch(failReceiveRepositories(user));
                }
            })
            .catch(err => dispatch(failReceiveRepositories(user)))
    }
}
export function fetchRepositoriesIfNeeded(user) {
    return (dispatch, getState) => {
        let state = getState();
        if (!state.usersRepositories[user] || !state.usersRepositories[user].isFetching) {
            return dispatch(fetchRepositories(user))
        }
    }
}

export function fetchIssueIfNeeded(issuePath) {
    return (dispatch, getState) => {
        let state = getState();
        if (!state.entities.issues[issuePath]) {
            return dispatch(fetchIssue(issuePath))
        }
    }
}


function fetchIssue(issuePath) {
    return dispatch => {
        dispatch(requestIssue(issuePath));
        return axios.get(`https://api.github.com${issuePath}`)
            .then(response => {
                if (response.data && !response.data.message) {
                    dispatch(receiveIssue(issuePath, response));
                } else {
                    dispatch(failReceiveIssue(issuePath, response));
                }
            })
            .catch(err => dispatch(failReceiveIssue(issuePath, err.response)))
    }
}

function requestIssue(issuePath) {
    return {
        type: REQUEST_ISSUE,
        issuePath
    }
}

function failReceiveIssue(issuePath, response) {
    return {
        type: FAIL_RECEIVE_ISSUE,
        issuePath,
        response
    }
}

function receiveIssue(issuePath, response) {
    return {
        type: RECEIVE_ISSUE,
        issuePath,
        issue: response.data
    }
}