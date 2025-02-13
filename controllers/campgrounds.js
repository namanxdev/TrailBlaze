const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary")
const maptilerClient = require("@maptiler/client");
maptilerClient.config.apiKey = process.env.MAPTILER_API_KEY;

module.exports.index = async(req,res)=>{
    const campgrounds = await Campground.find({})
    // .populate('popupText');
    res.render('campgrounds/index.ejs',{campgrounds})
}

module.exports.renderNewForm = (req,res)=>{
    res.render('campgrounds/new');
}

module.exports.createCampground = async(req,res,next)=>{
    
    if (req.files.length > 10) {
        req.flash('error', 'Maximum 10 images allowed per campground');
        return res.redirect('/campgrounds/new');
    }

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    
    const newCampground = new Campground(req.body.campground);
    newCampground.geometry = geoData.features[0].geometry;
    newCampground.images = req.files.map(f=>({url:f.path,filename:f.filename}));
    newCampground.author = req.user._id;
    await newCampground.save();
    console.log(newCampground);
    
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

module.exports.updateCampground = async (req, res) => {
    const { id } = req.params;
    console.log(req.body);
    
    // Find and update campground
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

    const geoData = await maptilerClient.geocoding.forward(req.body.campground.location, { limit: 1 });
    campground.geometry = geoData.features[0].geometry;

    if (!campground) {
        req.flash('error', 'Campground not found!');
        return res.redirect('/campgrounds');
    }

    // Validate total image count on update
    const totalImages = campground.images.length + req.files.length;
    if (totalImages > 10) {
        req.flash('error', 'Maximum 10 images allowed (including existing ones)');
        return res.redirect(`/campgrounds/${id}/edit`);
    }
    // Process uploaded images
    const img = req.files.map(f => ({ url: f.path, filename: f.filename }));
        if (img.length > 0) {
        campground.images.push(...img);
        await campground.save();  
    }

    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        
        await campground.updateOne({$pull:{images:{filename:{$in:req.body.deleteImages}}}})
        console.log(campground);
        
    }
    req.flash('success', 'Successfully Updated a Campground!!');
    res.redirect(`/campgrounds/${campground._id}`);
};



module.exports.DeleteCampground = async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success','Successfully Deleted Your Campground !!')
    res.redirect(`/campgrounds`);
}