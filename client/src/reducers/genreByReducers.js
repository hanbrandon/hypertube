import * as types from '../actions/ActionTypes';

const initialState = {
    genre_by: "",
    page: 1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.GENRE:
            return {
                ...state,
                genre_by: action.payload,
            }
        case types.RESET_PAGE:
            return {
                ...state,
                genre_by: ""
            }
        default:
            return state;
    }
}