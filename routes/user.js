const express = require("express");
const router  = express.Router();
// let User =require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRiderectUrl } = require("../middleware.js");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controllers/users.js");




router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");

})
 

router.post("/signup", wrapAsync(userController.signup));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");

})

router.post("/login",saveRiderectUrl, passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), async(req,res)=>{
    req.flash("success","Welcome Back")  ;
    // res.redirect("/listings");
    // res.redirect(req.session.redirectUrl);
    let redirecturl  = res.locals.redirectUrl || "/listings";
    res.redirect(redirecturl);


})

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("success","You are logged out")
        res.redirect("/listings");

    });


})

module.exports =router;







