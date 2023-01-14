const { hashSync, compareSync } = require('bcrypt');
var express = require('express');
const UserModel = require('../model/database')
const PostModel = require('../model/postDatabase')
const jwt = require('jsonwebtoken');
const passport = require('passport')
require('../config/passport')

module.exports.register = (req, res) => {

    UserModel.create({
        username: req.body.username,
        password: hashSync(req.body.password, 10)
    }).then(user => {
        res.json({
            success: true,
            message: "User Created successfully",
            user: {
                id: user._id,
                username: user.username
            }
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: `User registration failed ${err.message}`,
            error: err
        })
    })
}

module.exports.login = (req, res) => {
    UserModel.findOne({ username: req.body.username }).then((user) => {
        if (!user) {
            res.status(401).json({
                success: false,
                message: "Could not find the user"
            })
        } else {
            if (!compareSync(req.body.password, user.password)) {
                res.status(401).json({
                    success: false,
                    message: "Incorrect password"
                })
            } else {
                const payload = {
                    username: user.username,
                    id: user._id
                }
                const token = jwt.sign(payload, "Knovator", { expiresIn: "1d" })

                res.status(200).json({
                    success: true,
                    message: "Login Successful",
                    token: "Bearer " + token
                })
                // res.redirect("/home")
            }
        }
    })
}

module.exports.home = async (req, res) => {
    let posts = await PostModel.find({})
    console.log(posts)
    res.status(200).json({
        success: true,
        user: {
            id: req.user._id,
            username: req.user.username
        },
        posts

    })
}

module.exports.createPost = (req, res) => {
    const { title, body, status, location } = req.body;
    const createdBy = req.user
    console.log(createdBy)
    const post = PostModel({
        title,
        body,
        createdBy,
        status,
        location
    })
    console.log(post)
    post.save().then(post => {
        res.json({
            success: true,
            message: "Post Created successfully",
            post: {
                id: post._id,
            }
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: "Post creation failed",
            error: err.message
        })
    })
}


module.exports.deletePost = async (req, res) => {
    let postId = req.body.postId
    console.log(postId)
    PostModel.deletePost(postId).then(() => {
        res.json({
            success: true,
            message: "Post Deleted",

        })
    }).catch((err) => {
        res.json({
            success: false,
            message: "Post deletion failed",
            error: err.message
        })
    })

}

module.exports.editPost = (req, res) => {
    let postId = req.body.postId
    console.log(postId)
    PostModel.editPost(postId, req.body.obj).then((data) => {
        res.json({
            success: true,
            message: "Post Edited",
            data: data
        })
    }).catch((err) => {
        res.json({
            success: false,
            message: "Post editing failed",
            error: err.message
        })
    })
}

module.exports.locationPost = (req, res) => {
    try{
    const { lon, lat } = req.body
    console.log(req.body)
    PostModel.find({ $and: [{ 'location.lat': lat }, { 'location.lon': lon }] }).then((data) => {
        console.log(data)
        res.json({
            success: true,
            message: "Success" ,
            data : data
        })
    }).catch((err) => {
        console.log(err)
        res.json({
            success: false,
            message: "Failed" ,
            error : err
        })
    })}
    catch(err){
        console.log(err)
        res.json({
            success: false,
            message: "Failed" ,
            error : err
        })
    }
}

module.exports.dashboard = async(req,res)=>{
    let status = await PostModel.aggregate([
        {
            $group :{
                '_id': "$status" , 'count' : {$sum : 1 }
            }
        }

    ])
    res.json({
        "Active" : status[0].count,
        "InActive" : status[1].count
    })
    console.log(status) 

}