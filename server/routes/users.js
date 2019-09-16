const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const fs = require("fs");
const mkdirp = require('mkdirp');

// Load input validation
const validateRegisterInput = require("../functions/validation").validateRegisterInput,
      validateDashboardInput = require("../functions/validation").validateDashboardInput,
      validateLoginInput = require("../functions/validation").validateLoginInput;

// Load User model
const User = require("../models/User");

// @route POST api/users/register
// @desc Register user
// @access Public
module.exports = (passport) => {

    router.post("/register", (req, res) => {
        // Form validation
        const { errors, isValid } = validateRegisterInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        }

        User.findOne({ email: req.body.email }).then(user => {
            if (user) {
                return res.status(400).json({ email: "Email already exists" });
            } else {
                User.findOne({ username: req.body.username }).then(user1 => {
                    if (user1) {
                        return res.status(400).json({ username: "Username already exists" });
                    } else {
                        const newUser = new User({
                        username: req.body.username,
                        password: req.body.password,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email,
                        language: req.body.language,
                        profileImage: "http://localhost:3000/user/default.png"
                        });
                        // Hash password before saving in database
                        bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err;
                            newUser.password = hash;
                            newUser
                            .save()
                            .then(user => res.json(user))
                            .catch(err => console.log(err));
                        });
                        });
                    }
                });
            }
        });
    });

    router.post("/dashboard", (req, res) => {
        // Form validation
        const { errors, isValid } = validateDashboardInput(req.body);
        // Check validation
        console.log(errors)
        if (!isValid) {
            return res.status(400).json(errors);
        }
        User.findOne({ username: req.body.username }).then(user => {
            if (user) {
                User.updateOne(
                    user,
                    {
                        username: req.body.username,
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        email: req.body.email
                    }
                ).then(res => {
                // Hash password before saving in database
                if (req.body.password) {
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (err) throw err;
                            User.updateOne(
                                user,
                                {
                                    password : hash
                                }
                            )
                            .catch(err => console.log(err));
                        });
                    });
                }}).then(fin => {
                    User.findOne({ username: req.body.username }).then(userUpdated => {
                        if (userUpdated) {
                            const payload = {
                                id: userUpdated.id,
                                username: userUpdated.username,
                                firstName: userUpdated.firstName,
                                lastName: userUpdated.lastName,
                                email: userUpdated.email
                            };
                            jwt.sign(
                                payload,
                                keys.secretOrKey,
                                {
                                    expiresIn: 31556926 // 1 year in seconds
                                },
                                (err, token) => {
                                    res.json({
                                        success: true,
                                        token: "Bearer " + token
                                    });
                                }
                            );
                        } else {
                            return res.status(401).json({ username: "Invalid Access!" });
                        }
                    })
                })
            } else {
                return res.status(401).json({ username: "Invalid Access!" });
            }
        });
    });

    router.post('/upload', function (req, res) {
        if (req.body.username && req.body.file) {
            const base64Image = req.body.file.split(';base64,').pop();
            const profileImagePath = fs.readdirSync(__dirname + `/../../client/public/user/`);
            profileImagePath.map(image => {
                if (image.includes(`${req.body.username}_`)) {
                    fs.unlinkSync(__dirname + `/../../client/public/user/${image}`);
                }
            })
            let tracker = Math.floor(Math.random() * 1000000);
            let changePic = `/user/${req.body.username}_${tracker}.png`
            changePic = `/user/${req.body.username}_${tracker}.png`
            fs.writeFileSync(__dirname + `/../../client/public${changePic}`, base64Image, {encoding: 'base64'});
            User.updateOne({username: req.body.username}, {profileImage: changePic}).then(x => {
                res.json({
                    newURL: changePic
                })
            })
        } else {
            const profileImagePath = fs.readdirSync(__dirname + `/../../client/public/user/`);
            profileImagePath.map(image => {
                if (image.includes(`${req.body.username}_`)) {
                    fs.unlinkSync(__dirname + `/../../client/public/user/${image}`);
                }
            })
            User.updateOne({username: req.body.username}, {profileImage: "http://localhost:3000/user/default.png"})
            .then(x => {
                res.json({
                    newURL: "http://localhost:3000/user/default.png"
                })
            });
        }
    })

    router.post('/login', (req, res, next) => {
        const { errors, isValid } = validateLoginInput(req.body);
        // Check validation
        if (!isValid) {
            return res.status(400).json(errors);
        } else {
            passport.authenticate('local', (err, user, info) => {
                if (err) { next(err) }
                if (info) {
                    res.status(404).json(info);
                } else if (!user) {
                    return res.status(404).json({ usernamenotfound: "Cannot find user" });
                }else {
                    jwt.sign(
                        user,
                        keys.secretOrKey,
                        {
                            expiresIn: 31556926 // 1 year in seconds
                        },
                        (err, token) => {
                            req.session.logged_user = req.body.username;
                            res.json({
                                success: true,
                                token: "Bearer " + token
                            });
                        }
                    );
                }
            })
            (req, res, next)
        }        
    });

    router.get('/google', passport.authenticate('google', {
        scope: ['https://www.googleapis.com/auth/plus.login', "openid", "email", "profile"]
    }));

    router.get('/google/callback', 
        passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login/', session: false }),
        function(req, res) {
            const userObj = {
                _id: req.user._id,
                username: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                date: req.user.date,
                profileImage: req.user.profileImage
            }
            jwt.sign(
                userObj,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    req.session.logged_user = req.user.username;
                    res.redirect("http://localhost:3000/login/" + token);
                }
            )
    });

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ["email", "user_photos"],
        enable_profile_selector: true
    }));

    router.get('/facebook/callback', 
        passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login/', session: false }),
        function(req, res) {
            const userObj = {
                _id: req.user._id,
                username: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                date: req.user.date,
                profileImage: req.user.profileImage
            }
            jwt.sign(
                userObj,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    req.session.logged_user = req.user.username;
                    res.redirect("http://localhost:3000/login/" + token);
                }
            )
    });

    router.get('/42', passport.authenticate('42'));

    router.get('/42/callback', 
        passport.authenticate('42', { failureRedirect: 'http://localhost:3000/login/', session: false }),
        function(req, res) {
            const userObj = {
                _id: req.user._id,
                username: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                date: req.user.date,
                profileImage: req.user.profileImage
            }
            jwt.sign(
                userObj,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    req.session.logged_user = req.user.username;
                    res.redirect("http://localhost:3000/login/" + token);
                }
            )
    });

    router.get('/slack', passport.authenticate('Slack'));

    router.get('/slack/callback', 
        passport.authenticate('Slack', { failureRedirect: 'http://localhost:3000/login/', session: false }),
        function(req, res) {
            const userObj = {
                _id: req.user._id,
                username: req.user.username,
                firstName: req.user.firstName,
                lastName: req.user.lastName,
                email: req.user.email,
                date: req.user.date,
                profileImage: req.user.profileImage
            }
            jwt.sign(
                userObj,
                keys.secretOrKey,
                {
                    expiresIn: 31556926 // 1 year in seconds
                },
                (err, token) => {
                    req.session.logged_user = req.user.username;
                    res.redirect("http://localhost:3000/login/" + token);
                }
            )
    });

    router.post('/profile', (req, res) => {
        User.findOne({ username : req.body.username }, (err, userData) => {
            if (err) {    
                throw err;
            }
            else {
                res.json({
                    username: userData.username,
                    firstName: userData.firstName,
                    lastName: userData.lastName,
                    profileImage: userData.profileImage
                })
            }
        })
    })
    return router;
}
