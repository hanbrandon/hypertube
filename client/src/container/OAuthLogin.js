import React, { Component } from 'react';
import { loginOAuthUser } from '../actions/index';
import { connect } from "react-redux";
import PropTypes from "prop-types";

class OAuthLogin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: ""
        }
    }

    componentDidMount(){
        const { token } = this.props.match.params;
        this.props.loginOAuthUser(token, this.props.history);
    }
    
    render() {
        return (
            <div>Logging in...</div>
        )
    }
}

OAuthLogin.propTypes = {
    loginOAuthUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        loginOAuthUser: (userData, history) => {
            dispatch(loginOAuthUser(userData, history));
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OAuthLogin);