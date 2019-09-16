import React from "react";
import PropTypes from "prop-types";
import { Link } from 'react-router-dom';
import ReactImageFallback from "react-image-fallback";

import translateJson from "../utils/translate.json";

const MovieList = ({ movie, title, year, poster, genres, rating, id, imdb, lang}) => {
    return (
        <div className="movieList">
            <Link to={{
                pathname: `/movie/${id}/${imdb}`,
                state: {
                    detail: movie
                }
            }}>
            <div className="movie">
                <MoviePoster  poster={poster} alt={title}/>
                <div className="title">
                    <span className="titleSpan">{title}<hr/></span>
                    <span className="movieYear">{year}</span>
                    <div className="rating">{rating}</div>
                    <div className="Movie_Genre" >
                        {genres ? genres.map((genre, index) => (
                        <MovieGenre genre={genre} key={index} lang={lang} />
                    )) : ""}
                    </div>
                </div>
            </div>
            </Link>
        </div>
    );
}

const MovieGenre = ({ genre, lang }) => {
    return <span > {lang === "en" ? genre : translateJson[genre]} </span>;
}

const MoviePoster = ({ poster, alt }) => {
    return <ReactImageFallback 
                className="poster"
                fallbackImage= {process.env.PUBLIC_URL + '/videos/defaultPoster.png'}
                src={poster}
                alt={alt}
                title={alt} />;
}

MovieList.propTypes = {
    title: PropTypes.string.isRequired,
    poster: PropTypes.string.isRequired,
    genres: PropTypes.array,
    synopsis: PropTypes.string.isRequired,
    id: PropTypes.number.isRequired,
    imdb: PropTypes.string.isRequired,
    movie: PropTypes.object.isRequired,
    rating: PropTypes.number.isRequired
};

MoviePoster.propTypes = {
    poster: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired
};

MovieGenre.propTypes = {
    genre: PropTypes.string.isRequired
};

export default MovieList;
