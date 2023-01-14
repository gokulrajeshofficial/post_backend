const mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var postSchema = new Schema({
    title: {
        type: String,
        required: [true, " Title is required"]
    },
    body: {
        type: String,
        required: [true, "Body is required"]
    },
    createdBy: ObjectId,
    status: {
        type: String,
        default: "Active"
    },
    location: {
        type: Object,
        required: [true, "Location is required"]
    },

})
postSchema.statics.deletePost = async function (postId) {

    postId = mongoose.Types.ObjectId(postId);
    this.deleteOne({ _id: postId }).then((data) => {
        console.log(data)
        return data
    })

}
postSchema.statics.editPost = async function (postId , obj) {
    console.log(obj)
    postId = mongoose.Types.ObjectId(postId);
    this.findOne({ _id: postId }).then((post) => {
        if (post) {
            this.updateOne({ _id: postId }, {
                $set: {
                    title : obj.title,
                    body  : obj.body,
                    status : obj.status
                }
            }).then((data)=>{
                console.log(data)
            }).catch((e)=>{
                console.error(e) 
            })
        }

    }).catch((err) => {
        console.error(err)
        return err
    })

}


const PostModel = mongoose.model('Post', postSchema)
module.exports = PostModel;

