const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')
var ObjectID = require('mongodb').ObjectID;

router.get('/', ensureAuth, async (req, res) => {
    try {
        
        const users = await User.find({ _id: req.user.id})
        .populate('user')
        .populate('requests')
        .populate('friends')
        .lean()

        const loggedUser = await User.findById(req.user.id)
        .populate('users')
        .populate('friends')
        .lean()

        var currentUser = req.user.id
        const currentFriends = req.user.friends
        console.log(req.user.friends)
        const getUser = await User.find({
           $or:[ {_id: {
                        $nin: req.user.requests,
                        $ne: req.user.id
                    },
                },
             
            ],
            _id: {
                $nin: req.user.friends
            }
            
        })
        .lean()
        const notificationBadge = await User.findById(req.user.id).lean()
        
    
        
        res.render('friends/find_friends', {
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            users,
            getUser,
            loggedUser,
            notificationBadge
            
        })
    } catch (err) {
        console.log(err)
        return res.render('error/500')
        
    }
    
})

// process friend requests
router.put('/:userId/request', ensureAuth, async (req, res) => {
    try {
        users = await User.findById(req.params.userId);
        loggedUser = await User.findById(req.user.id); 

        if(!users.friends.includes(req.user.id) && !loggedUser.requests.includes(req.user.id)) {
            await users.updateOne({$push : {requests: req.user.id}});
        }
        else{
            await users.updateOne({$pull: {requests: req.user.id}})
        }
        
    } catch (err) {
        return res.render('error/500')
        
    }
})

// accept requests and unfriend
router.put('/:userId/accept', ensureAuth, async (req, res) => {
    try {
        users = await User.findById(req.params.userId);
        loggedUser = await User.findById(req.user.id); 

        if(!loggedUser.friends.includes(req.params.id)) {
            await loggedUser.updateOne({$push : {friends: req.params.id}});
            await users.updateOne({$push: {friends:req.user.id}});
            await loggedUser.updateOne({$pull: {requests: req.params.id}});

        }
        else{
            await loggedUser.updateOne({$pull: {friends: req.params.id}})
        }
        
    } catch (err) {
        return res.render('error/500')
        
    }
})



module.exports = router
