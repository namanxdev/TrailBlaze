const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync');

const reviews = require('../controllers/reviews');
const {ValidateReview,isLoggedIn, IsReviewAuthor} = require('../middleware')



// Reviews API
router.post('/',isLoggedIn,ValidateReview,catchAsync(reviews.createReview));

router.delete('/:reviewId',isLoggedIn,IsReviewAuthor,catchAsync(reviews.deleteReviews));

module.exports = router;
