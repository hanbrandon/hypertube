import * as types from '../actions/ActionTypes';

const initialState = {
    search_by: "",
    page: 1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SEARCH:
            return {
                ...state,
                search_by: action.payload,
            }
        case types.RESET_PAGE:
            return {
                ...state,
                search_by: ""
            }
        default:
            return state;
    }
}