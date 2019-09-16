import React from 'react';

import DownloadList from './DownloadList';

const DownloadBar = (props) => {
	const downloadBarClass = props.isOpen ? 'downloadBar openD' : 'downloadBar';
	const lang = props.lang;
	return (
		<div className={downloadBarClass}>
			<DownloadList lang={lang} list={props.list} />
			<div className="tri2"/>
			<div className="tri"/>
		</div>
		
	);
}

export default DownloadBar;