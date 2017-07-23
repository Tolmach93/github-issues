/**
 * Created by tolmach on 22.07.17.
 */

export const REQUEST_ISSUES = 'REQUEST_ISSUES';
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES';
export const FAIL_RECEIVE_ISSUES = 'FAIL_RECEIVE_ISSUES';
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

