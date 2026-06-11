const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');
const { trimAuthFields } = require('../middleware');

router.route('/register')
    .get(users.renderRegister)
    .post(trimAuthFields, catchAsync(users.register));

router.route('/login')
    .get(users.renderLogin)
    .post(trimAuthFields, passport.authenticate('local',
        { failureFlash: true, failureRedirect: '/login' }), users.login);

router.get('/logout', users.logout);

module.exports = router;