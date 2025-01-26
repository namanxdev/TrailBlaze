const express = require('express');
const mongoose = require('mongoose')
const path = require('path');
const Campground = require('./models/campground');


mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

const app = express();

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.get('/',(req,res)=>{
    res.render('home')
})

app.get('/makeCampground',async (req,res)=>{
    const camp = new Campground({title:'My Backyard',description:'Cheap camping!'})
    await camp.save();
    res.send(camp);
})

app.listen(3000,()=>{
    console.log('Server Started on 3000');
    
})