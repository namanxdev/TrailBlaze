const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const {CampgroundSchema} = require('./Schema')
const Campground = require('./models/campground');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Review = require('./models/review');
const campground = require('./models/campground');



// Validation on server-side of website
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



mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

const app = express();

// Needed for parsing of req.body
app.use(express.urlencoded({extended:true}));

app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// For method override
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home')
});

app.get('/campgrounds',catchAsync(async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})
}));

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});
// app.all(/(.*)/, (req, res, next) => {
app.post('/campgrounds',ValidateCampground,catchAsync(async(req,res,next)=>{

    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
}));

app.get('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show',{campground:foundCamp})
}));

app.get('/campgrounds/:id/edit',catchAsync(async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit',{campground:foundCamp})
}));


app.put('/campgrounds/:id',ValidateCampground,catchAsync(async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
}));

app.delete('/campgrounds/:id',catchAsync(async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
}));

// Reviews APIs

app.post('/campgrounds/:id/review',catchAsync(async(req,res)=>{
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    res.redirect(`/campgrounds/${campground._id}`)
}))

// Error Handling

app.all('*',(req,res,next)=>{
    // res.send('404!!!')
    next(new ExpressError('Page not found',404));
})

app.use((err,req,res,next)=>{
    const {statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh no, Something Went Wrong!!'
    res.status(statusCode).render('Error',{err});
})

app.listen(3000,()=>{
    console.log('Server Started on 3000');
    
})