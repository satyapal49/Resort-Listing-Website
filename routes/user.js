const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js")


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
        req.login(registerUser, (err) => {
            if (err) {
                return next(err)
            }
            req.flash("success", "Welcome to Wonderlust!")
            res.redirect("/listings")
        })
    } catch (er) {
        req.flash("error", er.message);
        res.redirect("/signup")
    }
}));

//Login
router.get("/login", (req, res) => {
    res.render("users/login.ejs")
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), async (req, res) => {
req.flash("success", "Welcome back to wanderlust you are logged in");
let redirectUrl = res.locals.redirectUrl || "listings";
res.redirect(redirectUrl);
})

router.get("/logout",  (req, res)=>{
    req.logout((err)=>{
        if(err) {
          return next(err);
        }
        req.flash("success", "You are a logged out !");
        res.redirect("/listings");
    })
})


module.exports = router;