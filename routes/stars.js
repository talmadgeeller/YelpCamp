const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn } = require('../middleware');
const stars = require('../controllers/stars');

router.route('/')
    .get(isLoggedIn, stars.showMap)
    .post(isLoggedIn, stars.createStarMap);

router.get('/create', isLoggedIn, catchAsync(stars.renderCreateForm));

module.exports = router;