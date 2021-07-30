const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


router.get('/', ensureAuth, async (req, res) => {
    
    const notificationBadge = await User.findById(req.user.id).lean()

    const allusers = await User.find({}).lean()
    


    res.render('about/events', {
        profileimage:req.user.image,
        firstName:req.user.firstName,
        lastName: req.user.lastName,
        allusers,
        notificationBadge
    })
})





module.exports = router
