const express=require('express')
const app=express()
const port=process.env.PORT||8000
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

//Greater the no. of salt rounds,more the security,but slower hashing
// const pswd="Thapa"
// const securePassword=async (password)=>{
//     const passwordHash=await bcrypt.hash(password,10)//no. of salt rounds
//     console.log(passwordHash)

//     const passwordMatch=await bcrypt.compare("thapa",passwordHash)
//     console.log(passwordMatch)
// }
// securePassword(pswd)

// bcrypt.hash(pswd,10,(err,hash)=>{
//     if(err)throw err;
//     console.log("Hashed Password:",hash)
// })
let token;
const createToken=async ()=>{
    token= await jwt.sign({_id:"68b432464c94c9fd51b8b35a"},"thisismyjsonwebtokensecretkeyorprivatekey",{
        expiresIn:"5 seconds"
    })
    console.log(token)
    const userVer=await jwt.verify(token,"thisismyjsonwebtokensecretkeyorprivatekey")
    console.log(userVer)
    
}
createToken()
app.listen(port,(req,res)=>{
    console.log(`Listening on to port:${port}`)
})