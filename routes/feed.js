const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')


const multer = require('multer')
const { request } = require('express')

const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/posts');
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

const storageforstories = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './public/uploads/stories');
    },
    filename: function (req, file, callback){
        callback(null, Date.now() + file.originalname);
    },
});


const uploadforstories = multer({
    storage: storageforstories,
    limits: {
        fieldSize:1024*1024*8,
    },
});





//show add page

router.get('/add', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id})
        .populate('user')
        .lean()
        res.render('feed/add', {
            name: req.user.firstName,
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            displayName:req.user.displayName,
            stories
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
})



//process add form
router.post('/', upload.single('image'), ensureAuth, async (req, res) => {
    console.log(req.file);

    try {
        
        if(req.file){
            req.body.user = req.user.id
            req.body.image = req.file.filename,
            await Story.create(req.body)
        }
        else{
            req.body.user = req.user.id
            await Story.create(req.body)
        }
        

        req.flash('info', 'Posted Successfully')
        res.redirect('back')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//process add form
router.post('/status', uploadforstories.single('storiesimage'), ensureAuth, async (req, res) => {

    try {
        

        req.body.user = req.user.id
        req.body.storiesimage = req.file.filename,
        await UStory.create(req.body)
        res.redirect('back')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//show all stories
router.get('/', ensureAuth, async (req, res) => {
   try {
       const activeUsers = await User.find({})
        .populate('user')
        .lean();
       
       const stories = await Story.find({ status: 'public'})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean();

        const timestories = await UStory.find({})
        .populate('user')
        .lean();

        res.render('feed/index', {
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            activeUserList: req.user.displayName,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            cover:req.user.cover,
            activeUsers,
            stories,
            timestories,
        })
   } catch (err) {
       console.error(err)
       res.render('error/500')
   }

})

router.get('/usersList', ensureAuth, async (req, res) =>  {
    const activeUsers = await User.find({})
        .populate('user')
        .lean();
        
        res.render('feed/usersList', {
            displayName:req.user.displayName,
            activeUsers,
        })

});

//show single story
router.get('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id)
        .populate('user')
        .lean()

        if(!story){
            return res.render('error/404')
        }
        res.render('feed/show', {
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            
            story
        })
    } catch (err) {
        console.error(err)
        res.render('error/404')
    }
})



//show edit page
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try {
        const story = await Story.findOne({
            _id: req.params.id
        }).lean()
    
        if(!story){
            return res.render('error/404')
        }
        
        if(story.user != req.user.id){
            res.redirect('/stories')
        } else {
            res.render('feed/edit',{
                firstName:req.user.firstName,
                lastName:req.user.lastName,
                name: req.user.firstName,
                profileimage:req.user.image,
                displayName:req.user.displayName,
                story,
            })
        }
        
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
    
})

//update stories
router.put('/:id', ensureAuth, async (req, res) => {
    try {
        let story = await Story.findById(req.params.id).lean() 

        if(!story){
            return res.render('error/404')
        }
        if(story.user != req.user.id){
            res.redirect('/feed')
        } else {
            story = await Story.findOneAndUpdate({ _id: req.params.id}, req.body, {
                new: true,
                runValidators: true
            })
            req.flash('info', 'Post Updated Successfully')
            res.redirect('/profile')
        }
        
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
    
})

//likes dislikes
router.put('/:id/like', ensureAuth, async (req, res) => {
    try {
        const post = await Story.findById(req.params.id);
        
        if(!post.likes.includes(req.user.id)) {
            await post.updateOne({$push : {likes: req.user.id}});
           
        } 
        else{
            await post.updateOne({$pull: { likes: req.user.id}});
        }
        res.redirect('back')
    } catch (err) {
        return res.render('error/500');
    }
})


//stories delete
router.delete('/:id', ensureAuth, async (req, res) => {
    try {
         await Story.remove({_id: req.params.id})
         req.flash('info', 'Post Deleted Successfully')
         res.redirect('/profile')
    } catch (err) {
        console.error(err)
        return res.render('error/500')
    }
})

//users stories user:id
router.get('/user/:userId', ensureAuth, async (req, res) => {
    try {
        const users = await User.find({ _id: req.params.userId})
        .populate('user')
        .lean()

        const stories = await Story.find({ user: req.params.userId, status:'public'})
        .populate('user')
        .lean()
        const timestories = await UStory.find({user: req.params.userId})
        .populate('user')
        .lean();
        res.render('users/users_profile', {
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            stories,
            timestories,
            users,
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})


//profile- photos
router.get('/user/photos/:userId', ensureAuth, async (req,res) => {
    try {
        const users = await User.find({ _id: req.params.userId})
        .populate('user')
        .lean()

        const stories = await Story.find({ user: req.params.userId})
        .populate('user')
        .sort({ createdAt: 'desc' })
        .lean()

        const timestories = await UStory.find({user: req.params.userId})
        .populate('user')
        .lean();

        res.render('about/photosforall', {
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            users,
            stories,
            timestories
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
    
   
})


module.exports = router
