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

//profile
router.get('/profile', ensureAuth, async (req,res) => {
    try {
        const stories = await Story.find({ user: req.user.id})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()
        res.render('profile', {
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

router.get('/editProfile', ensureAuth, async (req, res) => {
    try{

        res.render('about/editProfile', {
            firstName: req.user.firstName,
            profileimage:req.user.image,
            lastName:req.user.lastName,
            email:req.user.email,
        })
    }
    catch(err){
        console.error(err)
        res.render('error/505')
    }
})

// update profile
router.put('/editProfile', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        res.redirect('about/editProfile')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})
module.exports = router;