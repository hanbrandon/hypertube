import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, translateTo } from "../actions/index";
import classnames from "classnames";

import translateJson from "../utils/translate.json";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.auth.isAuthenticated) {
          this.props.history.push("/dashboard"); // push user to dashboard when they login
        }
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value })
    }

    onSubmit = e => {
        e.preventDefault();

        const userData = {
            username: this.state.username,
            password: this.state.password
        };

        this.props.loginUser(userData, this.props.history); // since we handle the redirect within our component, we don't need to pass in this.props.history as a parameter
    }

    translateToEn = e => {
        e.preventDefault();
        this.props.translateTo("en");
    }

    translateToKo = e => {
        e.preventDefault();
        this.props.translateTo("ko");
    }

    render() {
        const { errors } = this.state;
        const lang = this.props.translate.lang;
        return (
            <div className="loginform">
                <form noValidate onSubmit={this.onSubmit}>
                    <div className="logo"><Link to="/">{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link></div>
                    <div><input onChange={this.onChange} value={this.state.username} error={errors.username} className={classnames("", { invalid: errors.username || errors.usernamenotfound }) + "logininput"} placeholder={lang === "en" ? "Username" : "아이디"} id="username" type="text" required/></div>
                    <span className="red-text"> {lang === "en" ? errors.username : translateJson[errors.username]} {lang === "en" ? errors.usernamenotfound : translateJson[errors.usernamenotfound]} </span>
                    <div><input onChange={this.onChange} value={this.state.password} error={errors.password} className={classnames("", { invalid: errors.password || errors.passwordincorrect }) + "logininput"} placeholder={lang === "en" ? "Password" : "비밀번호"} id="password" type="password" required/></div>
                    <span className="red-text"> {lang === "en" ? errors.password : translateJson[errors.password]} {lang === "en" ? errors.passwordincorrect : translateJson[errors.passwordincorrect]} </span>
                    <hr/>
                    <button className="btn-customize btn-customize-full" type="submit">{lang === "en" ? "LOGIN" : "로그인"}</button>
                    <hr/>
                </form>
                <div className="oauth-btn-customizes">
                    <a href="http://localhost:5000/api/users/facebook"><button className="btn-customize btn-customize-half btn-customize-left">{lang === "en" ? "FACEBOOK" : "페이스북"}</button></a>
                    <a href="http://localhost:5000/api/users/google"><button className="btn-customize btn-customize-half btn-customize-right">{lang === "en" ? "GOOGLE" : "구글"}</button></a>
                </div>
                <div className="oauth-btn-customizes">
                <a href="http://localhost:5000/api/users/slack"><button className="btn-customize btn-customize-half btn-customize-left">{lang === "en" ? "SLACK" : "슬랙"}</button></a><a href="http://localhost:5000/api/users/42"><button className="btn-customize btn-customize-half btn-customize-right">42</button></a>
                </div>
                <hr className="hr-none"/>
                <Link to="/forgotpw" className="forgotPw">{lang === "en" ? "forgot password?" : "비밀번호 찾기"}</Link>
                <Link to="/register" className="register">{lang === "en" ? "register" : "회원가입"}</Link>                
                <div className="translate"><span onClick={this.translateToEn}>en</span> | <span onClick={this.translateToKo}>ko</span></div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    translateTo: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (userData, history) => {
            dispatch(loginUser(userData, history));
        },
        translateTo: (lang) => {
            dispatch(translateTo(lang));
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    errors: state.errors,
    translate: state.translate
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);