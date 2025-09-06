const mongoose=require('mongoose')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
const employeeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    },
    gender:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    confirmPassword:{
        type:String,
        required:true
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }]
    
})

employeeSchema.methods.generateAuthToken=async function(){
    try{
         console.log(this._id)
         const token=jwt.sign({_id:this._id},process.env.SECRET_KEY)
         this.tokens=this.tokens.concat(token)
         return token;
    }catch(error){
        console.log("Error:"+error)
    }
}

employeeSchema.pre("save",async function(next){
    console.log(`Current Password:${this.password}`)
    this.password=await bcrypt.hash(this.password,10)
    console.log(`Current Password:${this.password}`)
    this.confirmPassword=undefined
    next()
})

//Create a collection
const User=new mongoose.model("Register",employeeSchema)
module.exports=User
