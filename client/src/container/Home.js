import React, { Component } from "react";
import MovieList from '../components/MovieList';
import { getWatchedMovies } from "../actions/index";
import { connect } from "react-redux";

class Home extends Component {
	constructor(props) {
		super(props)
		this.state = {
			page: 1,
			movies: [],
			loading: true
		}

		this.onScroll = this.onScroll.bind(this);
	}
	componentDidMount(){
		this._getMovies();
		if (this.props.auth.isAuthenticated) {
			this.props.getWatchedMovies(this.props.auth.user.username);
		}
	}

	componentDidUpdate(nextProps, prevState, snapshot) {
		if (nextProps.sort_by !== this.props.sort_by) {
			this.setState({
				page: 1,
				movies: [],
				loading: true
			}, () => this._getMovies());
		}
		if (nextProps.order_by !== this.props.order_by) {
			this.setState({
				page: 1,
				movies: [],
				loading: true
			}, () => this._getMovies());
		}
		if (nextProps.genre_by !== this.props.genre_by) {
			this.setState({
				page: 1,
				movies: [],
				loading: true
			}, () => this._getMovies());
		}
		if (nextProps.search_by !== this.props.search_by) {
			this.setState({
				page: 1,
				movies: [],
				loading: true
			}, () => this._getMovies());
		}
	}

	_renderMovies = () =>  {
		const lang = this.props.translate.lang;
		const movies = this.state.movies.map(movie => {
			if (movie && movie.title_english) {
				return <MovieList
					movie={movie}
					title={movie.title_english}
					year={movie.year}
					poster={movie.medium_cover_image}
					key={movie.id}
					genres={movie.genres}
					synopsis={movie.synopsis}
					rating={movie.rating}
					id={movie.id}
					imdb={movie.imdb_code}
					lang={lang}
					auth={this.props.auth.user}
				/>
			} else {
				return '';
			}
		})
		return movies
	}

	_getMovies = async () => {
		const movies_querried = await this._callApi();
		this.setState(state => {
			const movies = state.movies.concat(movies_querried);
			return {
				movies
			}
		})
	}

	_callApi = () => {
		return fetch(`https://yts.lt/api/v2/list_movies.json?sort_by=${this.props.sort_by}&limit=20&page=${this.state.page}&order_by=${this.props.order_by}&query_term=${this.props.search_by}&genre=${this.props.genre_by}`)
		.then(res => res.json())
		.then(json => {
			if (!json.data.movies || json.data.movies.length !== 20) {
				this.setState({
					loading: false
				})
			} else {
				this.setState({
					loading: true
				})
			}
			return json.data.movies
		})
		.catch(err => console.log(err))
	}

	onScroll = e => {
		let element = e.target;
		if (element.scrollHeight - element.scrollTop === element.clientHeight) {
			this.setState({
				page: this.state.page + 1
			}, () => this._getMovies());
		}
	}

	render() {
		return (
		<div className="home" onScroll={this.onScroll}>
			{this.state.movies ? this._renderMovies() : ''}
			<span>&nbsp;</span>
			{this.state.loading ? <div className="loader"></div> : ''}
		</div>
		);
	}
}

const mapStateToProps = state => ({
	sort_by: state.sort_by.sort_by,
	order_by: state.order_by.order_by,
	search_by: state.search_by.search_by,
	genre_by: state.genre_by.genre_by,
	translate: state.translate,
	auth: state.auth
})

const mapDispatchToProps = dispatch => {
	return {
		getWatchedMovies: username => {
			dispatch(getWatchedMovies(username));
		}
	}
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Home);