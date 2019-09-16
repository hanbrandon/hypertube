const express = require("express");
const router = express.Router();
const torrentStream = require('torrent-stream');
const path = require('path');
const fs = require('fs');
const rootPath = process.cwd();
const mkdirp = require('mkdirp');
const RarbgApi = require('rarbg');
const Movie = require('../models/Movie');

const filesize = require('filesize');
// const size = filesize.partial({standard: "iec"});

// Create a new instance of the module
const rarbg = new RarbgApi()

// Subtitle 
// const yifysubtitles = require('yifysubtitles-api');
const yifysubtitles = require('yifysubtitles');

const langs = ['sq','ar','bn','pb','bg','zh','hr','cs','da','nl','en','et','fa','fi','fr','de','el','he','hu','id','it','ja','ko','lt','mk','ms','no','pl','pt','ro','ru','sr','sl','es','sv','th','tr','ur','uk','vi'];
module.exports = (io) => {
    router.post("/download", (req, res) => {
        const imdbId = req.body.imdb;
        const torrentId = req.body.hash;
        const movieId = req.body.movieId;
        const username = req.body.username;
        Movie.findOne({torrent_url: torrentId}).then(movie => {
            if (movie && !movie.downloading) {
                if (fs.existsSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/`)) {
                    const subtitlePath = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/`)
                    let subtitlesObj = [];
                    subtitlePath.map(title => {
                        let files = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/${title}/`);
                        if (files) {
                            for (let i = 0; i < files.length; i++) {
                                let fileName = files[i];
                                let subtitleObj = {
                                    label: title,
                                    kind: 'subtitles',
                                    srcLang: title,
                                    src: `/videos/${imdbId}/subtitles/${title}/${fileName}`
                                };
                                subtitlesObj = [...subtitlesObj, subtitleObj];
                            }
                        }
                    })
                    res.json({ 
                        success : "Movie exists",
                        videoPath : movie.moviePath,
                        subtitlePath: subtitlesObj
                    });
                }
            } else {
                const engine = torrentStream(torrentId);
                engine.on('ready', function() {
                    // const mp4Regex = /(*.mp4$)/g
                    // const files = engine.files[]
                    engine.files.forEach(function(file) {
                        if (file.name.includes(".mp4")) {
                            let fileName = file.name;
                            let filePath = file.path;
                            let fileLength = file.length;
                            let stream = file.createReadStream();
                            // stream is readable stream to containing the file content
                            if (fileName.includes('mp4')) {
                                mkdirp(`${rootPath}/client/public/videos/${imdbId}`, (err) => {
                                    if (err) {
                                        console.log(err);
                                    } else {
                                        mkdirp(`${rootPath}/client/public/videos/${imdbId}/subtitles/`, (err2) => {
                                            if (err2) {
                                                console.log(err2);
                                            } else {
                                                langs.forEach(lang => {
                                                    mkdirp(`${rootPath}/client/public/videos/${imdbId}/subtitles/${lang}`, (err3) => {
                                                        if (err3) {
                                                            console.log(err3); 
                                                        }
                                                        yifysubtitles(imdbId, {path: `${rootPath}/client/public/videos/${imdbId}/subtitles/${lang}`, langs: [lang]})
                                                        .then(res => {
                                                            if ((res.length == 0 || !res[0].fileName) && (fs.existsSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/${lang}`))){

                                                                fs.rmdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/${lang}`);
                                                            }
                                                            // subtitles 
                                                            //console.log(res);
                                                        })
                                                        .catch(err => console.log(err));
                                                    })
                                                })
                                            }
                                        })
                                        let videoPath = `${rootPath}/client/public/videos/${imdbId}/${fileName}`;
                                        let writer = fs.createWriteStream(videoPath);
                                        if (!movie) {
                                            const newMovie = new Movie ({
                                                imdb_id: imdbId,
                                                moviePath: `/videos/${imdbId}/${fileName}`,
                                                torrent_url: torrentId,
                                                lastPlayedDate: new Date(),
                                                downloading: true
                                            });
                                            newMovie.save()
                                            .catch(err => console.log(err));
                                        }
                                        const subtitlePath = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/`)
                                        let subtitlesObj = [];
                                        subtitlePath.map(title => {
                                            let files = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/${title}/`);
                                            if (files) {
                                                for (let i = 0; i < files.length; i++) {
                                                    let fileName = files[i];
                                                    let subtitleObj = {
                                                        label: title,
                                                        kind: 'subtitles',
                                                        srcLang: title,
                                                        src: `/videos/${imdbId}/subtitles/${title}/${fileName}`
                                                    };
                                                    subtitlesObj = [...subtitlesObj, subtitleObj];
                                                }
                                            }
                                        })
                                        res.json({
                                            success : "Download Started.",
                                            videoPath : `/videos/${imdbId}/${fileName}`,
                                            subtitlePath: subtitlesObj
                                        });
                                        stream.on('data', (data) => {
                                            writer.write(data);
                                            if (data) {
                                                let percentage = (engine.swarm.downloaded / fileLength * 100).toFixed(2);
                                                io.to(global.people[username]).emit('percentagePing', { 
                                                    downloaded: percentage,
                                                    fileName: fileName,
                                                    movieId: movieId,
                                                    imdbId: imdbId
                                                })
                                            }
                                            
                                        })
                                        engine.on('idle', res => {
                                            engine.destroy(res => {
                                                io.to(global.people[username]).emit('percentagePing', { 
                                                    downloaded: "Finished",
                                                    fileName: fileName,
                                                    movieId: movieId,
                                                    imdbId: imdbId
                                                })
                                                Movie.updateOne({torrent_url: torrentId}, { downloading: false }).then(x => console.log(x));
                                            })
                                        })
                                    }
                                });
                            }
                        }
                    });
                });
            }
        })
    })
    
    router.post("/directory", (req, res) => {
        const imdbId = req.body.imdb;
        let moviePath = "";
        let pathObj = {};

        if (fs.existsSync(`${rootPath}/client/public/videos/${imdbId}`)) {
            moviePath = fs.readdirSync(rootPath + `/client/public/videos/${imdbId}`)
            if (moviePath) {
                moviePath.splice(moviePath.indexOf('subtitle'), 1);
            }
            if (fs.existsSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/`)) {
                const subtitlePath = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/`)
                let subtitlesObj = [];
                subtitlePath.map(title => {
                    let files = fs.readdirSync(`${rootPath}/client/public/videos/${imdbId}/subtitles/${title}/`);
                    if (files) {
                        for (let i = 0; i < files.length; i++) {
                            let fileName = files[i];
                            let subtitleObj = {
                                label: title,
                                kind: 'subtitles',
                                srcLang: title,
                                src: `/videos/${imdbId}/subtitles/${title}/${fileName}`
                            };
                            subtitlesObj = [...subtitlesObj, subtitleObj];
                        }
                    }
                })
                if (moviePath && subtitlesObj) {
                    for (let i = 0; i < moviePath.length; i++) {
                        if (moviePath[i].includes(".mp4")) {
                            pathObj = {
                                movie: `/videos/${imdbId}/${moviePath[i]}`,
                                subtitle: subtitlesObj
                            }
                            break;
                        }
                    }
                }
            } else {
                if (moviePath) {
                    for (let i = 0; i < moviePath.length; i++) {
                        if (moviePath[i].includes(".mp4")) {
                            pathObj = {
                                movie: `/videos/${imdbId}/${moviePath[i]}`,
                                subtitle: subtitlesObj
                            }
                            break;
                        }
                    }
                }
            }
        }
        rarbg.search({
            search_imdb: imdbId,
            sort: 'seeders',
            min_seeders: 1,
            format: 'json_extended'
        }).then(response => {
            let torrents = [];
            for(let i = 0; i < response.length; i++) {
                let quality = 'N/A'
                if (response[i].title.includes("720") || response[i].category.includes("720"))
                {
                    quality = '720p'
                }
                else if (response[i].title.includes("1080") || response[i].category.includes("1080"))
                {
                    quality = '1080p'
                }
                let objFormat = {
                    download: response[i].download,
                    peers: response[i].leechers,
                    seeds: response[i].seeders,
                    quality: quality,
                    size: filesize(response[i].size, {round: 1}),
                    size_bytes: response[i].size
                }
                torrents = [
                    ...torrents,
                    objFormat
                ];
            }
            return res.json({
                ...pathObj,
                torrents
            })
        }).catch(err => {
            if (err) {
                console.log(err);
                res.json({
                    ...pathObj,
                    error : "Cannot find movie"
                })
            }
        })
        
    })
    
    return router;
};