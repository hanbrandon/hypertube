import { combineReducers } from "redux";
import authReducers from "./authReducers";
import errorReducers from "./errorReducers";
import torrentReducers from './torrentReducers';
import commentReducers from './commentReducers';
import sortByReducers from './sortByReducers';
import orderByReducers from './orderByReducers';
import searchByReducers from './searchByReducers';
import genreByReducers from './genreByReducers';
import userProfileReducers from './userProfileReducers';
import translateReducers from './translateReducers';

const reducers = combineReducers({
    auth: authReducers,
    errors: errorReducers,
    torrent: torrentReducers,
    comment: commentReducers,
    sort_by: sortByReducers,
    order_by: orderByReducers,
    search_by: searchByReducers,
    genre_by: genreByReducers,
    userProfile: userProfileReducers,
    translate: translateReducers
});

export default reducers;