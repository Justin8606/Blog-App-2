const Mongoose = require("mongoose")

const postSchema = Mongoose.Schema(
    {
        userId:{
            type:Mongoose.Schema.Types.ObjectId,
            ref:"users"
        },
        message:String,
        postedDate:Date
    }
)

var postModel = Mongoose.model("posts",postSchema)
module.exports = postModel