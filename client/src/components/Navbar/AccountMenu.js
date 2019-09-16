import React, { Component } from "react";
import onClickOutside from 'react-onclickoutside';
import { connect } from "react-redux";
import { Link } from 'react-router-dom';
import { translateTo } from '../../actions/index';
import PropTypes from 'prop-types';

import LogoutButton from './LogoutButton';

class AccountMenu extends Component {
	constructor(props) {
		super(props);
        this.state = {
			accountMenu: false
		}
		this.accountMenuExpand = this.accountMenuExpand.bind(this);
		this.accountMenuClose = this.accountMenuClose.bind(this);

	}

	accountMenuExpand = () => {
		if (this.state.accountMenu) {
			this.setState({
				accountMenu: false
			})
		} else {
			this.setState({
				accountMenu: true
			})
		}
	}

	handleClickOutside = () => {
		if (this.state.accountMenu) {
			this.setState({
				accountMenu: false
			})
		}
	}

	accountMenuClose = () => {
		if (this.state.accountMenu) {
			this.setState({
				accountMenu: false
			})
		}
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
		const lang = this.props.translate.lang;
		let profileImage = this.props.auth.user.profileImage ? this.props.auth.user.profileImage : "http://localhost:3000/user/default.png"
		return (
			<div>
				<img className="profileImg" onClick={this.accountMenuExpand} src={profileImage} alt="profileImg"/>
				<div className={this.state.accountMenu ? "accountMenu-open" : "accountMenu"}>
					<div className="tri2"/>
					<div className="tri"/>
					<Link to="/dashboard" onClick={this.accountMenuClose} className="actMenu">{lang === "en" ? "Dashboard" : "대시보드"}</Link>
					<div className="translate"><span onClick={this.translateToEn}>en</span> | <span onClick={this.translateToKo}>ko</span></div>
					<LogoutButton></LogoutButton>
				</div>
			</div>
		)
	}	
}

AccountMenu.propTypes = {
	auth: PropTypes.object.isRequired,
    translateTo: PropTypes.func.isRequired
}

const mapDispatchToProps = dispatch => {
    return {
        translateTo: (lang) => {
            dispatch(translateTo(lang));
        }
    }
}

const mapStateToProps = state => ({
	auth: state.auth,
	translate: state.translate
})

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(onClickOutside(AccountMenu))