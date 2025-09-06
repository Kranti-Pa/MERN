const mongoose=require('mongoose')

mongoose.connect("mongodb://localhost:27017/ytRegistration")
.then(()=>{
    console.log("DB Connected")
})
.catch((e)=>{
    console.log(e)
})