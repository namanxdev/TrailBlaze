const Campground = require('../models/campground');

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>{
    
    const newCampground = new Campground(req.body.campground);
    newCampground.author = req.user._id;
    await newCampground.save();
    req.flash('success','Successfully Made a New Campground!!') 
    res.redirect(`/campgrounds/${newCampground._id}`);
}

module.exports.showCampground = async(req,res)=>{

    const {id} = req.params
    const foundCamp = await Campground.findById(id).populate(
    {   path:'reviews',
        populate:{
            path:'author' // author of reviews
        }
    }).populate('author'); // author of campground
    // console.log(foundCamp);
    
    if(!foundCamp){
        req.flash('error','Cannot find that camp ground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show',{campground:foundCamp,msg:req.flash('success')});
}

module.exports.renderEditForm = async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    if(!foundCamp){
        req.flash('error','Cannot find that camp ground!');
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit',{campground:foundCamp})
}

module.exports.updateCampground = async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    req.flash('success','Successfully Updated a Campground!!')
    res.redirect(`/campgrounds/${campground._id}`);
}


module.exports.DeleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Your Campground !!')
    res.redirect(`/campgrounds`);
}