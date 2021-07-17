const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Videos = require('../models/Videos')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


const multer = require('multer')
const { request } = require('express')

const videostorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/videos');
    },
    filename: function (req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});


const videoupload = multer({
    storage: videostorage,
    limits: {
        fieldSize:1024*1024*8,
    },
});
//process add form
router.post('/', videoupload.single('video'), ensureAuth, async (req, res) => {
    console.log(req.file);

    try {
        
        if(req.file){
            req.body.user = req.user.id
            req.body.video = req.file.filename,
            await Videos.create(req.body)
        }
        else{
            req.body.user = req.user.id
            await Videos.create(req.body)
        }
        

        res.redirect('back')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/', ensureAuth, async (req,res) => {
    const stories = await Videos.find({ status: 'public'})
        .populate('user')
        .populate('likes')
        .sort({ createdAt: 'desc' })
        .lean();
        const notificationBadge = await User.findById(req.user.id).lean()


    res.render('feed/videos.hbs', {
        profileimage:req.user.image,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        cover:req.user.cover,
        stories,
        notificationBadge
    })
})


module.exports = router;