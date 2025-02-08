const express = require("express");
const router = express.Router();
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require('../middleware');

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register",catchAsync(async (req, res,next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        // console.log(registerUser);
        req.login(registerUser,err =>{
            if(err) return next(err);
            req.flash("success", "Welcome To YelpCamp");
            res.redirect("/campgrounds");
        })
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/register');
    }
    
}));

router.get('/login',catchAsync(async (req,res)=>{
    res.render('users/login');
}));

router.post('/login',
    // 1. Copy req.session.returnTo to res.locals.returnTo
    storeReturnTo,
    // 2. Authenticate the user (this clears the session)
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // 3. Redirect the user after login
    (req, res) => {
        req.flash('success', 'Welcome back!');
        // Use res.locals.returnTo if it exists, else fallback to a default route
        const redirectUrl = res.locals.returnTo || '/campgrounds';
        res.redirect(redirectUrl);
    }
);

router.get('/logout',(req,res)=>{
    req.logOut(function (err){
        if(err){
            return next(err);
        }
        req.flash('success','GoodBye!!');
        res.redirect('/campgrounds')
    })
    
});

module.exports = router;
