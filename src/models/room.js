const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    number:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required: true
    }
})

const Room=new mongoose.model("Room",roomSchema)
module.exports=Room;