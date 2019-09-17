import React, { Component } from "react";
import 'react-html5video/dist/styles.css';
import { CommentInput, CommentList, DownloadTable, MovieCasts, MovieGenres, RunTime, TrackList } from '../components/Movie/MovieComponents.js';
import { queryMovie, unloadAll, queryComment, postComment, downloadMagnet, watchedVideo } from '../actions/index';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

//VideoPlayer
import { DefaultPlayer as Video } from 'react-html5video';
import 'react-html5video/dist/styles.css';

class Movie extends Component {
	constructor(props) {
		super(props);
		this.state = {
			detail: this.props.torrent.detail,
			username: "",
			comment: "",
			profileImg: "",
			videoFunction: this.videoPlayer
		}
		this.onChange = this.onChange.bind(this);
		this.onClick = this.onClick.bind(this);
		this.onWatchVideo = this.onWatchVideo.bind(this);
	}

	onChange = e => {
		this.setState({ [e.target.id]: e.target.value });
	}

	onClick = e => {
		e.preventDefault();
		
		let date = new Date().getDate(); //Current Date
		let month = new Date().getMonth() + 1; //Current Month
		let year = new Date().getFullYear(); //Current Year
		let hours = new Date().getHours(); //Current Hours
		let min = new Date().getMinutes(); //Current Minutes

		const profileImage = this.props.auth.user.profileImage ? this.props.auth.user.profileImage : "http://localhost:3000/user/default.png" 

		const commentData = {
			username: this.props.auth.user.username,
			profileImage: profileImage,
			imdb: this.props.torrent.detail.imdb_code,
			date: month + '/' + date + '/' + year + ' ' + hours + ':' + min,
			comment: this.state.comment
		}
		this.props.postComment(commentData);
		this.setState({
			comment: ""
		})
	}

	componentDidMount(){
		const movieId = this.props.match.params.id;
		const imdbId = this.props.match.params.imdb;
		this.props.queryMovie({id : movieId, imdb: imdbId});
		this.props.queryComment(imdbId);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		const movieId = nextProps.match.params.id;
		const imdbId = nextProps.match.params.imdb;
		if (this.props.match.params.id !== movieId) {
			this.props.unloadAll();
			this.props.queryMovie({id : movieId, imdb: imdbId});
			this.props.queryComment(imdbId);
		}
	}

	onWatchVideo() {
		const imdb_data = {
			videoPath: this.props.torrent.detail.videoPath,
			imdb: this.props.torrent.detail.imdb_code,
			username: this.props.auth.user.username
		}
		this.props.watchedVideo(imdb_data);
	}

	videoPlayer(detail, videoPath, subtitlePath, onWatchVideo) {
		return (
			<div onClick={e => onWatchVideo()}>
				<Video className="videoPlayer"
					controls={['PlayPause', 'Seek', 'Time', 'Volume', 'Fullscreen', 'Captions']}
					poster={detail.large_cover_image}
					onCanPlayThrough={() => {
						// Do stuff
					}}>
				{videoPath ? <source src={process.env.PUBLIC_URL + videoPath} type="video/mp4" /> : ""}
				<TrackList subList={subtitlePath} className="subtitleList"/>
				</Video>
			</div>
		)
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		if (prevProps.torrent.detail.videoPath !== this.props.videoPath) {
			this.setState({
				videoFunction: ""
			}, () => this.setState({
				videoFunction: this.videoPlayer
			}))
		}
	}

	componentWillUnmount() {
		this.props.unloadAll();
	}
	
	render() {
		if (this.props.torrent.detail) {
			const detail = this.props.torrent.detail;
			const videoPath = this.props.videoPath;
			const subtitlePath = this.props.torrent.detail.subtitlePath;
			const profileImage = this.props.auth.user.profileImage ? this.props.auth.user.profileImage : "http://localhost:3000/user/default.png" 
			const lang = this.props.translate.lang;
			return (
				<div className="movieForm">
					<div className="movieDetails">
						{this.state.videoFunction ? this.state.videoFunction(detail, videoPath, subtitlePath, this.onWatchVideo) : ""}
						<div className="movieTitle">
							<div className="movieGenres">
								<MovieGenres lang={lang} genres={detail.genres}/>
							</div>
							<h2>{detail.title_long}</h2>
							<RunTime lang={lang} runtime={detail.runtime}/>
						</div>
						<div className="detailsGrid row">
							<div className="movieSummary">
								<p>{detail.description_full}</p>
							</div>
									<MovieCasts cast={detail.cast}/>
								<table className="table table-dark">
									<thead>
										<tr>
											<th scope="col">{lang === "en" ? "Size" : "사이즈"}</th>
											<th scope="col">{lang === "en" ? "Quality" : "화질"}</th>
											<th scope="col">{lang === "en" ? "Peers" : "피어"}</th>
											<th scope="col">{lang === "en" ? "Seeds" : "시드"}</th>
											<th scope="col">{lang === "en" ? "Download" : "다운로드"}</th>
										</tr>
									</thead>
									<tbody>
										<DownloadTable lang={lang} torrents={detail.torrents} download={this.props.downloadMagnet} movieId={detail.id} imdb_id={detail.imdb_code} username={this.props.auth.user.username}/>
									</tbody>
								</table>
							<CommentInput lang={lang} img={profileImage} onChange={this.onChange} onClick={this.onClick} comment={this.state.comment}/>
							<CommentList comments={this.props.comment}/>
						</div>
					</div>
				</div>
			)
		} else {
			return (
			<div className="movieForm">
				<span>&nbsp;</span>
				<div className="loader"></div>
			</div>
			);
		}
	}
}
const mapStateToProps = (state) => {
	return {
		torrent: state.torrent,
		auth: state.auth,
		comment: state.comment,
		videoPath: state.torrent.detail.videoPath,
		translate: state.translate,
	}
};

const mapDispathToProps = dispatch => {
	return {
		queryMovie: imdb => {
			dispatch(queryMovie(imdb));
		},
		downloadMagnet: fileUrl => {
			dispatch(downloadMagnet(fileUrl));
		},
		unloadAll: () => {
			dispatch(unloadAll());
		},
		queryComment: imdb => {
			dispatch(queryComment(imdb));
		},
		postComment: commentData => {
			dispatch(postComment(commentData))
		},
		watchedVideo: imdbId => {
			dispatch(watchedVideo(imdbId))
		}
	}
}

Movie.propTypes = {
	downloadMagnet: PropTypes.func.isRequired,
	queryMovie: PropTypes.func.isRequired,
	unloadAll: PropTypes.func.isRequired,
	queryComment: PropTypes.func.isRequired,
	postComment: PropTypes.func.isRequired
}

export default connect(
	mapStateToProps,
	mapDispathToProps
)(Movie);