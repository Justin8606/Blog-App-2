const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const Jwt = require("jsonwebtoken")

const userModel = require("./models/users")
const postModel = require("./models/posts")

let app = Express()
app.use(Express.json())
app.use(Cors())

// app.get("/",(req,res)=>{
//     res.send("hello")
// })

Mongoose.connect("mongodb+srv://justin:nitsuj21@cluster0.3jf2qw3.mongodb.net/blodAppDb1?retryWrites=true&w=majority&appName=Cluster0")


// Sign Up
app.post("/signup",(req,res)=>{
    // let data = req.body
    let input = req.body
    let hashedPassword = Bcrypt.hashSync(req.body.password,10)
    console.log(hashedPassword)
    req.body.password=hashedPassword
    // console.log(input)
    // res.send(data)

    // userModel.find({email:req.body.email}, async(error,data)=>{

    // }) // callback is not allowed in find



    // let check = userModel.find({email:req.body.email})
    // console.log(check)

    userModel.find({email:req.body.email}).then(
        (items)=>{
            // console.log(items)
                if(items.length>0) {
        res.json({"status":"email Id already exists"})
    }
    else{

        let result = new userModel(input)
        result.save()
        res.json({"status":"success"})
    }

        }
    ).catch(
        (error)=>{}
    )
    // if(check.length>0) {
    //     res.json({"status":"email Id already exists"})
    // }
    // else{

    //     let result = new userModel(input)
    //     result.save()
    //     res.json({"status":"success"})
    // }

})


// Sign In

app.post("/signIn",async(req,res)=>{

    let input = req.body
    let result = userModel.find({email:req.body.email}).then(

            (items)=>{
                if (items.length>0) {
                    const passwordValidator = Bcrypt.compareSync(req.body.password,items[0].password)

                    if (passwordValidator) {
                        Jwt.sign({email:req.body.email},"blogApp",{expiresIn:"1d"},
                            (error,token)=>{
                                if (error) {
                                    res.json({"status":"error","errorMessage":error})
                                } else {
                                    res.json({"status":"success","token":token,"userId":items[0]._id})
                                }
                            }
                        )
                    } else {
                        res.json({"status":"Incorrect password"})
                    }
                } else {
                    res.json({"status":"Invalid Email Id"})
                }
            }
        
    ).catch()
})


// create a post
app.post("/create",async(req,res)=>{
    let input = req.body
    let token = req.headers.token

    Jwt.verify(token,"blogApp",async(error,decoded)=>{
        if(decoded && decoded.email){
            let result = new postModel(input)
            await result.save()
            res.json({"status":"success"})
        }
        else{
            res.json({"status":"Invalid Authentication"})
        }
    })

})

// View All

app.post("/viewall",(req,res)=>{
    let token = req.headers.token
    Jwt.verify(token,"blogApp",(error,decoded)=>{
        if (decoded && decoded.email) {
            postModel.find().then(
                (items)=>{
                    res.json(items)
                }
            ).catch(
                (error)=>{
                    res.json({"status":"error"})
                }
            )
        } else {
            res.json({"status":"Invalid Authentication"})
        }
    })
})

app.listen(3030,()=>{
    console.log("Server Started")
})
