// middleware.js

const {CampgroundSchema,reviewSchema} = require('./Schema')
const ExpressError = require('./utils/ExpressError');
const Campground = require('./models/campground');
const Review = require('./models/review');


module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Store the URL they are trying to access
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
}

// Validation on server-side of website (Campground)
module.exports.ValidateCampground = (req,res,next)=>{
    // if(!req.body.campground) throw new ExpressError('Invalid data!!',400)
    // This is not Mongooose schema
    const {error }= CampgroundSchema.validate(req.body);
    // console.log(result);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg,400)
    }else{
        next();
    }
    
}

module.exports.IsAuthor = async(req,res,next)=>{
    const {id} = req.params
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error','You do not have Permission to edit it')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.IsReviewAuthor = async(req,res,next)=>{
    const {id,reviewId} = req.params
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error','You do not have Permission to do it')
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

// Validation on server-side of website (Reviews)
module.exports.ValidateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
};
