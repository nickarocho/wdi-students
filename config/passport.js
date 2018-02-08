var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20').Strategy;
var Student = require('../models/student');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
    }, 
    function(accessToken, refreshToken, profile, cb) {
        Student.findOne({ 'googleId': profile.id }, function(err, student) {
            if (err) return cb(err);
            if (student) {
                if (!student.avatar) {
                    student.avatar = profile.photos[0].value;
                    student.save(function(err) {
                        return cb(null, student);
                    })
                } else {
                    return cb(null, student);
                }
            } else {
                var newStudent = new Student({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    avatar: profile.photos[0].value
                });
                newStudent.save(function(err) {
                    if (err) return cb(err);
                    return cb(null, newStudent);
                });
            }
        });
    }
));

passport.serializeUser(function(student, done) {
    done(null, student.id);
});

passport.deserializeUser(function(id, done) {
    Student.findById(id, function(err, student) {
        done(err, student);
    });
});