import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { registerUser, translateTo } from '../actions/index';
import classnames from 'classnames';

import translateJson from "../utils/translate.json";

class Register extends Component {
    constructor(props) {        
        super(props);
        this.state = {
            username: "",
            password: "",
            password2: "",
            firstName: "",
            lastName: "",
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

        const newUser = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email
        };
    
    this.props.registerUser(newUser, this.props.history); 
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
        return (
            <form noValidate onSubmit={this.onSubmit} className="registerform">
                <div className="logo"><Link to="/">{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link></div>
                <div><input onChange={this.onChange} value={this.state.username} error={errors.username} className={classnames("", {invalid: errors.username}) + "logininput"} placeholder={lang === "en" ? "Username" : "아이디"} id="username" type="text" required/></div>
                <span className="red-text">{lang === "en" ? errors.username : translateJson[errors.username]}</span>
                <div><input onChange={this.onChange} value={this.state.password} error={errors.password} className={classnames("", {invalid: errors.password}) + "logininput"} placeholder={lang === "en" ? "Enter Password" : "비밀번호"} id="password" type="password" required/></div>
                <span className="red-text">{lang === "en" ? errors.password : translateJson[errors.password]}</span>
                <div><input onChange={this.onChange} value={this.state.password2} error={errors.password2} className={classnames("", {invalid: errors.password2}) + "logininput"} placeholder={lang === "en" ? "Re-enter Password" : "비밀번호 재입력"} id="password2" type="password" required/></div>
                <span className="red-text">{lang === "en" ? errors.password2 : translateJson[errors.password2]}</span>
                <hr/>
                <div><input onChange={this.onChange} value={this.state.firstName} error={errors.firstName} className={classnames("", {invalid: errors.firstName}) + "logininput"} placeholder={lang === "en" ? "First Name" : "이름"} id="firstName" type="text" required/></div>
                <span className="red-text">{lang === "en" ? errors.firstName : translateJson[errors.firstName]}</span>
                <div><input onChange={this.onChange} value={this.state.lastName} error={errors.lastName} className={classnames("", {invalid: errors.lastName}) + "logininput"} placeholder={lang === "en" ? "Last Name" : "성"} id="lastName" type="text" required/></div>
                <span className="red-text">{lang === "en" ? errors.lastName : translateJson[errors.lastName]}</span>
                <div><input onChange={this.onChange} value={this.state.email} error={errors.email} className={classnames("", {invalid: errors.email}) + "logininput"} placeholder={lang === "en" ? "Email Address" : "이메일 주소"} id="email" type="email" required/></div>
                <span className="red-text">{lang === "en" ? errors.email : translateJson[errors.email]}</span>
                <hr/>
                <button className="btn-customize btn-customize-full" type="submit">{lang === "en" ? "REGISTER" : "회원가입"}</button>
                <Link to="/login" className="login">{lang === "en" ? "login" : "로그인"}</Link>                
                <div className="translate"><span onClick={this.translateToEn}>en</span> | <span onClick={this.translateToKo}>ko</span></div>
            </form>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    translateTo: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        registerUser: (newUser, history) => {
            dispatch(registerUser(newUser, history));
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
)(Register);
