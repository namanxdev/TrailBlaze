const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const {places,descriptors} = require('./seedHelpers')

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

const sample = array => array[Math.floor(Math.random()* array.length)];

const SeedDB = async ()=>{
    await Campground.deleteMany({}); // deletes everything
    console.log('Deleted Old data');
    
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random()*1000)
        const c = new Campground({
            location:`${cities[random1000].city} ,${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`
        })
        await c.save();
        
    }
    console.log("Save 50 new cities");
    

}

SeedDB();