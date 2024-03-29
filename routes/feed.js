const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')
const includes = require('array-includes')

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





//process add form
router.post('/', upload.single('image'), ensureAuth, async (req, res) => {
    console.log(req.file);

    try {
        
        if(req.file){
            req.body.user = req.user.id
            req.body.image = req.file.filename,
            req.body.firstName = req.user.firstName,
            req.body.lastName = req.user.lastName,
            req.body.userImage = req.user.image,
            req.body.userId = req.user._id,
            await Story.create(req.body)
        }
        else{
            req.body.user = req.user.id
            req.body.firstName = req.user.firstName,
            req.body.lastName = req.user.lastName,
            req.body.userImage = req.user.image,
            req.body.userId = req.user._id,
            await Story.create(req.body)
        }
        

        // req.flash('info', 'Posted Successfully')
        res.redirect('back')
    } catch (err) {
        console.error(err)
        res.render('error/500')
    }
})

//share post
router.put('/share/:id/:userId', ensureAuth, async (req, res) => {

    try {
        
        
            req.body.user = req.user.id
            req.body.getShared = req.params.id
            req.body.postUser = req.params.userId
            req.body.status = "public"
            req.body.body = "shared a post"


            await Story.create(req.body)


        const post = await Story.findById(req.params.id);
        const users = await User.findById(req.params.userId);
        const message = " shared your post"
        await post.updateOne({$push : {share: req.user.id}});
        await users.update({
            $push: 
                {"Notification": 
                    {
                        notifyId: req.user.id,
                        notificationBody : message,
                        notifyTime: Date.now(),
                        postId: req.params.id,
                        status: "unread",
                        method: "share",
                    },
                    
                }
            })
        
        

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
    //    console.log(req.user.following)
       const stories = await Story.find({ 
           status: 'public',
           
               $or: [
                   {user:req.user.following},
                    {user: req.user.friends},
                {user: req.user.id}]
        
        })
        .populate('user')
        .populate('likes')
        .populate('postUser')
        .populate('getShared')
        .sort({ createdAt: 'desc' })
        .lean();

       const profile_image = await User.find({})
       .lean();

        const notificationBadge = await User.findById(req.user.id).lean()
        .populate('user')
       

        const timestories = await UStory.find({
            user: {
                $ne: req.user.id
            }
        })
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean();

        const mytimestories = await UStory.find({user: req.user.id})
        .populate('user')
        .sort({createdAt: 'desc'})
        .lean();

        const loggedUser = await User.find({_id: req.user.id})
        .populate('followers')
        .populate('friends')
        .lean()

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
            mytimestories,
            profile_image,
            notificationBadge,
            loggedUser
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
        const story = await Story.findById(req.params.id)
        .populate('user')
        .populate('likes')
        .populate('getShared')
        .populate('postUser')
        .lean()
        
        
        
        const comment = await Comment.find({post: req.params.id})
        .populate('user')
        .lean()
        const notificationBadge = await User.findById(req.user.id).lean()

        if(!story){
            return res.render('error/404')
        }
        res.render('feed/show', {
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            name: req.user.firstName,
            profileimage:req.user.image,
            displayName:req.user.displayName,
            comment,
            story,
            notificationBadge
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
        const notificationBadge = await User.findById(req.user.id).lean()

        
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
                notificationBadge
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
router.put('/:id/:userId/like', ensureAuth, async (req, res) => {
    try {
        const post = await Story.findById(req.params.id);
        const users = await User.findById(req.params.userId);
        const message = " reacted to the post that you have uploaded."
        if(!post.likes.includes(req.user.id)) {
            await post.updateOne({$push : {likes: req.user.id}});
            const state = "Unlike";
            await users.update({
                $push: 
                    {"Notification": 
                        {
                            notifyId: req.user.id,
                            notificationBody : message,
                            notifyTime: Date.now(),
                            postId: req.params.id,
                            status: "unread",
                            method: "like",
                            
                        },
                        
                    }
                })
        } 
        else{
            await post.updateOne({$pull: { likes: req.user.id}});
            const state = "Like";
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
        if(req.user.id == req.params.userId){
            res.redirect('/profile')
        }
        const GuestUser = await User.findById(req.params.userId).lean()
        const users = await User.find({ _id: req.params.userId})
        .populate('user')
        .populate('followers')
        .populate('requests')
        .populate('friends')
        .lean()

        const stories = await Story.find({ user: req.params.userId, status:'public'})
        .populate('user')
        .populate('likes')
        .populate('getShared')
        .populate('postUser')
        .lean()
        const timestories = await UStory.find({user: req.params.userId})
        .populate('user')
        .lean();
        const notificationBadge = await User.findById(req.user.id).lean()
       
        
        
        res.render('users/users_profile', {
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            stories,
            timestories,
            users,
            GuestUser,
            notificationBadge
            
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
        const notificationBadge = await User.findById(req.user.id).lean()

        res.render('about/photosforall', {
            profileimage:req.user.image,
            firstName:req.user.firstName,
            lastName:req.user.lastName,
            users,
            stories,
            timestories,
            notificationBadge
        })
    } catch (err){ 
        console.error(err)
        res.render('error/505')
    }
    
   
})


// comment
router.put('/:id/:userId/comments', ensureAuth, async (req, res) => {

    const users = await User.findById(req.params.userId)
    const message = " commented in your post.";
     const id = req.params.id;
      const comment = new Comment({
      text: req.body.comment,
      post: id,
      user: req.user.id,
    })
    await comment.save();
    const postRelated = await Story.findById(id);
    postRelated.comments.push(comment);
    await users.update({
        $push: 
            {"Notification": 
                {
                    notifyId: req.user.id,
                    notificationBody : message,
                    notifyTime: Date.now(),
                    postId: req.params.id,
                    status: "unread",
                    method: "comment",
                }
            }
        })
    await postRelated.save(function(err) {
    if(err) {console.log(err)}
    res.redirect('back')
    })

})

// follow users
router.put('/user/:id/follow', ensureAuth, async (req, res) => {
    try {
        const followUser = await User.findById(req.params.id);
        const followingUser = await User.findById(req.user.id);
        const message = "started following you.";
        if(!followUser.followers.includes(req.user.id)) {
            await followUser.updateOne({$push : {followers: req.user.id}});
            await followingUser.updateOne({$push : {following: req.params.id}});
           
            await followUser.update({
                $push: 
                    {"Notification": 
                        {
                            notifyId: req.user.id,
                            notificationBody : message,
                            notifyTime: Date.now(),
                        }
                    }
                })
        } 
        else{
            await followUser.updateOne({$pull: {followers: req.user.id}});
            await followingUser.updateOne({$pull : {following: req.params.id}});
            
        }
        res.redirect('back')

    } catch (err) {
        return res.render('error/500');
    }
})

// process friend requests
router.put('/user/:userId/request', ensureAuth, async (req, res) => {
    try {
        users = await User.findById(req.params.userId);
        loggedUser = await User.findById(req.user.id); 
        const message = " sent you friend request."
        if(!loggedUser.requests.includes(req.params.userId) && !users.requests.includes(req.user.id)){
            if(!loggedUser.friends.includes(req.params.userId)){
                await users.updateOne({$push : {requests: req.user.id}});
                await users.update({
                    $push: 
                        {"Notification": 
                            {
                                notifyId: req.user.id,
                                notificationBody : message,
                                notifyTime: Date.now(),
                                status: "unread",
                                method: "friend",
                            },
                            
                        }
                    })
                if(!loggedUser.following.includes(req.params.userId)){
                    await users.updateOne({$push: {followers: req.user.id}})
                    await loggedUser.updateOne({$push: {following: req.params.userId}})
                }
            }
            
        }
        else{
            await users.updateOne({$pull: {requests: req.user.id}})
            // await users.updateOne({$pull: {followers: req.user.id}})
            // await loggedUser.updateOne({$pull: {following: req.params.userId}})
        
        }
        res.redirect('back')
        
    } catch (err) {
        return res.render('error/500')
        
    }
})

// accept requests and unfriend
router.put('/user/:userId/accept', ensureAuth, async (req, res) => {
    try {
        requestedUser = await User.findById(req.params.userId);
        loggedUser = await User.findById(req.user.id); 
        const message = " accepted your friend request."
        if(!loggedUser.friends.includes(req.params.userId) && !requestedUser.friends.includes(req.user.id)) {
            await loggedUser.update({$push: {friends: req.params.userId}});
            await loggedUser.updateOne({$pull: {requests: req.params.userId}});
            await requestedUser.updateOne({$push: {friends: req.user.id}});
            await requestedUser.update({
                $push: 
                    {"Notification": 
                        {
                            notifyId: req.user.id,
                            notificationBody : message,
                            notifyTime: Date.now(),
                            status: "unread",
                            method: "friend",
                        },
                        
                    }
                })

        }
        else{
            await loggedUser.updateOne({$pull: {friends: req.params.userId}});
            await requestedUser.updateOne({$pull: {friends:req.user.id}});


        }
        
        res.redirect('back')
        
    } catch (err) {
        return res.render('error/500')
        
    }
})


module.exports = router
