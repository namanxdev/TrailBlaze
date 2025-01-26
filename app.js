const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const Campground = require('./models/campground');
const methodOverride = require('method-override');


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

const app = express();

// Needed for parsing of req.body
app.use(express.urlencoded({extended:true}));

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

// For method override
app.use(methodOverride('_method'));

app.get('/',(req,res)=>{
    res.render('home')
});

app.get('/campgrounds',async(req,res)=>{
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index.ejs',{campgrounds})
});

app.get('/campgrounds/new',(req,res)=>{
    res.render('campgrounds/new');
});

app.post('/campgrounds',async(req,res)=>{
    const newCampground = new Campground(req.body.campground);
    await newCampground.save();
    res.redirect(`/campgrounds/${newCampground._id}`);
});

app.get('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/show',{campground:foundCamp})
});

app.get('/campgrounds/:id/edit',async(req,res)=>{
    const {id} = req.params
    const foundCamp = await Campground.findById(id);
    res.render('campgrounds/edit',{campground:foundCamp})
});


app.put('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    const campground = await Campground.findByIdAndUpdate(id,{...req.body.campground});
    res.redirect(`/campgrounds/${campground._id}`);
})

app.delete('/campgrounds/:id',async(req,res)=>{
    const {id} = req.params;
    await Campground.findByIdAndDelete(id);
    res.redirect(`/campgrounds`);
})

app.listen(3000,()=>{
    console.log('Server Started on 3000');
    
})