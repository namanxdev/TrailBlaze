if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();

}

// console.log(process.env.SECRET);

const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')
const {isLoggedIn,ValidateCampground,IsAuthor} = require('../middleware');
const multer  = require('multer')
const{storage} = require('../cloudinary');
const upload = multer({ storage })

router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn,upload.array('image'),ValidateCampground,catchAsync(campgrounds.createCampground));

    // .post(upload.array('image'), (req, res) => { // array for multiple images and single for one pick
    //     if (!req.files) {
    //         return res.status(400).send('No file uploaded.');
    //     }
    //     console.log(req.body,req.file); // Debugging
    //     res.send(req.files)
    //     // res.redirect('/campgrounds'); // Redirect user after upload
    // });
    
router.get('/new',isLoggedIn,campgrounds.renderNewForm);

router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn,IsAuthor,upload.array('image'),ValidateCampground,catchAsync(campgrounds.updateCampground))
    .delete(isLoggedIn,catchAsync(campgrounds.DeleteCampground));


router.get('/:id/edit',isLoggedIn,IsAuthor,catchAsync(campgrounds.renderEditForm));

module.exports = router;