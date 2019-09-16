import React from 'react';
import ReactDOM from 'react-dom';
import App from './container/App';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter} from 'react-router-dom';

//redux
import { Provider } from "react-redux";
import configureStore from "./store";

//login 
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/index";

import { PersistGate } from 'redux-persist/integration/react';

const { store, persistor } = configureStore();


// Check for token to keep user logged in
if (sessionStorage.jwtToken) {
    // Set auth token header auth
    const token = sessionStorage.jwtToken;
    setAuthToken(token);
    // Decode token and get user info and exp
    const decoded = jwt_decode(token);
    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));
    // Check for expired token
    const currentTime = Date.now() / 1000; // to get in milliseconds
    if (decoded.exp < currentTime) {
      // Logout user
    store.dispatch(logoutUser());
      // Redirect to login
    window.location.href = "./login";
    }
}

ReactDOM.render(
    <BrowserRouter>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <App />
            </PersistGate>
        </Provider>
    </BrowserRouter>,
document.getElementById('root'));

serviceWorker.unregister();
