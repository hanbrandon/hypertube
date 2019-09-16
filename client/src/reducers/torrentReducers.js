import * as types from "../actions/ActionTypes";

const initialState = {
    detail: ""
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.BROWSE:
            return {
                ...state,
                detail: action.payload
            }
        case types.STREAM:
            return {
                ...state,
                detail: {
                    ...state.detail,
                    videoPath: action.payload.videoPath,
                    subtitlePath: action.payload.subtitlePath
                }
            }
        default:
            return state;
    }
}