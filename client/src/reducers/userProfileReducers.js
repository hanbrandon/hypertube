import * as types from "../actions/ActionTypes";

const initialState = {
    userData: ""
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.GET_USER:
            return action.userData;
        default:
            return state;
    }
}