const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");


//Signup
router.get("/signup", (req, res) => {
    res.render("users/signup.ejs")
})

router.post("/signup", wrapAsync(async (req, res) => {
    try {
        let { username, email, password } = req.body;
        const newUser = new User({ email, username });
        const registerUser = await User.register(newUser, password);
        console.log(registerUser)
        req.flash("success", "Welcome to Wonderlust!")
        res.redirect("/listings")
    } catch (er) {
        req.flash("error", er.message);
        res.redirect("/signup")
    }
}));

//Login
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
req.flash("success", "Welcome back to wanderlust you are logged in");
res.redirect("/listings")
})


module.exports = router;