let User =require("../models/user.js");

module.exports.signup = async(req,res)=>{
    try{
        let {username,email,password} =req.body;
        const newUser =  new User({email,username});
       const registerUser = await User.register(newUser,password);
       
       console.log(registerUser);
       req.login(registerUser,(err)=>{
        if(err){
            return next(err)
         }
         req.flash("success","You are logged in");
         res.redirect("/listings");


       });
    //    req.flash("success","Welcome");
    //    res.redirect("/listings");

    }     
    catch(e){
        req.flash("err",e.message);
        res.redirect("/signup");

    }
}