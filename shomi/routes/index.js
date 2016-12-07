var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');
var addic7edApi = require('addic7ed-api');

function OriginalDate() {
    this.originalDate = new Date(Date.now());
    this.selectedNext = false;

    this.weekdayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

}

OriginalDate.prototype.getWeekday = function (date) {
    if (date) {
        return this.weekdayList[date.getDay()];
    }
    return this.weekdayList[this.originalDate.getDay()];
};


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('dashboard');
        // console.log("user: ", req.user);
    }
    else {
        res.render('index', {title: 'shomi'});
    }
});

router.get('/login', function (req, res, next) {
    res.render('login');
});


router.post('/login', function (req, res, next) {
    passport.authenticate('local', function (err, user) {
        if (user) {
            req.logIn(user, function (err) {
                res.redirect('/dashboard');
            });
        } else {
            res.render('login', {message: 'Your login or password is incorrect.'});
        }
    })(req, res, next);
    // NOTE: notice that this form of authenticate returns a function that
    // we call immediately! See custom callback section of docs:
    // http://passportjs.org/guide/authenticate/
});

router.get('/register', function (req, res, next) {
    res.render('register');
});

router.post('/register', function (req, res) {
    User.register(new User({username: req.body.username}),
        req.body.password, function (err, user) {
            if (err) {
                // NOTE: error? send message back to registration...
                res.render('register', {message: 'Your username or password is already taken.'});
            } else {
                // NOTE: once you've registered, you should be logged in automatically
                // ...so call authenticate if there's no error
                passport.authenticate('local')(req, res, function () {
                    res.redirect('/dashboard');
                });
            }
        });
});

router.get('/dashboard', function (req, res, next) {
    var date = new OriginalDate();
    if (req.user) {
        User
            .findOne({username: req.user.username})
            .populate({
                path: 'movies',
                match: {day: date.getWeekday()}
            }).exec(function (err, user) {
            console.log("user id?", user);
            // console.log(user.movies);
            // var showSchedule = !!req.user && req.user.username == user.username;
            res.render('dashboard', {
                weekday: date.getWeekday(),
                // showSchedule: showSchedule,
                movies: user.movies,
                id: user._id,
                username: user.username
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/edit', function (req, res, next) {

    if (req.user) {

        User
            .findOne({username: req.user.username})
            .populate({
                path: 'movies'
            })
            .exec(function (err, user) {
                console.log("hey!!: ", user);
                // console.log(user.movies);
                // var showSchedule = !!req.user && req.user.username == user.username;
                res.render('edit', {
                    movies: user.movies,
                    username: user.username
                });
            });
    }
    else {
        res.redirect('/');
    }


});

router.post('/add', function (req, res, next) {
    // console.log(req.body.seasonNumber == null);
    if (req.body.seasonNumber == "" || req.body.episodeNumber == null) {
        req.body.seasonNumber = -1;
    }
    if (req.body.episodeNumber == "" || req.body.episodeNumber == null) {
        req.body.episodeNumber = -1;
    }

    // console.log("body!: ", req.body);

    var movie = new Movie({
        title: req.body.showTitle,
        day: req.body.showWeekday,
        season: req.body.seasonNumber,
        episode: req.body.episodeNumber,
        user: req.user._id

    });
    movie.save(function (err, savedMovie, count) {
        // NOTE: we're grabbing the image id from the
        // saved image to add to the user's image array
        req.user.movies.push(savedMovie._id);
        req.user.save(function (err, savedUser, count) {
            res.redirect('/edit');
        });
    });

});


router.get('/faq', function (req, res) {
    res.render('faq');
});


router.get('/api/movies/weekday', function (req, res) {

    var movieFilter = {};
    console.log("request query!", req.query);

    if (req.query.day) {
        movieFilter.day = req.query.day;
        movieFilter.user = req.query.user;
    }

    Movie.find(movieFilter, function (err, movies) {
        res.json(movies);
    });


});

//get movie based on ID
router.get('/api/movies/IDtoShow', function (req, res) {

    var movieFilter = {},
        searchExists = false;
    console.log("query ID:", req.query.id);
    if (req.query.id) {
        movieFilter._id = req.query.id;
        searchExists = true;
    }

    Movie.find(movieFilter, function (err, movies) {
        console.log("movies by id: ", movies);
        res.json(movies);
    });
});

router.get('/api/movies/subs', function (req, res) {
    console.log(req.query);
    var title = decodeURI(req.query.title);

    addic7edApi.search(title, 1, 1).then(function (subtitlesList) {
        var subInfo = subtitlesList[0];
        if (subInfo) {
            console.log(subInfo.referer);
            res.json(subInfo);
        }
    });
});

router.post('/api/movies/delete', function (req, res) {
    console.log("here!", req.body.movieID);
    Movie.remove({_id: req.body.movieID}, function (err, movies) {
        if (err) {
            console.log("movie removal error!");
        }
    });

});

module.exports = router;
