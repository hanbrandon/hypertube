import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser, sortBy, orderBy, genreBy, searchBy, resetPage, translateTo } from "../actions/index";

import AccountMenu from '../components/Navbar/AccountMenu';
import DownloadBar from '../components/Navbar/DownloadBar';
import SideBar from '../components/Navbar/SideBar';

// ping
import { downloadPercentage } from '../utils/socketio';


class Navbar extends Component {
	constructor(props) {
		super(props);
		this.state = {
			sideBar: false,
			downloadBar: false,
			downloadRate: [],
			search: ""
		}
		this.menuExpand = this.menuExpand.bind(this);
		this.downloadExpand = this.downloadExpand.bind(this);
		this.onLogoutClick = this.onLogoutClick.bind(this);
		downloadPercentage((err, bytesDone) => {
			console.log(bytesDone);
			let downloadObj = {
				title: bytesDone.fileName,
				rate: bytesDone.downloaded,
				movieId: bytesDone.movieId,
				imdbId: bytesDone.imdbId
			}
			let downloadList = this.state.downloadRate;
			let duplicate = false;
			for(let i = 0; i < downloadList.length; i++) {
				if (downloadList[i].title === bytesDone.fileName) {
					downloadList[i] = downloadObj;
					duplicate = true;
					break ;
				}
			}
			if (duplicate) {
				this.setState({
					downloadRate : downloadList
				});
			} else {
				let mergedList = downloadList.concat([downloadObj]);
				this.setState({
					downloadRate: mergedList
				})
			}
			// console.log(this.state.downloadRate);
		})
	}
	
	menuExpand() {
		if (this.state.sideBar) {
			this.setState({
				sideBar: false
			})
		} else {
			this.setState({
				sideBar: true
			})
		}
	}
	
	downloadExpand() {
		if (this.state.downloadBar) {
			this.setState({
				downloadBar: false
			})
		} else {
			this.setState({
				downloadBar: true
			})
		}
	}

	onLogoutClick = e => {
		this.props.logoutUser();
	};

	onChange = e => {
		this.setState({
			[e.target.id]: e.target.value
		})
	}

	onPageReset = () => {
		this.setState({
			search: ""
		})
		this.props.resetPage()
	}

	render() {
		const lang = this.props.translate.lang;
		console.log(lang)
		return (
			<div>
				<div className="mobileBar">
					<Link className="logoMobile" to="/" onClick={e => this.onPageReset()}>{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link>
				</div>
				<div className="navBar">				
					<SideBar isOpen={this.state.sideBar} expand={this.menuExpand} sortBy={this.props.sortBy} orderBy={this.props.orderBy} genreBy={this.props.genreBy} lang={lang}/>
					<div className="menu-icon" onClick={this.menuExpand}><i className="fas fa-bars"></i></div>
					<Link className="logo" to="/" onClick={e => this.onPageReset()}>{lang === "en" ? "Hypertube" : "하이퍼튜브"}</Link>
					<div className="searchbar">
						<input id="search" className="searchinput" onChange={this.onChange} value={this.state.search}></input><button className="searchbutton" onClick={e => this.props.searchBy(this.state.search)}><i className="fas fa-search"></i></button>
					</div>
					<div onClick={this.downloadExpand} className="downloadIcon"><i className="fas fa-arrow-alt-circle-down"/></div>
					<DownloadBar lang={lang} isOpen={this.state.downloadBar} expand={this.downloadExpand} list={this.state.downloadRate}/>
					{
						sessionStorage.jwtToken ?
						<div>
							<AccountMenu/></div> :
						<Link className="userIcon" to="/login"><i className="fas fa-user-circle"></i></Link>
					}
				</div>
			</div>
		);
	}
};

Navbar.propTypes = {
	translateTo: PropTypes.func.isRequired,
    logoutUser: PropTypes.func.isRequired,
	auth: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => { 
	return {
		logoutUser: () => {
			dispatch(logoutUser());
		},
		sortBy: type => {
			dispatch(sortBy(type));
		},
		orderBy: order => {
			dispatch(orderBy(order));
		},
		genreBy: genre => {
			dispatch(genreBy(genre));
		},
		searchBy: search => {
			dispatch(searchBy(search));
		},
		resetPage: () => {
			dispatch(resetPage());
		},
        translateTo: (lang) => {
            dispatch(translateTo(lang));
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
)(Navbar);

