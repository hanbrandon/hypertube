import * as types from '../actions/ActionTypes';

const isEmpty = require("is-empty");

const initialState = {
    isAuthenticated: false,
    user: {},
    loading: false
};

export default function(state = initialState, action) {
    switch (action.type) {
        case types.SET_CURRENT_USER:
            return {
                ...state,
                isAuthenticated: !isEmpty(action.payload),
                user: {
                    ...state.user,
                    email: action.payload.email,
                    exp: action.payload.exp,
                    firstName: action.payload.firstName,
                    iat: action.payload.iat,
                    id: action.payload.id,
                    lastName: action.payload.lastName,
                    username: action.payload.username,
                    profileImage: (action.payload.profileImage ? action.payload.profileImage : 
                                    (isEmpty(action.payload) ? undefined :
                                    (state.user.profileImage ? state.user.profileImage : "http://localhost:3000/user/default.png"))),
                    watchedImdb: action.payload.watchedImdb
                }
            };
        case types.USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case types.UPLOAD_PROFILE:
            return {
                ...state,
                user: {
                    ...state.user,
                    profileImage: action.payload
                }
            }
        case types.WATCHED_VIDEO:
            return {
                ...state,
                user: {
                    ...state.user,
                    watchedImdb: action.payload
                }
            }
        default:
            return state;
    }
};