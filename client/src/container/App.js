import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Route, Switch, withRouter } from "react-router-dom";

import Navbar from "./Navbar";
import Home from "./Home";
import Movie from "./Movie";
import Register from "./Register";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";
import Dashboard from "./Dashboard";
import OAuthLogin from "./OAuthLogin";
import ForgotPW from "./ForgotPW";
import ResetPW from "./ResetPW";
import Profile from "./Profile";


const NavbarHide = (props) => {
  const { location } = props;
  if (location.pathname.includes("/login") || location.pathname.includes("/register") || location.pathname.includes("/forgotpw")) {
    return null;
  }

  return (
    <Navbar />
  )
}

const NavbarVisibility = withRouter(NavbarHide);

class App extends React.Component {
  render() {
    return (
        <Router>
          <div className="App">
            <NavbarVisibility />
            <Switch>
              <PrivateRoute exact path="/" component={Home} />
            </Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/forgotpw" component={ForgotPW} />
            <Route path="/forgotpw/verify/:token" component={ResetPW} />
            <Route path="/login/:token" component={OAuthLogin} />
            <Switch>
              <PrivateRoute path="/movie/:id/:imdb" component={Movie} />
            </Switch>          
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
            </Switch>
            <Switch>
              <PrivateRoute exact path="/profile/:username" component={Profile} />
            </Switch>
          </div>
        </Router>
    );
  }
}

export default App;
