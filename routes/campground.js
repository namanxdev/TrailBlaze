const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {CampgroundSchema} = require('../Schema')
const ExpressError = require('../utils/ExpressError');


// Validation on server-side of website (Campground)
const ValidateCampground = (req,res,next)=>{
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

router.get('/',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})
}));

router.get('/new',(req,res)=>{
    res.render('campgrounds/new');
});

router.post('/',ValidateCampground,catchAsync(async(req,res,next)=>{
    
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    req.flash('success','Successfully Made a New Campground!!') 
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

router.get('/:id',catchAsync(async(req,res)=>{

    const {id} = req.params
    const foundCamp = await Campground.findById(id).populate('reviews');
    if(!foundCamp){
        req.flash('error','Cannot find that camp ground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground:foundCamp,msg:req.flash('success')});
}));

router.get('/:id/edit',catchAsync(async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    if(!foundCamp){
        req.flash('error','Cannot find that camp ground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground:foundCamp})
}));


router.put('/:id',ValidateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully Updated a Campground!!')
    res.redirect(`/campgrounds/${campground._id}`);
}));

router.delete('/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Your Campground !!')
    res.redirect(`/campgrounds`);
}));

module.exports = router;