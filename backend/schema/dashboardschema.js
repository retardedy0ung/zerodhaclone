const mongoose=require("mongoose");
const { default: passportLocalMongoose } = require("passport-local-mongoose");
const schema= mongoose.Schema;

const HoldingSchema=new schema({
 name:String,
        qty:Number,
        avg:Number,
        price:Number,
        net:String,
        day:String,
        isLoss:Boolean
})

const Holdingdata=mongoose.model("Holdingdata",HoldingSchema)

const PositionSchema=new  schema({
    product:String,
        name:String,
        qty:Number,
        avg:Number,
        price:Number,
        net:String,
        day:String,
        isLoss:Boolean
})
const Positiondata=mongoose.model("Positiondata",PositionSchema)

const WatchlistSchema= new schema({
    name:String,
    price:Number,
    percent:String,
    isDown:Boolean
})
const Watchlistdata=mongoose.model("watchlistdata",WatchlistSchema)

const Buystockschema=new schema({
    name:String,
    qty:Number,
    price:Number,
})
const Buystockdata=mongoose.model("Buystockdata",Buystockschema)
const loginschema=new schema({})
loginschema.plugin(passportLocalMongoose)
const Logindata=mongoose.model("Logindata",loginschema)
module.exports={Holdingdata,Positiondata,Watchlistdata ,Buystockdata,Logindata}