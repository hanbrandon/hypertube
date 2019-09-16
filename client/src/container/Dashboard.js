import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updateUser, uploadImage } from "../actions/index";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            username: "",
            password: "",
            password2: "",
            firstName: "",
            lastName: "",
            email: "",
            profileImage: "",
            errors: {}
        };
    }
    
    componentDidMount() {
        const { user } = this.props.auth;
        let userProfile = user.profileImage ? user.profileImage : "http://localhost:3000/user/default.png";
        this.setState({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            profileImage: userProfile
        })
    }

    onChange = e => {
        this.setState({ [e.target.id]: e.target.value });
    };

    uploadImage = e => {
        let reader = new FileReader();
        if (e.target.files[0]) {
            let file = e.target.files[0];
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const fileObj = {
                    username: this.state.username,
                    file: reader.result
                }
                this.props.uploadImage(fileObj);
            }
        }
    }

    onDelete = e => {
        const fileObj = {
            username: this.state.username,
            file: ""
        }
        this.props.uploadImage(fileObj);
    }

    onSubmit = e => {
        e.preventDefault();

        const newData = {
            username: this.state.username,
            password: this.state.password,
            password2: this.state.password2,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email
        };

        this.props.updateUser(newData, this.props.history); 
    };

    render() {
        const lang = this.props.translate.lang;
        return (
            <form noValidate onSubmit={this.onSubmit} className="dashboard">
                <input type="file" ref={(ref) => this.myInput = ref} style={{ display: 'none' }} onChange={e => this.uploadImage(e)} id="profileImage" />
                <div className="profileImg" onClick={ e => this.myInput.click() }><img className="profileImg-user" alt="profile img" src={this.props.auth.user.profileImage}></img></div>
                <div className="remove" onClick={e => this.onDelete()}><span>{lang === "en" ? "Remove Image" : "이미지 삭제"}</span></div>
                <div><input placeholder={lang === "en" ? "Username": "아이디"} value={this.state.username} id="username" className="logininput" readOnly/></div>
                <div><input placeholder={lang === "en" ? "New Password" : "새 비밀번호"} onChange={this.onChange} value={this.state.password} id="password" className="logininput" type="password" autoComplete="new-password"/></div>
                <div><input placeholder={lang === "en" ? "Verify Password"  : "비밀번호 재입력"} onChange={this.onChange} value={this.state.password2} id="password2" className="logininput" type="password"/></div>
                <hr/>
                <div><input placeholder={lang === "en" ? "First Name" : "이름"} onChange={this.onChange} value={this.state.firstName} id="firstName" className="logininput" required/></div>
                <div><input placeholder={lang === "en" ? "Last Name": "성"} onChange={this.onChange} value={this.state.lastName} id="lastName" className="logininput" required/></div>
                <div><input placeholder={lang === "en" ? "Email Address" : "이메일 주소"} onChange={this.onChange} value={this.state.email} id="email" className="logininput" type="email" required/></div>
                <hr/>
                <div><button className="btn-customize btn-customize-full" type="submit">{lang === "en" ? "UPDATE" : "업데이트"}</button></div>
            </form>
        );
    }
}

Dashboard.propTypes = {
    updateUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        updateUser: (newData, history) => {
            dispatch(updateUser(newData, history));
        },
        uploadImage: (newImage) => {
            dispatch(uploadImage(newImage));
        }
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    translate: state.translate,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);