require("dotenv").config()
const express=require("express")

const passport=require("passport")
const LocalStrategy=require("passport-local")
const flash=require('connect-flash')
const mongoose=require("mongoose")
const session=require("express-session")
const { Holdingdata, Watchlistdata, Buystockdata, Logindata } = require("./schema/dashboardschema")
const PORT=process.env.PORT||8000
const url=process.env.MDB_URL

const cors=require("cors")
const bodyparser=require("body-parser")
const CustomError = require("./util/CustomError")
const wrapasync = require("./util/wrapasync")


let app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));
 app.use(bodyparser.json())

app.use(flash())
app.use(session({
    secret:"mysec",
    resave:false,
    saveUninitialized:true,
     cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    }
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(Logindata.authenticate()))
passport.serializeUser(Logindata.serializeUser())
passport.deserializeUser(Logindata.deserializeUser())

app.get("/addholding",async(req,res,next)=>{
let newholdingdata= new Holdingdata({
    name:"arjun",
        qty:123,
        avg:233,
        price:7372,
        net:"0.56%",
        day:"+2.99%",
        isLoss:true
})
await newholdingdata.save()

res.send("done!!")

})
app.get("/displayholding",wrapasync(async(req,res,next)=>{
    let holding=await Holdingdata.find({})
    res.json(holding)
}))
app.post("/buystock",wrapasync(async(req,res,next)=>{
   
    let{name,qty,price}=req.body
    let newdata= new Buystockdata({
        name,
        qty,
        price
    })
  console.log(name)
  let show=await  newdata.save()
  console.log(show)
  console.log("done")
 res.json({
    message:"datasaved",
    status:200,
    
 })
}))
app.post("/signup", wrapasync(async(req,res,next)=>{
    console.log("signup hit")
 let username=req.body.username;
    let password=req.body.password
    let newdata=new Logindata({username})
   let newuser= await Logindata.register(newdata,password)
   console.log(newuser)

    req.logIn(newuser,(err)=>{
        if(err){
            res.status(500).res.json({errmessage:err.message})
             console.log(err)
        }else{
res.json({islogged:true,
        message:"saved,loggedin",
        user:req.user
        
    })
     console.log("LOGIN SUCCESS");
        console.log("req.user:", req.user);
        console.log("req.session:", req.session);
        }
    })
    
}))
app.post("/authenticate",(req,res)=>{
    console.log("AUTHENTICATE ROUTE");
    console.log("SESSION:", req.session);
    console.log("USER:", req.user);
    console.log("AUTHENTICATED:", req.isAuthenticated());
    if(req.isAuthenticated()){
        console.log("authenticated")
       return res.json({islogged:true,user:req.user})
    }else{
        res.json({islogged:false,errmessage:"not logged in yet",})
    }
})
app.post("/login",passport.authenticate("local",{
    failureRedirect:"/login",failureFlash:true
}),wrapasync(async(req,res,next)=>{
   res.json({message:"loggedin",islogged:true,user:req.user})
    console.log("LOGIN SUCCESS");
        console.log("req.user:", req.user);
        console.log("req.session:", req.session);

}))
app.get("/logout",wrapasync(async(req,res,next)=>{
    req.logOut(function(err){
        if(err){
            console.log(err)
        }
        res.json({message:"loggedout"})
    })
}))
app.use((req,res,next)=>{
    next(new CustomError(404,"not available/ randome page"))
})
app.use((error,req,res,next)=>{
    let {StatusCode=500,message="something went wrong"}=error
    res.status(StatusCode).json({
        errmessage:message
    })
})

app.listen(PORT,()=>{
    console.log("running")
   
    mongoose.connect(url)
})