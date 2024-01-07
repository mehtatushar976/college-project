const mongoose = require('mongoose')

const RoomateSchema = new mongoose.Schema({
        name:{
            type:String,
            required:true
        },
        age:{
            type:Number,
            required:true
        },
        gender:{
            type:String,
            required:true 
        },
        study:{
            type:String,
            required:true
        },
        number:{
            type:Number,
            required:true
        },
        area:{
            type:String,
            required:true
        }
})

const Roomate = new mongoose.model("Roomate",RoomateSchema)
module.exports=Roomate