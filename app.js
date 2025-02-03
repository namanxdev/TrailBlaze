const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Session = require('express-session');
const flash = require('connect-flash');


// Routes
const campgrounds = require('./routes/campground');
const reviews  = require('./routes/reviews');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

// Needed for parsing of req.body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));


// Session & Flash
const sessionConfig = {
    secret:'thisshouldbebettersecret',
    resave:false,
    saveUninitialized:true,
    // store: eventually i will make it mongo store not local storage

    cookie:{
        httpOnly:true,// Ensures the cookie is sent only over HTTP(S) and not accessible via client-side JavaScript
        expires: Date.now() + 1000*60*60*24*7, // after a week
        maxAge:1000*60*60*24*7
    }
}

app.use(Session(sessionConfig));
app.use(flash())

// MiddleWare to handle flash
app.use((req,res,next)=>{
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.engine('ejs',ejsMate);

app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.set('public',path.join(__dirname,'public'));

// For method override
app.use(methodOverride('_method'));

// Using Routes

app.use('/campgrounds',campgrounds);
app.use('/campgrounds/:id/reviews',reviews);

app.get('/',(req,res)=>{
    res.render('home')
});

// Error Handling

// app.all(/(.*)/, (req, res, next) => {
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