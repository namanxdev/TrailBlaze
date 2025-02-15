const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const passport = require("passport");
const { storeReturnTo } = require('../middleware');
const users = require('../controllers/users')

router.route("/register")
    .get(users.registerForm)
    .post(catchAsync(users.registerNewUser));

router.route("/login")    
    .get(catchAsync(users.loginForm))
    .post(
    // 1. Copy req.session.returnTo to res.locals.returnTo
    storeReturnTo,
    // 2. Authenticate the user (this clears the session)
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    // 3. Redirect the user after login
    users.userLogin
);

// Google OAuth login route:
router.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google OAuth callback route:
router.get('/auth/google/callback',
    passport.authenticate('google', { failureFlash: true, failureRedirect: '/login' }),
    users.userLogin // This middleware can handle post-login redirection/logic.
);

router.get('/logout',users.userLogout);

module.exports = router;
