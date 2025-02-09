const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn,ValidateCampground,IsAuthor} = require('../middleware');

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,ValidateCampground,catchAsync(campgrounds.createCampground));

router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,IsAuthor,ValidateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,catchAsync(campgrounds.DeleteCampground));


router.get('/:id/edit',isLoggedIn,IsAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;