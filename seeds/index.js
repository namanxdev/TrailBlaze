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
    
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random()*1000);
        const price = Math.floor(Math.random()*20)+10;
        const c = new Campground({
            author:'67a63e0618b74ba0d2560540',
            location:`${cities[random1000].city} ,${cities[random1000].state}`,
            title:`${sample(descriptors)} ${sample(places)}`,
            // Random image generated
            // image:`https://picsum.photos/400?random=${Math.random()}`,
            geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dvojeb6qj/image/upload/v1739295067/YelpCamp/pob24k0iahfclmj18mnz.jpg',
                    filename: 'YelpCamp/pob24k0iahfclmj18mnz'
                    
                },
                {
                    url: 'https://res.cloudinary.com/dvojeb6qj/image/upload/v1739295071/YelpCamp/zh5ooceukpb596caujc2.jpg',
                    filename: 'YelpCamp/zh5ooceukpb596caujc2'
                }
            ],
            description:'Escape the hustle and bustle of everyday life and immerse yourself in the serene beauty',
            price
        })
        await c.save();
        
    }
    console.log("Save 300 new cities");
    

}

SeedDB().then(()=>{
    mongoose.connection.close();
});