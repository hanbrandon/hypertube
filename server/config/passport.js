const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy,
      GoogleStrategy = require("passport-google-oauth").OAuth2Strategy,
      FacebookStrategy = require('passport-facebook').Strategy,
      FortyTwoStrategy = require('passport-42').Strategy,
      SlackStrategy = require('passport-slack-oauth2').Strategy;
const User = require("../models/User");
const googleCredentials = require("./serverConfig.json").google,
      facebookCredentials = require("./serverConfig.json").facebook,
      fortytwoCredentials = require("./serverConfig.json").fortytwo,
      slackCredentials = require("./serverConfig.json").slack;

// hash
const bcrypt = require("bcryptjs");

module.exports = (app) => {
    app.use(passport.initialize());
    app.use(passport.session());

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser((id, done) => {
        console.log('deserializeUser', id);
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    

    passport.use(new LocalStrategy(
        (username, password, done) => {
            // Find user by username
            User.findOne({ username: username }, (err, user) => {
                // Check if user exists
                if (err) { console.log(err) }
                if (!user) {
                    return done(null, false, { usernamenotfound: 'Incorrect username!' });
                }
                //Check Password
                if(user.password) {
                    bcrypt.compare(password, user.password).then(isMatch => {
                        if (isMatch) {
                            // User matched
                            const userObj = {
                                _id: user._id,
                                username: user.username,
                                firstName: user.firstName,
                                lastName: user.lastName,
                                email: user.email,
                                date: user.date,
                                profileImage: user.profileImage
                            }
                            return done(null, userObj);
                        } else {
                            return done(null, false, { passwordincorrect: 'Incorrect password!' });
                        }
                    })
                } else {
                    return done(null, false, { passwordincorrect: 'Incorrect password!' });
                }
            });
        }
    ))

    passport.use(new GoogleStrategy({
            clientID: googleCredentials.web.client_id,
            clientSecret: googleCredentials.web.client_secret,
            callbackURL: googleCredentials.web.redirect_uris[0]
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile._json.email }).then(user => {
                if (!user) {
                    let username = profile._json.email.split('@')[0];
                    let profileImage = !profile._json.picture ? "http://localhost:3000/user/default.png" : profile._json.picture
                    User.findOne({ username }).then(userCheck => {
                        if (!userCheck) {
                            const newUser = new User({
                                googleId: profile.id,
                                username: username,
                                firstName: profile._json.given_name,
                                lastName: profile._json.family_name,
                                email: profile._json.email,
                                profileImage: profileImage
                            });
                            newUser.save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                        } else {
                            const query = { username: new RegExp('^' + username) };
                            User.find(query).then(names => {
                                let val = 1;
                                let namesArr = [];
                                let dup = true;
                                for(let i = 0; i < names.length; i++) {
                                    namesArr.push(names[i].username.toLowerCase());
                                }
                                while(dup) {
                                    if (namesArr.includes((username + val).toLowerCase())) {
                                        val++;
                                    } else {
                                        username = username + val;
                                        dup = false;
                                    }
                                }
                                const newUser = new User({
                                    googleId: profile.id,
                                    username: username,
                                    firstName: profile._json.given_name,
                                    lastName: profile._json.family_name,
                                    email: profile._json.email,
                                    profileImage: profileImage
                                });
                                newUser.save()
                                .then(user => done(null, user))
                                .catch(err => console.log(err));
                            })
                        }
                    })
                } else if (!user.googleId) {
                    User.updateOne({ email: profile._json.email }, {
                        googleId: profile.id
                    }).then(() => {
                        User.findOne({ googleId: profile.id }).then(userUpdated => done(null, userUpdated));
                    })
                } else {
                    return done(null, user);
                }
            });
        }
    ));

    passport.use(new FacebookStrategy({
            clientID: facebookCredentials.app_id,
            clientSecret: facebookCredentials.app_secret,
            callbackURL: facebookCredentials.call_back_url,
            profileFields: ['id', 'emails', 'name', 'picture.type(large)']
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ email: profile._json.email }).then(user => {
                if (!user) {
                    let username = profile._json.email.split('@')[0];
                    let profileImage = !profile.photos.value ? "http://localhost:3000/user/default.png" : profile.photos.value
                    User.findOne({ username }).then(userCheck => {
                        if (!userCheck) {
                            const newUser = new User({
                                facebookId: profile.id,
                                username: username,
                                firstName: profile._json.first_name,
                                lastName: profile._json.last_name,
                                email: profile._json.email,
                                profileImage: profileImage
                            });
                            newUser.save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                        } else {
                            const query = { username: new RegExp('^' + username) };
                            User.find(query).then(names => {
                                let val = 1;
                                let namesArr = [];
                                let dup = true;
                                for(let i = 0; i < names.length; i++) {
                                    namesArr.push(names[i].username.toLowerCase());
                                }
                                while(dup) {
                                    if (namesArr.includes((username + val).toLowerCase())) {
                                        val++;
                                    } else {
                                        username = username + val;
                                        dup = false;
                                    }
                                }
                                const newUser = new User({
                                    facebookId: profile.id,
                                    username: username,
                                    firstName: profile._json.first_name,
                                    lastName: profile._json.last_name,
                                    email: profile._json.email,
                                    profileImage: profileImage
                                });
                                newUser.save()
                                .then(user => done(null, user))
                                .catch(err => console.log(err));
                            })
                        }
                    })
                } else if (!user.facebookId) {
                    User.updateOne({ email: profile._json.email }, {
                        facebookId: profile.id
                    }).then(() => {
                        User.findOne({ facebookId: profile.id }).then(userUpdated => done(null, userUpdated));
                    })
                } else {
                    return done(null, user);
                }
            });
        }
    ));

    passport.use(new FortyTwoStrategy({
        clientID: fortytwoCredentials.uid,
        clientSecret: fortytwoCredentials.secret,
        callbackURL: fortytwoCredentials.redirect_uri
    },
    function(accessToken, refreshToken, profile, done) {
        User.findOne({ email: profile._json.email }).then(user => {
            if (!user) {
                let username = profile._json.email.split('@')[0];
                let profileImage = !profile._json.image_url ? "http://localhost:3000/user/default.png" : profile._json.image_url
                User.findOne({ username }).then(userCheck => {
                    if (!userCheck) {
                        const newUser = new User({
                            fortytwoId: profile.id,
                            username: username,
                            firstName: profile._json.first_name,
                            lastName: profile._json.last_name,
                            email: profile._json.email,
                            profileImage: profileImage
                        });
                        newUser.save()
                        .then(user => done(null, user))
                        .catch(err => console.log(err));
                    } else {
                        const query = { username: new RegExp('^' + username) };
                        User.find(query).then(names => {
                            let val = 1;
                            let namesArr = [];
                            let dup = true;
                            for(let i = 0; i < names.length; i++) {
                                namesArr.push(names[i].username.toLowerCase());
                            }
                            while(dup) {
                                if (namesArr.includes((username + val).toLowerCase())) {
                                    val++;
                                } else {
                                    username = username + val;
                                    dup = false;
                                }
                            }
                            const newUser = new User({
                                fortytwoId: profile.id,
                                username: username,
                                firstName: profile._json.first_name,
                                lastName: profile._json.last_name,
                                email: profile._json.email,
                                profileImage: profileImage
                            });
                            newUser.save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                        })
                    }
                })
            } else if (!user.fortytwoId) {
                User.updateOne({ email: profile._json.email }, {
                    fortytwoId: profile.id
                }).then(() => {
                    User.findOne({ fortytwoId: profile.id }).then(userUpdated => done(null, userUpdated));
                })
            } else {
                return done(null, user);
            }
        });
    }));
    
    passport.use(new SlackStrategy({
            clientID: slackCredentials.client_id,
            clientSecret: slackCredentials.client_secret,
            skipUserProfile: false, // default
            scope: ['identity.basic', 'identity.email', 'identity.avatar', 'identity.team'] // default
        },
        (accessToken, refreshToken, profile, done) => {
            User.findOne({ email: profile.user.email }).then(user => {
                if (!user) {
                    let username = profile.user.email.split('@')[0];
                    User.findOne({ username }).then(userCheck => {
                        if (!userCheck) {
                            const newUser = new User({
                                slackId: profile.user.id,
                                username: username,
                                firstName: profile.user.name,
                                lastName: profile.user.name,
                                email: profile.user.email,
                                profileImage: "http://localhost:3000/user/default.png"
                            });
                            newUser.save()
                            .then(user => done(null, user))
                            .catch(err => console.log(err));
                        } else {
                            const query = { username: new RegExp('^' + username) };
                            User.find(query).then(names => {
                                let val = 1;
                                let namesArr = [];
                                let dup = true;
                                for(let i = 0; i < names.length; i++) {
                                    namesArr.push(names[i].username.toLowerCase());
                                }
                                while(dup) {
                                    if (namesArr.includes((username + val).toLowerCase())) {
                                        val++;
                                    } else {
                                        username = username + val;
                                        dup = false;
                                    }
                                }
                                const newUser = new User({
                                    slackId: profile.user.id,
                                    username: username,
                                    firstName: profile.user.name,
                                    lastName: profile.user.name,
                                    email: profile.user.email,
                                    profileImage: "http://localhost:3000/user/default.png"
                                });
                                newUser.save()
                                .then(user => done(null, user))
                                .catch(err => console.log(err));
                            })
                        }
                    })
                } else if (!user.slackId) {
                    User.updateOne({ email: profile.user.email }, {
                        slackId: profile.id
                    }).then(() => {
                        User.findOne({ slackId: profile.id }).then(userUpdated => done(null, userUpdated));
                    })
                } else {
                    return done(null, user);
                }
            });
        }
    ));

    
    return passport;
};