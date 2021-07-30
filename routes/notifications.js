const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


router.get('/', ensureAuth, async (req, res) => {
    const users = await User.find({
        _id: req.user.id,
        
    })
    .populate('user')
    .populate('followers')
    .populate('Notification.notifyId')
    .sort({"Notification.notifyTime": -1})
    .lean()
    
    const notificationBadge = await User.findById(req.user.id).lean()
    .populate('user')
    .populate('requests')
    // console.log(notificationBadge)
    res.render('about/notifications', {
        profileimage:req.user.image,
        firstName:req.user.firstName,
        lastName:req.user.lastName,
        users,
        notificationBadge
    })
})

router.put('/mark-all-read', ensureAuth, async (req, res) => {
    try {
        
        await User.findOneAndUpdate(
            {_id: req.user.id,
            "Notification": {$elemMatch:{status: "unread"}},
            },
            
            {"Notification.$.status":"read",
            }
        )
        
        
        
        res.redirect('/notifications');
        
    } catch (err) {
        console.log(err)
        return res.render('error/500')
        
    }
    
})





module.exports = router
