const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const validateEmailInput = require("../functions/validation").validateEmailInput,
      validateResetInput = require("../functions/validation").validateResetInput;

const User = require("../models/User");

const nodemailer = require("nodemailer");
const mailCredentials = require("../config/serverConfig.json").mailInfo;

const smtpTransport = nodemailer.createTransport({
    service: mailCredentials.service,
    auth: {
        user: mailCredentials.user,
        pass: mailCredentials.pass
    }
});

router.post('/', (req, res, next) => {
    const {errors, isValid} = validateEmailInput(req.body);
    
    if(!isValid) {
        return res.status(400).json(errors);
    } else {
        const host = "localhost:3000";
        User.findOne({ email : req.body.email }).then(user => {
            if (user) {
                let token = ""
                if (user.resetToken) {
                    token = user.resetToken;
                } else {
                    const secretKey = String(Math.floor((Math.random() * 100) + 54)) + req.body.email;
                    token = bcrypt.hashSync(secretKey, bcrypt.genSaltSync(10));
                    token = token.replace(/\//ig, "");
                    User.updateOne(user, { resetToken: token })
                    .catch(err => console.log(err));
                }
                console.log(token);
                const link = "http://" + host + "/forgotpw/verify/" + token;
                const mailOptions = {
                    to: user.email,
                    from: 'no-reply@hypertube.com',
                    subject: "Hypertube | Password Reset Link",
                    html: `Hello, <br />
                    Please click on the link to reset your password.<br />
                    <b><a href=${link}>Click here to change the password.</a></b>`
                }
                smtpTransport.sendMail(mailOptions, (err, response) => {
                    if (err) throw err;
                    else {
                        res.json({
                            success: true,
                            email: req.body.email
                        });
                    }
                })
            } else {
                res.status(400).json({ email: "Cannot find user" });
            }
        })
    }
})

router.post('/verifyreset', (req, res, next) => {
    const {errors, isValid} = validateResetInput(req.body);
    
    if (!isValid) {
        return res.status(400).json(errors);
    } else {
        User.findOne({ resetToken: req.body.token }).then(user => {
            if (user) {
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(req.body.password, salt, (err, hash) => {
                        if (err) throw err;
                        User.updateOne(
                            user,
                            {
                                password : hash
                            }
                        ).then(fin => {
                            User.updateOne({_id: user._id}, {
                                $unset: {resetToken: ""}
                            }).then(fin => {
                                res.json({
                                    success: true
                                })
                            })
                        })
                        .catch(err => console.log(err));
                    });
                });
            } else {
                res.status(400).json({ invalid: "INVALID_ACCESS" });
            }
        })
    }
})

module.exports = router;
