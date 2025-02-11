const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const Review = require('./review')

const CampgroundSchema = new Schema({
    title:String,
    images:[
        {
            url:String,
            filename:String
        }
    ],
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