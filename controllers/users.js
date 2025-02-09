const User = require("../models/User");

module.exports.registerForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerNewUser = async (req, res,next) => {
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
    
}

module.exports.loginForm = async (req,res)=>{
    res.render('users/login');
}

module.exports.userLogin = (req, res) => {
    req.flash('success', 'Welcome back!');
    // Use res.locals.returnTo if it exists, else fallback to a default route
    const redirectUrl = res.locals.returnTo || '/campgrounds';
    res.redirect(redirectUrl);
}

module.exports.userLogout = (req,res)=>{
    req.logOut(function (err){
        if(err){
            return next(err);
        }
        req.flash('success','GoodBye!!');
        res.redirect('/campgrounds')
    })
    
}