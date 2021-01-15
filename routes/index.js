const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')


//Landing page
router.get('/', ensureGuest, (req, res) => {
    res.render('login', {
        layout: 'login'
    })
})

//Dashboard
router.get('/dashboard', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({ user: req.user.id})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
        res.render('dashboard', {
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            messages:req.flash('info'),
            stories
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
    
   
})
module.exports = router