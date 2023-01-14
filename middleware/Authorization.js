
const mongoose = require('mongoose');

const PostModel = require('../model/postDatabase')

module.exports.autherizationCheck = async(req,res,next)=>{
    console.log(req.body.postId)

    let postId = (req.body.postId)
    let post = await PostModel.findOne({ _id : mongoose.Types.ObjectId(postId)})
    console.log(post)
    if(post)
    {
        if(post.createdBy == req.user.id)
        {
            console.log("Authorized User")
            next()
        }else{
            res.json({
                success : false,
                message:"No Authorization"
            })
        } 
    }else{
        res.json({
            success : false ,
            message : "No Post Found" 
        })
    }
 

}