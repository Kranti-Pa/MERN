require('dotenv').config()//Always place at very top
const express=require('express')
const app=express()
const path=require('path')
const hbs=require('hbs')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')
require('./db/conn')
const User=require('./models/registers')
const cookieParser = require('cookie-parser')
const auth=require('./middleware/auth')
const port=process.env.PORT||3000

const staticPath=path.join(__dirname,"../public")
const templates_path=path.join(__dirname,"/templates/views")


const partials_path=path.join(__dirname,"/templates/partials")
hbs.registerPartials(partials_path)

app.set("view engine","hbs")
app.set("views",templates_path)

app.use(express.static(staticPath))
app.use(express.json())//To identify json obj
app.use(express.urlencoded({extended:false}))//To get the form data 
app.use(cookieParser())
console.log(process.env.SECRET_KEY)//Get first before any app route
app.get('/',(req,res)=>{
    res.render('login')
})
app.get('/getCookies',auth,(req,res)=>{
    //Request the cookies Separately
    res.send(`Cookies:${req.cookies.jwt}`)
})
app.get('/logout',auth,async (req,res)=>{
  {//To logout on a single device
    //  req.user.tokens=req.user.tokens.filter((currEl)=>{
    //     return currEl.token!=req.token
    //  })
    //To logout from all devices
    req.user.tokens=[]
     res.clearCookie("jwt")
     console.log("logout successfully")
     res.render('login')
  }
})
//Login Check
app.post('/home',async (req,res)=>{
    try{
        const email=req.body.email;
        const pswd=req.body.password;
        const  registered=await User.findOne({email:email})
        const token=await registered.generateAuthToken()
        console.log("Token Part:"+token)
        res.cookie("jwt",token,{
            expires:new Date(Date.now()+60000),
            httpOnly:true,
            secure:true
        })
        //res.send(`Cookies:${req.cookies.jwt}`)//Gives Undefined
        const isMatch=await bcrypt.compare(pswd,registered.password)
        if(isMatch){
            res.render('home')
        }else{
            res.status(400).send("Invalid Credentials")
        }
    }catch(e){
        res.status(400).send(e)
    }
})
app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/index',async (req,res)=>{
    try{
       const password=req.body.password;
       const cpassword=req.body.confirmPassword;
       if(password===cpassword){
        const newUser=new User({
            name:req.body.name,
            email:req.body.email,
            gender:req.body.gender,
            phone:req.body.phoneNo,
            age:req.body.age,
            password:password,
            confirmPassword:cpassword
        })
        const token=await newUser.generateAuthToken()
        console.log("Token Part:"+token)

        res.cookie("jwt",token,{
            expires:new Date(Date.now()+60000),
            httpOnly:true
        })
        console.log("Cookies:",cookie)

        const registered=await newUser.save();
        res.send("Cookie has been sent")
        //res.status(201).render('index')
       }else res.send("Passwords Not Matching!!")
    }catch(e){
        res.status(400).send(e)
    }
})
app.get("/getcookie",(req,res)=>{
    console.log(req.cookies)
    res.send(req.cookies)
})
// app.get('/',(req,res)=>{
//     res.render('index',{
//         Prop:" I'm a Prop"
//     })
// })
// app.get('/',(req,res)=>{
//     res.send("Hello From Thapatechnical")
// })
app.listen(port,(req,res)=>{
    console.log(`Server listening on to port:${port}`)
})