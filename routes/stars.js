const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthorized } = require('../middleware');
const stars = require('../controllers/stars');

router.route('/')
    .get(isLoggedIn, isAuthorized, stars.showMap)
    .post(isLoggedIn, isAuthorized, catchAsync(stars.createStarMap));

router.get('/create', isLoggedIn, isAuthorized, catchAsync(stars.renderCreateForm));

module.exports = router;