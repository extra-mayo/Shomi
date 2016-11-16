var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var User = mongoose.model('User');
var Movie = mongoose.model('Movie');

function DateObject(){
    this.originalDate = new Date();
    this.newDate = new Date(this.originalDate);
    this.selectedNext = false;

    var weekdayList = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    this.getWeekday = function (date){
        if (date){
            return weekdayList[date.getDay()];
        }
        return weekdayList[this.newDate.getDay()];
    };

    this.prev = function(){
        this.newDate.setDate(this.newDate.getDate() - 1);
    };
    this.next = function () {
        this.newDate.setDate(this.newDate.getDate() + 1);
    }
}

var date = new DateObject();


/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.user) {
        res.redirect('dashboard');
        console.log("user: ", req.user);
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
                res.render('register', {message: 'Your username or password is already taken'});
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
    if (req.user) {
        User
            .findOne({username: req.user.username})
            .populate({
                path: 'movies',
                match: {day: date.getWeekday()}
            }).exec(function (err, user) {
            console.log(user.movies);
            // var showSchedule = !!req.user && req.user.username == user.username;
            res.render('dashboard', {
                weekday: date.getWeekday(),
                // showSchedule: showSchedule,
                movies: user.movies,
                username: user.username
            });
        });
    }
    else {
        res.redirect('/');
    }
});

router.get('/add', function (req, res, next) {
    if (req.user) {
        res.render('add');
    }
    else {
        res.redirect('/');
    }
});

router.post('/add', function (req, res, next) {
    console.log(req.body.seasonNumber == null);
    if (req.body.seasonNumber == null){
        req.body.seasonNumber = -1;
    }
    if (req.body.episodeNumber == null){
        req.body.episodeNumber = -1;
    }

    console.log("body!: ", req.body);

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
            res.redirect('/add');
        });
    });

});


router.post('/next', function (req, res, next) {

    date.next();
    res.redirect('/dashboard');

});

router.post('/prev', function (req, res, next) {
    date.prev();
    res.redirect('/dashboard');
});


module.exports = router;
