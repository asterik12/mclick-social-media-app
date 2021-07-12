const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


router.get('/', ensureAuth, async (req, res) => {
    const friends = await User.find({_id: {$ne: req.user.id}})
    .lean()
    


    res.render('friends/find_friends', {
        profileimage:req.user.image,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        friends,
    })
})





module.exports = router
