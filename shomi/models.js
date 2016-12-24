var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

// users
// * our site requires authentication...
// * so users have a username and password
// * they also can have 0 or more movies
var User = new mongoose.Schema({
    // username, password provided by plugin
    movies:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// movies
// * includes name, the weekday user will expect it to air, season number, and episode number
var Movie = new mongoose.Schema({
    title: {type: String, required: [true, '{PATH} is required.']},
    day: {type: String, required: true},
    season: {type: Number},
    episode: {type: Number},
    user: {type: mongoose.Schema.Types.ObjectId, ref:'User'}
});

// NOTE: we're using passport-local-mongoose as a plugin
// our schema for user looks pretty thin... but that's because
// the plugin inserts salt, password and username

User.plugin(passportLocalMongoose);
mongoose.model('User', User);
mongoose.model('Movie', Movie);

// is the environment variable, NODE_ENV, set to PRODUCTION?
if (process.env.NODE_ENV == 'PRODUCTION') {
    // if we're in PRODUCTION mode, then read the configration from a file
    // use blocking file io to do this...
    var fs = require('fs');
    var path = require('path');
    var fn = path.join(__dirname, 'config.json');
    var data = fs.readFileSync(fn);

    // our configuration file will be in json, so parse it and set the
    // conenction string appropriately!
    var conf = JSON.parse(data);
    var dbconf = conf.dbconf;
} else {
    // if we're not in PRODUCTION mode, then use
    dbconf = 'mongodb://localhost/movieUserDB';
}
mongoose.connect(dbconf);
