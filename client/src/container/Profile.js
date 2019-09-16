import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { queryUser, unloadAll } from "../actions/index";

class Dashboard extends Component {
    
    // componentDidMount() {
    //     const { user } = this.props.auth;
    //     let userProfile = user.profileImage ? user.profileImage : "http://localhost:3000/user/default.png";
    //     this.setState({
    //         username: user.username,
    //         firstName: user.firstName,
    //         lastName: user.lastName,
    //         profileImage: userProfile
    //     })
    // }

    componentDidMount(){
        const username = this.props.match.params.username;
		this.props.queryUser({username});
	}

	
	UNSAFE_componentWillReceiveProps(nextProps) {
		const username = nextProps.match.params.username;
		if (this.props.match.params.username !== username) {
			this.props.unloadAll();
			this.props.queryUser({username});
		}
	}

	componentWillUnmount() {
		this.props.unloadAll();
	}
    render() {
        const profile = this.props.userProfile;
        return (
            <form className="profile">
                <div className="profileImg"><img className="profileImg-user" alt="profile img" src={profile.profileImage}></img></div>
                <hr/>
                <div><input value={profile.username} id="username" className="logininput" readOnly/></div>
                <hr/>
                <div><input value={profile.firstName} id="firstName" className="logininput" readOnly/></div>
                <div><input value={profile.lastName} id="lastName" className="logininput" readOnly/></div>
            </form>
        );
    }
}

Dashboard.propTypes = {
    queryUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => {
    return {
        queryUser: (username) => {
            dispatch(queryUser(username));
        },
        unloadAll: () => {
			dispatch(unloadAll());
		}
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    userProfile: state.userProfile
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Dashboard);