const Listing = require("../models/listing");


module.exports.index = async(req,res)=>{
    const  allListings  = await  Listing.find({});
    
    res.render("listings/index",{ allListings});



};

module.exports.newForm =(req,res)=>{
    // console.log(req.user); 
    // if(!req.isAuthenticated()){
    //     req.flash("err","You must be logged in ")
    //    return  res.redirect("/login");


    // }
     res.render("listings/new.ejs")

};

module.exports.showlisting = async (req,res)=>{
    let {id} = req.params;
    let singlelist =  await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
    },
}).populate("owner"); 
    // console.log(singlelist);
    // console.log("id success");
    if(!singlelist){
        req.flash("err","Listing does not exist");
        res.redirect("/listings");

    }
    
    res.render("listings/show.ejs",{singlelist});


};

module.exports.createRoute = async (req,res,next)=>{
    try{ 
        let url = req.file.path;
        let filename =req.file.filename;
        console.log(url, " ", filename);

       const newlist =  new Listing(req.body.listing);
        // console.log(req.user);

        newlist.owner= req.user._id;
        newlist.image = {url,filename};
        await newlist.save();
        req.flash("success","New list created");
        res.redirect("/listings");
    }
    catch(err){
        next(err);
    }
};



module.exports.editform = async(req,res)=>{
    let {id} = req.params;
    let singlelist =  await Listing.findById(id);
    let originalImageUrl = singlelist.image.url;
    originalImageUrl =   originalImageUrl.replace("/upload","/upload/h_300,w_250");
    res.render("listings/edit.ejs",{singlelist,originalImageUrl});


};

module.exports.update = async (req,res)=>{
    if(!req.body.listing){
        throw  new ExpressError(404,"Error ji")
    }

    let {id} = req.params;


    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename =req.file.filename;
        listing.image = {url , filename};
        await listing.save();

    }
    res.redirect(`/listings/${id}`);

};

module.exports.delete = async(req,res)=>{
    let {id } = req.params;
    let delteList = await Listing.findByIdAndDelete(id);
    req.flash("del"," List deleted");
    res.redirect("/listings");
};
