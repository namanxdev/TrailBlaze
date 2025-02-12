const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

// https://res.cloudinary.com/dvojeb6qj/image/upload/v1739343033/YelpCamp/or2tbup9wtm5xppmjk0r.jpg

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const CampgroundSchema = new Schema({
    title:String,
    images:[ImageSchema],
    price:Number,
    description:String,
    location:String,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    reviews:[
        {
        type:Schema.Types.ObjectId,
        ref:'Review'
    }
]

})

// Used when we delete campground but also want to remove everything inside it
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
    console.log('Reviews deleted');
    
})


module.exports = mongoose.model('Campground',CampgroundSchema);