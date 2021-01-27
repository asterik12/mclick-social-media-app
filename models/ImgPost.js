const mongoose = require('mongoose')

const ImgSchema = new mongoose.Schema({

    filename : {
        type : String,
        unique : true,
        required: true
    },
    contentType : {
        type: String,
        required : true
    },
    imageBase64 : {
        type : String,
        required: true
    },
    // user:{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    // },
    // createdAt:{
    //     type:String,
    //     default: Date.now,
    // }
})

module.exports = mongoose.model('UploadModel', ImgSchema)