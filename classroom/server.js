const express = require("express");
// const mongoose = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path"); 


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


const sessionOption = session({secret:"mysupersecretstring",resave:false,saveUninitialized:true});

app.use(sessionOption);
app.use(flash());


app.use((req,res,next)=>{
    res.locals.msgs = req.flash("success");
    res.locals.error = req.flash("error");
    next();

})

app.get("/register",(req,res)=>{
    let {name='King' } = req.query;
    req.session.name = name;
    // console.log(req.session.name);
    // res.send(name);
    if(name==="King"){
        req.flash('error',"some error");
        
    }else{
        
        req.flash('success',"user registered successfully");
    } 

    res.redirect("/hello");
    
})
 
app.get("/hello",(req,res)=>{
    // res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
    // res.locals.msgs = req.flash("success");
    // res.locals.error = req.flash("error");

    res.render("page.ejs",{name:req.session.name });

    // console.log("Hello ",req.session.name);
})





// app.get("/test",(req,res)=>{
//     res.send("test success");

// })
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//      else{
//         req.session.count =  1;

//     }

//     res.send(`You sent a request ${req.session.count} times`);

// })




// app.use(cookieParser("secretcode"));


// app.get('/getcookies',(req ,res)=>{
//     res.cookie("Greet","Hello");
//     res.cookie("made in","india");
//     res.cookie("chalo","ji",{signed:true});
//     res.send("Sent you some cookies");
//     res.send("Signed cookie send");
       
// });

// app.get("/greet",(req,res)=>{
//     let {name='Raja'} = req.cookies;
//     // console.log(req.cookies);
//     console.log(req.signedCookies);
//     console.log(name);



// })

// app.get('/',(req ,res)=>{
//     console.dir(req.cookies);

//     res.send("Hi");


// });


// //USER routes
// app.get('/users',(req ,res)=>{
//     res.send("Hi");


// })
// app.get('/users/:id',(req ,res)=>{
//     res.send("Hi");


// })

// app.post('/users',(req ,res)=>{
//     res.send("Hi");


// })
// app.delete('/users/:id',(req ,res)=>{
//     res.send("Hi");


// })

 

// //POST routes
// app.get('/posts',(req ,res)=>{
//     res.send("Hi");


// })
// app.get('/posts/:id',(req ,res)=>{
//     res.send("Hi");


// }

//  npm i express-session  

app.listen(3000,()=>{
    console.log("Listing at 3000");
     
})

