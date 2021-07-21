const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')



router.get('/', ensureAuth, async (req,res) => {
    try {
        
        const notificationBadge = await User.findById(req.user.id).lean()

        res.render('chat/chat', {
            notificationBadge,
        })
    } catch (err) {
        console.log(err);
        return res.render('error/500')
    }
})


module.exports = router