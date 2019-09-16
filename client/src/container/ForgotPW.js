import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPassword, translateTo } from "../actions/index";
import classnames from "classnames";

class ForgotPW extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
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
        this.setState({ [e.target.id]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();
        const userData = {
            email: this.state.email
        };

        this.props.resetPassword(userData, this.props.history);
    };

    translateToEn = e => {
        e.preventDefault();
        console.log("en");
        this.props.translateTo("en");
    }

    translateToKo = e => {
        e.preventDefault();
        console.log("ko");
        this.props.translateTo("ko");
    }

    render() {
        const { errors } = this.state;
        const lang = this.props.translate.lang;

        return (
            <div className="loginform">
                <form onSubmit={this.onSubmit}>
                    <div className="logo"><Link to="/">{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link></div>
                    <div><input onChange={this.onChange} value={this.state.email} error={errors.email} className={classnames("", { invalid: errors.email || errors.emailnotfound }) + "logininput"} placeholder={lang === "en" ? "Email Address" : "이메일 주소"} id="email" type="text" required/></div>
                    <span className="red-text"> {errors.email} {errors.emailnotfound} </span>
                    <hr/>
                    <button className="btn-customize btn-customize-full" type="submit">{lang === "en" ? "RESET PASSWORD" : "비밀번호 찾기"}</button>
                </form>
                <hr className="hr-none"/>
                <Link to="/login" className="forgotPw">{lang === "en" ? "back to login" : "로그인 페이지로 이동"}</Link>
                <Link to="/register" className="register">{lang === "en" ? "register" : "회원가입"}</Link>
                <div className="translate"><span onClick={this.translateToEn}>en</span> | <span onClick={this.translateToKo}>ko</span></div>
            </div>
        );
    }
}

ForgotPW.propTypes = {
    resetPassword: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    translateTo: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        resetPassword: (userData, history) => {
            dispatch(resetPassword(userData, history));
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
)(ForgotPW);