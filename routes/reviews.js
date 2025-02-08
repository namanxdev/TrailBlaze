const express = require('express');
const router = express.Router({mergeParams:true});

const catchAsync = require('../utils/catchAsync');

const Campground = require('../models/campground');
const Review = require('../models/review'); 
const {ValidateReview,isLoggedIn, IsReviewAuthor} = require('../middleware')



// Reviews API
router.post('/',isLoggedIn,ValidateReview,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success','Created a review !!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:reviewId',isLoggedIn,IsReviewAuthor,catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success','Successfully Deleted Your review !!')
    res.redirect(`/campgrounds/${id}`);
}));

module.exports = router;
