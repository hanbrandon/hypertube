import * as types from '../actions/ActionTypes';

const initialState = {
    sort_by: "rating",
    page: 1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SORT_BY:
            return {
                ...state,
                sort_by: action.payload,
            }
        case types.RESET_PAGE:
            return {
                ...state,
                sort_by: "rating"
            }
        default:
            return state;
    }
}