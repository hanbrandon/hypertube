import React from "react";
import { Link } from 'react-router-dom';
import ReactImageFallback from "react-image-fallback";

import translateJson from "../../utils/translate.json";

export const CommentList = (props) => {
	if (props.comments) {
		const comments = props.comments.map(comment => {
		return(
			<div className="commentList" key={comment._id}>
				<Link to={{pathname:`/profile/${comment.username}`}}>
					<img src={comment.profileImage} alt="profileImg" className="profileImg"/>
				</Link>
				<div className="commentInfo">
					<Link to={{pathname:`/profile/${comment.username}`}}>
						<span className="commentUsername">
							<strong>{comment.username}</strong>
						</span>
					</Link>
					<span className="commentDate">{comment.date}</span>
				</div>
				<span className="comment">{comment.comment}</span>
			</div>
		);
		})
		return (comments)
	}
	return (<div></div>)
}

export const CommentInput = (props) => {
	const lang = props.lang;
	return (
		<div className="commentInput input-group">
			<img src={props.img} alt="profileImg" className="profileImg"/>
			<div className="commentArea">
				<textarea id="comment" className="form-control commentTextarea" placeholder={lang === "en" ? "Add a public comment..." : "댓글 입력하기..."} onChange={props.onChange} value={props.comment}/>
				<button onClick={props.onClick}><i className="fas fa-pencil-alt"></i></button>
			</div>	
		</div>
	)
}

export const DownloadTable = (props) => {
	const lang = props.lang;
	if ( props.torrents && props.imdb_id) {
		const files = props.torrents.map(file => {
				if (file.hash) {
					const hash = 'magnet:?xt=urn:btih:' + file.hash;
					return (
						<tr key={props.torrents.indexOf(file) + 1}>
							<td>{file.size}</td>
							<td>{file.quality}</td>
							<td>{file.peers}</td>
							<td>{file.seeds}</td>
							<td><button onClick={(e) => props.download({ hash: hash, imdb: props.imdb_id, movieId: props.movieId, username: props.username })}>{lang === "en" ? "STREAM" : "스트리밍"}</button></td>
						</tr>
					)
				} else if (file.download) {
					return (
						<tr key={props.torrents.indexOf(file) + 1}>
							<td>{file.size}</td>
							<td>{file.quality}</td>
							<td>{file.peers}</td>
							<td>{file.seeds}</td>
							<td><button onClick={(e) => props.download({ hash: file.download, imdb: props.imdb_id, movieId: props.movieId, username: props.username })}>{lang === "en" ? "STREAM" : "스트리밍"}</button></td>
						</tr>
					)
				}
				else {
					return (
						""
					)
				}
		})
		return (files)
	}
	return(<tr></tr>)
}

export const MovieCasts = (props) => {
	if (props.cast) {
		const casts = props.cast.map(cast => {
			const profile = process.env.PUBLIC_URL + '/user/default.png';
			return (
			<div className="movieCast" key={cast.imdb_code}>
				<ReactImageFallback className="castPic" src={cast.url_small_image ? cast.url_small_image : profile} fallbackImage={profile} alt="cast_profile_picture"/>
				<div className="castName">{cast.name}</div>
			</div>
			)
		});
		return (<div className="movieCasts">
			{casts}
		</div>)
	}
	return (<div></div>);
}

export const MovieGenres = (props) => {
	const lang = props.lang;
	if (props.genres) {
		const genres = props.genres.map(genre => {
		return(
			<span key={props.genres.indexOf(genre)}> {lang === "en" ? `#${genre}` : `#${translateJson[genre]}`}</span>
		);
		})
		return (genres)
	}
	return (<div></div>)
}

export const RunTime = (props) => {
	const lang = props.lang;
	let minutes = props.runtime;
	let h = Math.floor(minutes / 60);
	let m = minutes % 60;
	h = h < 10 ? '0' + h : h;
	m = m < 10 ? '0' + m : m;
	return (<div className="runTime">{lang === "en" ? "Run Time : " : "런타임 : "}{h + ':' + m}</div>);
}

export const TrackList = ({ subList }) => {
	let alreadyCalled = [];
	if (subList) {
		const subtitleList = subList.map(subtitle => {
			alreadyCalled = [...alreadyCalled, subtitle.label];
			let count = alreadyCalled.filter(x => x === subtitle.label).length;
			if (count > 1) {
				return (
					<track label={`${subtitle.label}${count}`} kind="subtitles" srcLang={`${subtitle.label}${count}`} src={process.env.PUBLIC_URL + subtitle.src} key={`${subtitle.label}${count}`} />
				)
			} else {
				return (
					<track label={subtitle.label} kind="subtitles" srcLang={subtitle.label} src={process.env.PUBLIC_URL + subtitle.src} key={subtitle.label} />
				)
			}
		})
		return (subtitleList);
	} else {
		return "";
	}
}