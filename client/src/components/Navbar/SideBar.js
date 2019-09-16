import React from 'react';

const SideBar = (props) => {
	const sidebarClass = props.isOpen ? 'sidebar open' : 'sidebar';
	const sideCategoriesClass = props.isOpen ? 'sideCategories openCategories' : 'sideCategories';
	const overlayClass = props.isOpen ? 'overlay openOverlay' : 'overlay';
	const lang = props.lang;
	return (
		<div className={sidebarClass}>
			<div className={sideCategoriesClass}>
				<div className="sortTable">
					<span>{lang === "en" ? "Sort by : " : "정렬 : "}</span>
					<ul className="sortOrder">
						<li className="desc" onClick={e => props.orderBy('desc')}><i className="fas fa-sort-amount-down"><span className="visually-hidden">{lang === "en" ? "Descending" : "내림차순"}</span></i></li>
						<li className="asc" onClick={e => props.orderBy('asc')}><i className="fas fa-sort-amount-down-alt"><span className="visually-hidden">{lang === "en" ? "Ascending" : "오름차순"}</span></i></li>
					</ul>
					<ul className="sortBy">
						<li onClick={e => props.sortBy('name')}>{lang === "en" ? "NAME" : "이름"}</li>
						<li onClick={e => props.sortBy('year')}>{lang === "en" ? "YEAR" : "년도"}</li>
						<li onClick={e => props.sortBy('rating')}>{lang === "en" ? "RATING" : "평점"}</li>
						<li onClick={e => props.sortBy('peers')}>{lang === "en" ? "PEERS" : "피어"}</li>
						<li onClick={e => props.sortBy('seeds')}>{lang === "en" ? "SEEDS" : "시드"}</li>
						<li onClick={e => props.sortBy('download_count')}>{lang === "en" ? "DOWNLOADS" : "다운로드"}</li>
						<li onClick={e => props.sortBy('like_count')}>{lang === "en" ? "LIKES" : "좋아요"}</li>
						<li onClick={e => props.sortBy('date_added')}>{lang === "en" ? "DATE" : "날짜"}</li>
					</ul>
				</div>
				<hr className="sideBarSeparate"/>
				<span>{lang === "en" ? "Genres : " : "장르 : "}</span>
				<ul className="genreList">
					<li onClick={e => props.genreBy('')} className="sideCategory firstChild">{lang === "en" ? "All" : "모두보기"}</li>
					<li onClick={e => props.genreBy('action')} className="sideCategory">{lang === "en" ? "Action" : "액션"}</li>
					<li onClick={e => props.genreBy('adventure')} className="sideCategory">{lang === "en" ? "Adventure" : "어드벤처"}</li>
					<li onClick={e => props.genreBy('animation')} className="sideCategory">{lang === "en" ? "Animation" : "애니메이션"}</li>
					<li onClick={e => props.genreBy('biography')} className="sideCategory">{lang === "en" ? "Biography" : "전기"}</li>
					<li onClick={e => props.genreBy('comedy')} className="sideCategory">{lang === "en" ? "Comedy" : "코미디"}</li>
					<li onClick={e => props.genreBy('crime')} className="sideCategory">{lang === "en" ? "Crime" : "범죄"}</li>
					<li onClick={e => props.genreBy('documentary')} className="sideCategory">{lang === "en" ? "Documentary" : "다큐멘터리"}</li>
					<li onClick={e => props.genreBy('drama')} className="sideCategory">{lang === "en" ? "Drama" : "드라마"}</li>
					<li onClick={e => props.genreBy('family')} className="sideCategory">{lang === "en" ? "Family" : "가족"}</li>
					<li onClick={e => props.genreBy('fantasy')} className="sideCategory">{lang === "en" ? "Fantasy" : "판타지"}</li>
					<li onClick={e => props.genreBy('film-noir')} className="sideCategory">{lang === "en" ? "Film-Noir" : "누아르"}</li>
					<li onClick={e => props.genreBy('game-show')} className="sideCategory">{lang === "en" ? "Game-Show" : "게임쇼"}</li>
					<li onClick={e => props.genreBy('history')} className="sideCategory">{lang === "en" ? "History" : "역사"}</li>
					<li onClick={e => props.genreBy('horror')} className="sideCategory">{lang === "en" ? "Horror" : "공포"}</li>
					<li onClick={e => props.genreBy('music')} className="sideCategory">{lang === "en" ? "Music" : "뮤직"}</li>
					<li onClick={e => props.genreBy('musical')} className="sideCategory">{lang === "en" ? "Musical" : "뮤지컬"}</li>
					<li onClick={e => props.genreBy('mystery')} className="sideCategory">{lang === "en" ? "Mystery" : "미스테리"}</li>
					<li onClick={e => props.genreBy('news')} className="sideCategory">{lang === "en" ? "News" : "뉴스"}</li>
					<li onClick={e => props.genreBy('reality-tv')} className="sideCategory">{lang === "en" ? "Reality-TV" : "리얼리티TV"}</li>
					<li onClick={e => props.genreBy('romance')} className="sideCategory">{lang === "en" ? "Romance" : "로맨스"}</li>
					<li onClick={e => props.genreBy('sci-fi')} className="sideCategory">{lang === "en" ? "Sci-Fi" : "공상과학"}</li>
					<li onClick={e => props.genreBy('sport')} className="sideCategory">{lang === "en" ? "Sport" : "스포츠"}</li>
					<li onClick={e => props.genreBy('talk-show')} className="sideCategory">{lang === "en" ? "Talk-Show" : "토크쇼"}</li>
					<li onClick={e => props.genreBy('thriller')} className="sideCategory">{lang === "en" ? "Thriller" : "스릴러"}</li>
					<li onClick={e => props.genreBy('war')} className="sideCategory">{lang === "en" ? "War" : "전쟁"}</li>
					<li onClick={e => props.genreBy('western')} className="sideCategory">{lang === "en" ? "Western" : "서부"}</li>
				</ul>
			</div>
			<div className={overlayClass} onClick={props.expand}></div>
		</div>
		
	);
}

export default SideBar;