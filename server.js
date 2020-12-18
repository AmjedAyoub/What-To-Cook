const express = require("express");
var bodyParser = require('body-parser');
const mongoose = require("mongoose");
const routes = require("./routes/router");
const app = express();
const cors = require('cors');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
require('dotenv').config();
// var session = require('express-session');
// var MongoStore = require('connect-mongo')(session);
// require('dotenv').config();

const PORT = process.env.PORT || 3001;



app.use(cors());

// Define middleware here
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}


// Connect to the Mongo DB
mongoose.connect(
      "mongodb+srv://amjed:bWtbNTv8nRFMhoXI@cluster0.vcoxq.mongodb.net/users?retryWrites=true&w=majority", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log("Connection failed!");
    console.log(err);
  });
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

});


app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized: false,
  store: new MongoStore({
    mongooseConnection: db
  })
}));

// Add routes, both API and view
app.use(routes);

// If no API routes are hit, send the React app
app.use(function(req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Start the API server
app.listen(PORT, function() {
  console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});