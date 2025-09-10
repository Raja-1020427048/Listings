
require("dotenv").config();
if(process.env.NODE_ENV != "production"){

}
console.log(process.env.SECRET);


const express = require("express");
const mongoose = require("mongoose");
// const Listing = require("./models/listing.js")
const ejsMate = require("ejs-mate");
// const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js")
const {listingSchema,reviewSchema}  =require("./schema.js");

const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const usersRouter = require("./routes/user.js");

const flash = require("connect-flash");

const session = require("express-session");
const MongoStore = require("connect-mongo");


const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./models/user.js");



const app = express();
const override = require("method-override")
const path = require("path"); 

app.set("views",path.join(__dirname,"views"));
app.set("view engine","ejs");

app.use(express.static(path.join(__dirname, "public" )));
app.use(express.urlencoded({extended:true}));
app.use(override("_method"));
app.engine('ejs',ejsMate);

// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

const dbUrl = process.env.ATLASDB_URL;


main().then(()=>{
    console.log("connection success");
})
.catch(err=>console.log(err));

async function main(){
    
    // await mongoose.connect(MONGO_URL);    // test database
    await mongoose.connect(dbUrl);    // test database
}



const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        // secret:"mysupersecret",
        secret:process.env.SECRET,

    },
    touchAfter:24*3600,

});

store.on("error",(err)=>{
    console.log("Error in Mongo session ",err);
});



const sessionOptions  = { 
    store,
    // secret:"mysupersecret",
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }

}




app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

 



app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.del=req.flash("del");
    res.locals.err=req.flash("err");
    res.locals.currUser = req.user;
    // console.log(res.locals.success);
    next();
})

 

// app.get("/testlisting", async(req,res)=>{
//     let sampleListing = new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:485,
//         location:"Delhi",
//         country:"India",

//     })
//     await sampleListing.save();
//     console.log("Sample")
//     res.send("successful");



// })   



// const validatelisting =(req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
   
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400,  errMsg);

//     }else{
//         next();

//     }
// }
// const validatereview =(req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
   
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400,  errMsg);

//     }else{
//         next();

//     }
// }




// //  INDEX ROUTE
// app.get("/listings",  wrapAsync(async(req,res)=>{
//     const  allListings  = await  Listing.find({});
    
//     res.render("listings/index",{ allListings});



// }));


// app.get("/",(req,res)=>{
//     res.render("listings/home")
// })


// // NEW ROUTE 
// app.get("/listings/new",(req,res)=>{
//     res.render("listings/new.ejs")

// })





// // SHOW ROUTE 
// app.get("/listings/:id", wrapAsync(async (req,res)=>{
//     let {id} = req.params;
//     let singlelist =  await Listing.findById(id).populate("reviews");
//     // console.log(singlelist);
//     // console.log("id success");
    
//     res.render("listings/show.ejs",{singlelist});


// }))



// // Create route 

// app.post("/listings", validatelisting,  async (req,res,next)=>{
//     // let {title, description,image,price,location,country}  = req,body;
//     // let listing = req.body.listing;

//     // new Listing(listing);
     
    
//         // if(!req.body.listing){
//         //     throw  new ExpressError(404,"Error ji")
//         // }
//         // const newlist =  new Listing(req.body.listing);
        
//         // await newlist.save();
     
//         // res.redirect("/listings");

    




//         try{
//         //     let result = listingSchema.validate(req.body);
//         // // console.log(result);
//         // if(result.error){
//         //     throw new ExpressError(400,result.error);

//         // }

//         const newlist =  new Listing(req.body.listing);
//         await newlist.save();
        
//         res.redirect("/listings");
        
//         // if(!newlist.description){
//             // if(!req.body.listing){
//                 //     throw  new ExpressError(404,"Error ji")
//                 // }
//                 //     throw  new ExpressError(404,"Description Missing")
                
//                 // }
//                 // if(!newlist.title){
//                     //     throw  new ExpressError(404,"Title Missing")
                    
//                     // }
//                     // if(!newlist.location){
//                         //     throw  new ExpressError(404,"Location Missing")
                        
//                         // }
                        
                        
//                     }catch(err){
//                         next(err);
//     }

//     // console.log(listing);


// });








// app.get("/listings/:id/edit", validatelisting, wrapAsync(async(req,res)=>{
//     let {id} = req.params;
//     let singlelist =  await Listing.findById(id);
//     res.render("listings/edit.ejs",{singlelist});


// }));

// app.put("/listings/:id", validatelisting,  wrapAsync(async (req,res)=>{
//     if(!req.body.listing){
//         throw  new ExpressError(404,"Error ji")
//     }

//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//     res.redirect(`/listings/${id}`);

// }))


// app.delete("/listings/:id", wrapAsync(async(req,res)=>{
//     let {id } = req.params;
//     let delteList = await Listing.findByIdAndDelete(id);
//     res.redirect("/listings");
// }))


app.get("/demouser",async(req,res)=>{
    let fakeuser = new User({
        email:"sjdgfyu@gmail.com",
        username:"djshue",

    })
    
    let registerUser = await User.register(fakeuser,"helloworld");
    res.send(registerUser);


})

app.use("/listings",listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);

app.use("/",usersRouter);






// // reviews post route
// app.post("/listings/:id/reviews",  validatereview,  wrapAsync(async(req,res)=>{
//      let listing = await Listing.findById(req.params.id);
//      let newReview = new Review(req.body.review);
     
//      listing.reviews.push(newReview);
//      await newReview.save();
//      await listing.save();

//     //  console.log(newReview);
//     //  res.send("New review saved");
//     res.redirect(`/listings/${listing._id}`);


// }));



// //Delete review route

// app.delete("/listings/:id/reviews/:reviewId",wrapAsync(async(req,res)=>{
//     let {id, reviewId} = req.params;
//     await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
//     await Review.findByIdAndDelete(reviewId);
    
//     res.redirect(`/listings/${id}`);

// }));





// app.all("*",(err,req,res,next)=>{
//     next( ExpressError(404, "Page Not Found!"));
// });


 
app.use((err,req,res,next)=>{
    let {status=500, message="Error"} = err;

    // res.send("something wrong");
    // res.status(status).send(message);
    // res.render("error.ejs",{err,status});
    res.status(status).render("error.ejs",{err,status});
    
})





app.listen(8080,()=>{
    console.log("running now this is it");

})