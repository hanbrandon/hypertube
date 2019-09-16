import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { verifyReset, translateTo} from "../actions/index";
import classnames from "classnames";

import translateJson from "../utils/translate.json";

class ForgotPW extends Component {
    constructor(props) {
        super(props);
        this.state = {
            token: "",
            password: "",
            password2: "",
            errors: {}
        };
    }

    componentDidMount() {
        // If logged in and user navigates to Register page, should redirect them to dashboard
        if (this.props.auth.isAuthenticated) {
            this.props.history.push("/dashboard");
        }
        this.setState({
            token: this.props.match.params.token
        })
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
            password: this.state.password,
            password2: this.state.password2,
            token: this.state.token
        };

        this.props.verifyReset(userData, this.props.history);
    };

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
        if (errors.invalid) {
            return (
                <div>
                    <br />
                    <br />
                    <br />
                    <h1>403: INVALID_ACCESS</h1>
                </div>
            )
        } else {
            return (
                <div className="loginform">
                    <form onSubmit={this.onSubmit}>
                        <div className="logo"><Link to="/">{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link></div>
                        <div><input onChange={this.onChange} value={this.state.password} error={errors.password} className={classnames("", {invalid: errors.password}) + "logininput"} placeholder={lang === "en" ? "Enter Password" : "비밀번호 입력"} id="password" type="password" required/></div>
                        <span className="red-text">{lang === "en" ? errors.password : translateJson[errors.password]}</span>
                        <div><input onChange={this.onChange} value={this.state.password2} error={errors.password2} className={classnames("", {invalid: errors.password2}) + "logininput"} placeholder={lang === "en" ? "Re-enter Password" : "비밀번호 재입력"} id="password2" type="password" required/></div>
                        <span className="red-text">{lang === "en" ? errors.password2 : translateJson[errors.password2]}</span>
                        <hr/>
                        <button className="btn-customize btn-customize-full" type="submit">{lang === "en" ? "RESET PASSWORD" : "비밀번호 변경하기"}</button>
                    </form>
                    <hr className="hr-none"/>
                    <Link to="/register" className="register">{lang === "en" ? "register" : "회원가입"}</Link>
                    <div className="translate"><span onClick={this.translateToEn}>en</span> | <span onClick={this.translateToKo}>ko</span></div>
                </div>
            );
        }
    }
}

ForgotPW.propTypes = {
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    translateTo: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        verifyReset: (userData, history) => {
            dispatch(verifyReset(userData, history));
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