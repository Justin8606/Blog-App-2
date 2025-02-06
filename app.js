const Express = require("express")
const Mongoose = require("mongoose")
const Bcrypt = require("bcrypt")
const Cors = require("cors")
const Jwt = require("jsonwebtoken")

const userModel = require("./models/users")

let app = Express()
app.use(Express.json())
app.use(Cors())

// app.get("/",(req,res)=>{
//     res.send("hello")
// })

Mongoose.connect("mongodb+srv://justin:nitsuj21@cluster0.3jf2qw3.mongodb.net/blodAppDb1?retryWrites=true&w=majority&appName=Cluster0")

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

app.listen(3030,()=>{
    console.log("Server Started")
})
