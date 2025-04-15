
const express = require("express");
const router  = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
// const Review = require("../models/review.js")
const ExpressError = require("../utils/ExpressError.js");
// const Listing = require("../models/listing.js")
const {validatereview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const {listingSchema,reviewSchema}  =require("../schema.js");

const reviewController = require("../controllers/reviews.js");


const validatelisting =(req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        let errMsg =error.details.map((el)=>el.message).join(",");

        throw new ExpressError(400,  errMsg);

    }else{
        next();

    }
}

// const validatereview =(req,res,next)=>{
//     let {error} = reviewSchema.validate(req.body);
   
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400,  errMsg);

//     }else{
//         next();

//     }
// }


// reviews post route
router.post("/", isLoggedIn, validatereview,   wrapAsync(reviewController.createReview));

//Delete review route

router.delete("/:reviewId",  isLoggedIn, isReviewAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;











