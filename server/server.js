const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require('fs');

//session
const session = require("express-session");
const sessionConfig = require("./config/serverConfig.json").session;
const MongoStore = require('connect-mongo')(session);

const app = express();
const schedule = require('node-schedule');

// DB Config
const db = require("./config/keys").mongoURI;
const moment = require('moment')

// Connect to MongoDB
mongoose
.connect(
    db,
	{ 
		useNewUrlParser: true,
		useUnifiedTopology: true 
	}
)
.then(() => console.log("MongoDB successfully connected"))
.catch(err => console.log(err));
const connectedDb = mongoose.connection

// Passport config
const passport = require("./config/passport")(app);

// Define Socket.io
const http = require('http').Server(app),
	io = require('socket.io')(http, {
		pingTimeout: 60000,
	}),
    sharedsession = require('express-socket.io-session');

// Router
const users = require("./routes/users")(passport),
	resetpw = require("./routes/resetpw"),
	movie = require("./routes/download"),
	comment = require("./routes/comment");


const cors = require('cors');

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

app.use(cors());
//session settings
//session secret is stored in serverConfig.json which is gitignored for version control.
const sessionInfo = {
    secret: sessionConfig.secret, // secret key to verify session
    resave: false,
	saveUninitialized: true,
	store: new MongoStore({ mongooseConnection: connectedDb })
}

app.use(session(sessionInfo))

// set socket
io.use(sharedsession(session(sessionInfo), {
    autoSave:true
}));

let people = [];
io.sockets.on('connection', (socket) => {
	// change to username_related chatroom using mysql db
    socket.on('disconnect', () => {
        /* console.log("Disconnected from the download server"); */
	})
	people[socket.handshake.session.logged_user] = socket.id;
	socket.handshake.session.save();
	
	socket.on('ping', msg => {
		alert(msg);
	});
});
global.people = people;

//Bodyparser middleware 
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.use(bodyParser.json());

// Routes
app.use("/api/users", users);
app.use("/api/resetpw", resetpw);
app.use("/api/movie", movie(io));
app.use("/api/comment", comment);

/*|| 0 0 * * * ||*/
schedule.scheduleJob('0 0 * * *', () => {
	let updated = undefined;
	const now = moment(new Date());
	let cleanId = [];
	let moviePath = undefined;
	const deleteMovie = () => {
		for (i in cleanId) {
			moviePath = process.cwd() + '/client/public' + cleanId[i].moviePath;
			Movie.deleteOne({_id: cleanId[i].id}, err => {
				if (err) console.log(err);
				if (global.terminateConnection instanceof Function) {
					global.terminateConnection();
				}
				if (fs.existsSync(moviePath)) {
					fs.unlinkSync(moviePath);
				}
			})
		}
	}

	Movie.find({}, (err, movies) => {
		for (let i = 0; i < movies.length; i++) {
			updated = moment(movies[i].lastPlayedDate)
			if (-updated.diff(now, 'days') > 30) {
				cleanId.push({id: movies[i]._id, moviePath: movies[i].moviePath});
			}
			if (i === movies.length - 1) {
				deleteMovie();
			}
		}
	});
})

// process.env.port is Heroku's port if you choose to deploy the app there
const port = process.env.PORT || 5000; 

http.listen(port, function() {
	console.log('app listening on port ' + port);
});