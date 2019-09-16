import * as types from '../actions/ActionTypes';

const initialState = {
    order_by: "desc",
    page: 1
}

export default function(state = initialState, action) {
    switch (action.type) {
        case types.ORDER_BY:
            return {
                ...state,
                order_by: action.payload,
            }
        case types.RESET_PAGE:
            return {
                ...state,
                order_by: "desc"
            }
        default:
            return state;
    }
}