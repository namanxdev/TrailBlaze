const express = require("express");
const router = express.Router();
const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");

router.get("/register", (req, res) => {
    res.render("users/register");
});

router.post("/register",catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registerUser = await User.register(user, password);
        // console.log(registerUser);
        req.flash("success", "Welcome To YelpCamp");
        res.redirect("/campgrounds");
    } catch (error) {
        req.flash('error',error.message);
        res.redirect('/register');
    }
    
}));

module.exports = router;
