import * as types from './ActionTypes';

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

// Register User
export const registerUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/register", userData)
        .then(res => history.push("/login")) // re-direct to login on successful register
        .catch(err =>
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        })
    );
};

// Login - get user token
export const loginUser = (userData) => dispatch => {
    axios
        .post("/api/users/login", userData)
        .then(res => {
            // Save to sessionStorage
            // Set token to sessionStorage
            const { token } = res.data;
            sessionStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        })
    .catch(err => {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        })}
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
    return {
        type: types.SET_CURRENT_USER,
        payload: decoded
    };
};

export const resetPassword = (userData, history) => dispatch => {
    axios
        .post("/api/resetpw/", userData) //get으로 나중에 수정해보자.
        .then(res => {
            alert("Email has been sent to " + res.data.email);
            history.push("/login");
        })
    .catch(err => {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        })
    })
}

export const verifyReset = (userData, history) => dispatch => {
    axios
        .post("/api/resetpw/verifyreset", userData) //put으로 나중에 수정해보자.
        .then(res => {
            alert(`New password successfully set! \nPlease login by using the new password.`);
            history.push("/login");
        })
    .catch(err => {
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.data
        })
    })
}


// Log user out
export const logoutUser = () => dispatch => {
    // Remove token from local storage
    sessionStorage.removeItem("jwtToken");
    // Remove auth header for future requests
    setAuthToken(false);
    // Set current user to empty object {} which will set isAuthenticated to false
    dispatch(setCurrentUser({}));
};

export const updateUser = (userData, history) => dispatch => {
    axios
        .post("/api/users/dashboard", userData)
        .then(res => {
            // Save to sessionStorage
            // Set token to sessionStorage
            const { token } = res.data;
            sessionStorage.setItem("jwtToken", token);
            // Set token to Auth header
            setAuthToken(token);
            // Decode token to get user data
            const decoded = jwt_decode(token);
            // Set current user
            dispatch(setCurrentUser(decoded));
        }) // re-direct to dashboard on successful update
    .then(res => history.push("/dashboard"))
    .catch(err =>
        dispatch({
            type: types.GET_ERRORS,
            payload: err.response.err
        })
    );
};

export const loginOAuthUser = (token, history) => dispatch => {
    const realToken = "Bearer " + token;
    sessionStorage.setItem("jwtToken", realToken);
    setAuthToken(realToken);
    const decoded = jwt_decode(realToken);
    dispatch(setCurrentUser(decoded));
    history.push("/dashboard");
}

// MOVIE
export const queryMovie = (imdb) => dispatch => {
    let link = "https://yts.lt/api/v2/movie_details.json?movie_id=" + imdb.id + "&with_images=true&with_cast=true";
    let queryData = {};
    fetch(link)
    .then(res => res.json())
    .then(json => {
        queryData = json.data.movie;
        const  imdb_id = { imdb: imdb.imdb}//queryData.id
        axios
            .post("/api/movie/directory", imdb_id)
            .then(res => {
                if (res) {
                    console.log(res)
                    if (res.data.movie) {
                        queryData = {...queryData, videoPath: res.data.movie}
                    }
                    if (res.data.subtitle) {
                        queryData = {...queryData, subtitlePath: res.data.subtitle}
                    }
                    if (res.data.torrents) {
                        let mergedTorrents = queryData.torrents.concat(res.data.torrents)
                        queryData = {...queryData, torrents: mergedTorrents };
                    }
                    console.log(queryData);
                }
                dispatch(movieInfo(queryData))
            })
    })
    .catch(err => console.log(err));
}

export const movieInfo = movieData => {
    return {
        type: types.BROWSE,
        payload: movieData
    };
};

export const unloadAll = () => dispatch => {
    dispatch(movieInfo(""));
    dispatch(queryUserSuccess(""));
}

export const downloadMagnetInfo = (videoPath, subtitlePath) => {
    return {
        type: types.STREAM,
        payload: {videoPath, subtitlePath}
    }
}

export const downloadMagnet = (fileUrl) => dispatch => {
    axios
    .post("/api/movie/download", { hash: fileUrl.hash, imdb: fileUrl.imdb, movieId: fileUrl.movieId, username: fileUrl.username })
    .then(res => {
        console.log(res);
        if (res.data.success) {
            dispatch(downloadMagnetInfo(res.data.videoPath, res.data.subtitlePath));
        }
    })
    .catch(err => console.log(err));
}

export const searchTorrentFiles = (imdb) => dispatch => {
    axios
    .post("/api/movie/torrentfiles", (imdb))
    .then(res => {
        console.log('Get Torrent Files')
        console.log(res);
    })
}
//GET USER PROFILE

export const queryUser = (username) => dispatch => {
    axios
    .post("/api/users/profile", (username))
    .then(res=> {
        dispatch(queryUserSuccess(res.data))
    })
    .catch(err => {
        throw(err);
    })
}

export const queryUserSuccess = (userData) => {

    return {
        type: types.GET_USER,
        userData
    }
};

// COMMENT 
export const queryComment = (imdb) => dispatch => {
    axios
    .post("/api/comment", {imdb})
    .then(res => {
        dispatch(queryCommentSuccess(res.data))
    })
    .catch(err => {
        throw(err);
    });
}

export const queryCommentSuccess = (comments) => {
    return {
        type: types.QUERY_COMMENT,
        comments
    }
};

export const postComment = (commentData) => dispatch => {
    axios
        .post("/api/comment/post", commentData)
        .then(res => {
            dispatch(postCommentSuccess(res.data))
        })
        .catch(err => {
            throw(err);
        });
};

export const postCommentSuccess = (data) => {
    return {
        type: types.POST_COMMENT,
        payload: {
            _id: data._id,
            username: data.username,
            profileImage: data.profileImage,
            imdb: data.imdb,
            date: data.date,
            comment: data.comment
        }
    }
}

/* sort / order */

export const sortByInfo = sort => {
    return {
        type: types.SORT_BY,
        payload: sort
    };
};

export const sortBy = type => dispatch => {
    dispatch(sortByInfo(type));
}

export const orderByInfo = order => {
    return {
        type: types.ORDER_BY,
        payload: order
    }
}

export const orderBy = order => dispatch => {
    dispatch(orderByInfo(order));
}

export const searchByInfo = search => {
    return {
        type: types.SEARCH,
        payload: search
    }
}

export const searchBy = search => dispatch => {
    dispatch(searchByInfo(search));
}

export const genreByInfo = genre => {
    return {
        type: types.GENRE,
        payload: genre
    }
}

export const genreBy = genre => dispatch => {
    dispatch(genreByInfo(genre));
}

export const resetPageInfo = () => {
    return {
        type: types.RESET_PAGE
    }
}

export const resetPage = () => dispatch => {
    dispatch(resetPageInfo());
}

export const uploadImageInfo = newImage => {
    return {
        type: types.UPLOAD_PROFILE,
        payload: newImage
    }
}

export const uploadImage = newImage => dispatch => {
    axios
        .post("/api/users/upload", newImage)
        .then(res => {
            let newImage = res.data.newURL
            if (newImage.includes("http://") || newImage.includes("https://")) {
                newImage = res.data.newURL
            } else {
                newImage = process.env.PUBLIC_URL + newImage;
            }
            dispatch(uploadImageInfo(newImage));
        })
        .catch(err => console.log(err));
}

//TRANSLATE 
export const translateTo = (lang) => {
    return {
        type: types.TRANSLATE,
        lang
    }
};
