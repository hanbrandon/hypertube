import * as types from "../actions/ActionTypes"

const initialState = {
    lang: "en"
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.TRANSLATE:
            return {
                lang: action.lang
            };
        default:
            return state;
    }
}