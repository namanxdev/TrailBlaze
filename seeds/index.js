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
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const c = new Campground({
            author:'67a63e0618b74ba0d2560540',
            location:`${cities[random1000].city} ,${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // Random image generated
            image:`https://picsum.photos/400?random=${Math.random()}`,
            description:'Escape the hustle and bustle of everyday life and immerse yourself in the serene beauty',
            price
        })
        await c.save();
        
    }
    console.log("Save 50 new cities");
    

}

SeedDB();