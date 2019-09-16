import * as types from "../actions/ActionTypes";

const initialState = {
    comment: ""
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.POST_COMMENT:
            const comment = state.concat(action.payload)
            return comment
        case types.QUERY_COMMENT:
            return action.comments;
        default:
            return state;
    }
}