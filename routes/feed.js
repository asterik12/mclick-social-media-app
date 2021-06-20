const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')


//show add page
router.get('/add', ensureAuth, async (req, res) => {
    try {
        const stories = await Story.find({ user: req.user.id})
        .populate('user')
        .lean()
        res.render('feed/add', {
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            stories
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
})


//process add form
router.post('/', ensureAuth, async (req, res) => {
    try {
        req.body.user = req.user.id
        await Story.create(req.body)
        req.flash('info', 'Posted Successfully')
        res.redirect('/profile')
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
       
        res.render('feed/index', {
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            activeUserList: req.user.displayName,
            activeUsers,
            stories,
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
        const stories = await Story.find({
            user: req.params.userId,
            status: 'public'
        })
        .populate('user')
        .lean()

        res.render('feed/index', {
            stories,
        })

    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})





module.exports = router




