const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

//session
const session = require("express-session");
const sessionConfig = require("./config/serverConfig.json").session;
const MongoStore = require('connect-mongo')(session);

const app = express();

// DB Config
const db = require("./config/keys").mongoURI;

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
        console.log("Disconnected from the download server");
	})
	people[socket.handshake.session.logged_user] = socket.id;
	socket.handshake.session.save();
	
	socket.on('ping', msg => {
		alert(msg);
	});
    /* socket.on('chat_message', function(message) {
		var from = message.by;
		var to = message.to;
		var msg = message.message;
		var date = new Date();
		var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		date = date.toLocaleDateString("en-US", options);
		db.query(`SELECT * FROM users WHERE username=?`, [from], function(err, rows) {
			if (err) throw err;
			if (rows && rows[0]) {
				db.query(`INSERT INTO chats (from_id, to_id, chat, time) VALUES (?, ?, ?, ?)`, [rows[0].id, to, msg, date], function (err) {
					if (err) throw err;
					db.query(`SELECT username, image_1 FROM users WHERE id = ?`, [to], function(err0, names) {
						io.to(global.people[names[0].username]).emit('chat_message', {id: rows[0].id, from: from, msg: msg, date: date, profile_pic: rows[0].image_1});
						io.to(global.people[socket.handshake.session.logged_user]).emit('chat_message', {from: from, msg: msg, date: date, profile_pic: rows[0].image_1});
					});
				});
			}
		});
	});

	socket.on('notification', function(data) {
		var to = data.to;
		var to_id = data.to_id;
		var from_id = data.from_id;
		var notice = data.notice;
		var date = new Date();
		var options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
		date = date.toLocaleDateString("en-US", options);
		//db.query(`SELECT * FROM users WHERE username = ?`, [from_id])
		db.query(`INSERT INTO notification (from_id, to_id, notice, time) VALUES (?, ?, ?, ?)`, [from_id, to_id, notice, date], (err) => {
			if (err) throw err;
			else {
				db.query(`SELECT * FROM users WHERE id = ?`, [from_id], (err, user) => {
					if (err) throw err;
					if (user && user[0]) {
						var fullname = user[0].firstname + " " + user[0].lastname;
						io.to(global.people[to]).emit('notification', {val:1, from_id:from_id, from_name: fullname, notice:notice, date:date});
					}
				})
			}
		});
	}); */
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

// process.env.port is Heroku's port if you choose to deploy the app there
const port = process.env.PORT || 5000; 

http.listen(port, function() {
	console.log('app listening on port ' + port);
});