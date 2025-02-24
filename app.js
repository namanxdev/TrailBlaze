if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
}

// require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
const Session = require('express-session');
const flash = require('connect-flash');
const Passport = require('passport');
const LocalStrategy = require('passport-local');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/User');
const Helmet = require('helmet')

const MongoStore = require('connect-mongo'); // for storing mongo session in mongoDB
// const dbUrl = 'mongodb://localhost:27017/yelp-camp' ;
const dbUrl = process.env.DB_URL ;
const mongoSanitize = require('express-mongo-sanitize');

// Routes
const campgroundRoutes = require('./routes/campground');
const reviewsRoutes  = require('./routes/reviews');
const UserRoutes = require('./routes/User'); 

mongoose.connect(dbUrl)

const db = mongoose.connection;
db.on('error',console.error.bind(console,'Connection Error:'));
db.once('open',()=>{
    console.log("Database connected!");
    
});

// Needed for parsing of req.body
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'));
// To remove data using these defaults:
app.use(mongoSanitize({
    replaceWith: '_'
}))

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60, // time period in seconds (24 hours)
    crypto: {
        secret: process.env.SECRET
    }
});

store.on("error", function(e){
    console.log("Session Store Error",e);
})

// Session & Flash
const sessionConfig = {
    store,
    name:'session', 
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    // store: eventually i will make it mongo store not local storage

    cookie:{
        httpOnly:true,// Ensures the cookie is sent only over HTTP(S) and not accessible via client-side JavaScript
        //secure:true, // Ensures the cookie is sent only over HTTPS not work on localhost
        expires: Date.now() + 1000*60*60*24*7, // after a week milliseconds
        maxAge:1000*60*60*24*7
    }
}

app.use(Session(sessionConfig));
app.use(flash())
app.use(Helmet());

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://cdn.maptiler.com/", 
    "https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/boxicons/2.1.4/css/boxicons.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css"
    
];
const connectSrcUrls = [
    "https://api.maptiler.com/", 
];
const fontSrcUrls = [
    "https://cdnjs.cloudflare.com/",
    "https://unpkg.com/",
    "https://fonts.gstatic.com/",
    "https://cdnjs.cloudflare.com/ajax/libs/remixicon/4.6.0/remixicon.css"
];

app.use(
    Helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, // Your Cloudinary account
                "https://images.unsplash.com/",
                "https://api.maptiler.com/", // MapTiler image tiles
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(Passport.initialize());
app.use(Passport.session());
Passport.use(new LocalStrategy(User.authenticate()));

Passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: 'http://localhost:3000/auth/google/callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
      // 1) Check if there's already a user with this Google profile ID
        let existingUser = await User.findOne({ googleId: profile.id });

        if (!existingUser) {
        // 2) If not, create a new user
        existingUser = new User({
            googleId: profile.id,
            username: profile.displayName,
          email: profile.emails?.[0]?.value // use first email if available
        });
        await existingUser.save();
    }
      // 3) Pass that user to done()
        return done(null, existingUser);

    } catch (err) {
        return done(err, null);
    }
}));  



// How to do you store data in particular session
Passport.serializeUser(User.serializeUser());
Passport.deserializeUser(User.deserializeUser())


// MiddleWare to handle flash
app.use((req,res,next)=>{
    // console.log(req.query);
    res.locals.currentUser = req.user;
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

app.use('/',UserRoutes);
app.use('/campgrounds',campgroundRoutes);
app.use('/campgrounds/:id/reviews',reviewsRoutes);

app.get('/',(req,res)=>{
    res.render('Home1')
});

app.get('/fakeuser',async (req,res)=>{
    const user = new User({email:'cutiehie@gmail.com',username:'Hiee'})
    const newUser = await User.register(user,'chicken'); // password
    res.send(newUser);
})

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