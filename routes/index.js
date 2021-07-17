const express = require('express')
const router = express.Router()
const { ensureAuth, ensureGuest } = require('../middleware/auth')

const Story = require('../models/Story')
const User  = require('../models/User')
const UStory = require('../models/UStory')

//update image multer

const multer = require('multer')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/user');
    },
    filename: function (req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});


const upload = multer({
    storage: storage,
    limits: {
        fieldSize:1024*1024*8,
    },
});

//cover photo
const storageforcover = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/user/cover');
    },
    filename: function (req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});


const uploadforcover = multer({
    storage: storageforcover,
    limits: {
        fieldSize:1024*1024*8,
    },
});



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
        .populate('likes')
        .sort({ createdAt: 'desc' })
        .lean()

        const GuestUser = await User.findById(req.user.id).lean()
        
        const users = await User.find({ _id: req.user.id})
        .populate('user')
        .populate('friends')
        .populate('requests')
        .populate('following')
        .populate('followers')
        .lean()
        
        const timestories = await UStory.find({user: req.user.id})
        .populate('user')
        .lean();
        const notificationBadge = await User.findById(req.user.id).lean()

        

        res.render('profile', {
            name: req.user.firstName,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            gender:req.user.gender,
            dob:req.user.dob,
            firstName: req.user.firstName,
            profileimage:req.user.image,
            lastName:req.user.lastName,
            email:req.user.email,
            current_city:req.user.current_city,
            hometown:req.user.hometown,
            work:req.user.work,
            hobbies:req.user.hobbies,
            degree:req.user.degree,
            school:req.user.school,
            branch:req.user.branch,
            createdAt:req.user.createdAt,
            cover:req.user.cover,
            userID:req.user.id,
            followers:req.user.followers,
            messages:req.flash('info'),
            stories,
            timestories,
            users,
            GuestUser,
            notificationBadge
            
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
    
   
})

router.get('/editProfile/:id', ensureAuth, async (req, res) => {
    try{
        
        
        if(req.params.id != req.user.id){
            res.redirect('/')
        } 
        else{
        const notificationBadge = await User.findById(req.user.id).lean()
           
            res.render('about/editProfile', {
                gender:req.user.gender,
                dob:req.user.dob,
                firstName: req.user.firstName,
                profileimage:req.user.image,
                lastName:req.user.lastName,
                email:req.user.email,
                current_city:req.user.current_city,
                hometown:req.user.hometown,
                work:req.user.work,
                hobbies:req.user.hobbies,
                degree:req.user.degree,
                school:req.user.school,
                branch:req.user.branch,
                cover:req.user.cover,
                notificationBadge,
            })
        }
        
    }
    catch(err){
        console.error(err)
        res.render('error/505')
    }
})


// update profile
router.post('/editProfile/:id', upload.single('image'),  ensureAuth, async (req, res) => {
    try {
        
        if(req.params.id != req.user.id){
            res.redirect('/')
        } 
        else{
            if(req.file){
                req.body.image = req.file.filename
                await User.findOneAndUpdate({ _id: req.params.id}, req.body)
                
            }
            else{
                await User.findOneAndUpdate({ _id: req.params.id}, req.body)

            }
            
            res.redirect('back')
        }
        
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

router.get('/cover/:id', ensureAuth, async (req, res) => {
    try{
        
        
        if(req.params.id != req.user.id){
            res.redirect('/')
        } 
        else{
        const notificationBadge = await User.findById(req.user.id).lean()
           
            res.render('about/cover', {
                profileimage:req.user.image,
                firstName:req.user.firstName,
                cover:req.user.cover,
                notificationBadge
            })
        }
        
    }
    catch(err){
        console.error(err)
        res.render('error/505')
    }
})

router.post('/cover/:id', uploadforcover.single('cover'), ensureAuth, async (req, res) => {
    try {
        
        if(req.params.id != req.user.id){
            res.redirect('/')
        } 
        else{
            if(req.file){
                req.body.cover = req.file.filename
                await User.findOneAndUpdate({ _id: req.params.id}, req.body)
                
            }
            else{
                await User.findOneAndUpdate({ _id: req.params.id}, req.body)

            }
            
            res.redirect('back')
        }
        
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//profile- photos
router.get('/profile/photos', ensureAuth, async (req,res) => {
    try {
        
        const stories = await Story.find({ user: req.user.id})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        const timestories = await UStory.find({user: req.user.id})
        .populate('user')
        .lean();
        const notificationBadge = await User.findById(req.user.id).lean()


        res.render('about/photos', {
            name: req.user.firstName,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            gender:req.user.gender,
            dob:req.user.dob,
            firstName: req.user.firstName,
            profileimage:req.user.image,
            lastName:req.user.lastName,
            email:req.user.email,
            current_city:req.user.current_city,
            hometown:req.user.hometown,
            work:req.user.work,
            hobbies:req.user.hobbies,
            degree:req.user.degree,
            school:req.user.school,
            branch:req.user.branch,
            createdAt:req.user.createdAt,
            cover:req.user.cover,
            id:req.user.id,
            messages:req.flash('info'),
            stories,
            timestories,
            notificationBadge
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
    
   
})

module.exports = router;