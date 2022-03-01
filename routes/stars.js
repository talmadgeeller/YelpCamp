const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const stars = require('../controllers/stars');

router.get('/', stars.showMap);

module.exports = router;