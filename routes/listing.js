const express = require("express");
const router  = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema,reviewSchema}  =require("../schema.js");
const Listing = require("../models/listing.js")
const { isLoggedIn , isOwner , validatelisting }= require("../middleware.js");

const ListingController = require("../controllers/listings.js");
const multer = require("multer");
const {storage} =require("../cloudConfig.js")
const upload = multer({storage});
// const upload = multer({dest:"uploads/"});


 
// const validatelisting =(req,res,next)=>{
//     let {error} = listingSchema.validate(req.body);
   
//     if(error){
//         let errMsg =error.details.map((el)=>el.message).join(",");

//         throw new ExpressError(400,  errMsg);

//     }else{
//         next();

//     }
// }



router.
route("/")
.get(wrapAsync(ListingController.index))

.post(isLoggedIn, 
    upload.single("listing[image]"),
    validatelisting,  
    
    ListingController.createRoute);

 
// NEW ROUTE 
router.get("/new",  isLoggedIn ,ListingController.newForm
)  

router.route("/:id")
.get( wrapAsync(ListingController.showlisting))
.put(isLoggedIn,
     isOwner, 
     upload.single("listing[image]"),
    validatelisting, 
     wrapAsync(ListingController.update))
.delete( isLoggedIn, isOwner, wrapAsync(ListingController.delete));

// /  INDEX ROUTE
// router.get("/",  wrapAsync(ListingController.index));




   // SHOW ROUTE 
// router.get("/:id", wrapAsync(ListingController.showlisting))

// Create route 

// router.post("/", isLoggedIn, validatelisting,  ListingController.createRoute);


router.get("/:id/edit",isLoggedIn, isOwner, validatelisting, wrapAsync(ListingController.editform));

// router.put("/:id",isLoggedIn, isOwner, validatelisting,  wrapAsync(ListingController.update))


// router.delete("/:id", isLoggedIn, isOwner, wrapAsync(ListingController.delete))



module.exports = router;




