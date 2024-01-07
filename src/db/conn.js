const mongoose=require('mongoose')
mongoose.connect("mongodb://localhost:27017/RegistrationForm",{
    
}).then(()=>{
    console.log(`Connection Sucessfull`)
}).catch((e)=>{
    console.log(`No Conenction`)
})