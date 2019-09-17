import React from 'react';
import { Link } from 'react-router-dom';
import { Line } from 'rc-progress';

const DownloadList = (props) => {
	const lang = props.lang;
	if (props.list.length > 0) {
		let i = 0;
		const downloadList = props.list.map(download => {
		const link = `/movie/${download.movieId}/${download.imdbId}`;
		i++;
		let ikey = `download${i}`;
		return (
			<Link to={link} key={ikey}>
				<div className="downloadList">
					<span>{download.title}</span>
					{download.rate === "Finished" ? <span className="finish">{lang === "en" ? "Finished" : "다운로드 완료"}</span> : <Line percent={download.rate} strokeWidth="4" trailWidth="4" strokeColor="green" />}	
				</div>
			</Link>
		)
	})
	return (downloadList)
	} else {
		return (
			<div className="downloadList">
				<span>{lang === "en" ? "Empty" : "비어있음"}</span>			
			</div>
		)
	}
}

export default DownloadList;