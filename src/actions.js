/**
 * Created by tolmach on 22.07.17.
 */

export const REQUEST_ISSUES = 'REQUEST_ISSUES';
export const RECEIVE_ISSUES = 'RECEIVE_ISSUES';
export const SELECT_REPOSITORY = 'SELECT_REPOSITORY';
export const SELECT_USER = 'SELECT_USER';
export const SELECT_PER_PAGE = 'SELECT_PER_PAGE';
export const INVALIDATE_REPOSITORY = 'INVALIDATE_REPOSITORY';

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

export function invalidateRepository(repository) {
    return {
        type: INVALIDATE_REPOSITORY,
        repository
    }
}

function requestIssues(repository) {
    return {
        type: REQUEST_ISSUES,
        repository
    }
}

function receiveIssues(repository, response) {
    return {
        type: RECEIVE_ISSUES,
        repository,
        issues: response.data,
        receivedAt: Date.now()
    }
}

function fetchIssues({selectedUser, issuesByRepository, selectedPerPage}, repository) {
    return dispatch => {
        dispatch(requestIssues(repository));
        const page = issuesByRepository[repository] ? issuesByRepository[repository].fetchedPageCount + 1 : 1;
        return axios.get(`https://api.github.com/repos/${selectedUser}/${repository}/issues?page=${page}&per_page=${selectedPerPage}`)
            .then(response => dispatch(receiveIssues(repository, response)))
    }
}

function shouldFetchIssues({issuesByRepository}, repository) {
    const issues = issuesByRepository[repository];
    if (!issues) {
        return true
    } else if (issues.isFetching) {
        return false
    } else {
        return issues.didInvalidate
    }
}

export function fetchIssuesIfNeeded(repository) {
    return (dispatch, getState) => {
        let state = getState();
        if (shouldFetchIssues(state, repository)) {
            return dispatch(fetchIssues(state, repository))
        }
    }
}


export function selectPerPage(perPage) {
    return (dispatch, getState) => {
        let {issuesByRepository} = getState();
        if (issuesByRepository.every(issues => !issues.isFetching)) {
            return dispatch({
                type: SELECT_PER_PAGE,
                perPage
            })
        }
    }
}