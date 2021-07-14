const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


router.get('/', ensureAuth, async (req, res) => {
    const users = await User.find({_id: req.user.id})
    .populate('user')
    .populate('followers')
    .populate('Notification.notifyId')
    .sort({notifyTime: 'desc'})
    .lean()
    


    res.render('about/notifications', {
        profileimage:req.user.image,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        users,
    })
})





module.exports = router
