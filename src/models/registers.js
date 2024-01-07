const mongoose=require('mongoose')
const bcrypt = require('bcryptjs')

const EmployeeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required: true,
        unique:true
    },
    gender:{
        type:String,
        required:true 
    },
    mobile:{
        type:Number,
        required: true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    confirmpassword:{
        type:String,
        required:true
    }
})

EmployeeSchema.pre("save",async function(next){
    if(this.isModified("password")){
    // console.log(`your current password is ${this.password}`)
    this.password=await bcrypt.hash(this.password,10)
    //console.log(`your current password is ${this.password}`)

    this.confirmpassword=undefined
    }
    next()
})


const Register = new mongoose.model("Register",EmployeeSchema)
module.exports = Register;