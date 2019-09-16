import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../../actions/index";

class LogoutButton extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
        this.onLogoutClick = this.onLogoutClick.bind(this);

    }
    onLogoutClick = e => {
        e.preventDefault();
        this.props.logoutUser();
    };

    render() {
        const lang = this.props.translate.lang;
        return (
            <div className="actMenu lastActMenu" onClick={this.onLogoutClick}>{lang === "en" ? "Logout" : "로그아웃"}</div>
        );
    }
}


LogoutButton.propTypes = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth,
    translate: state.translate
});


export default connect(mapStateToProps, { logoutUser })(LogoutButton);

