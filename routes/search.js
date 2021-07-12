const express = require('express')
const router = express.Router()
const { ensureAuth } = require('../middleware/auth')
const User  = require('../models/User')
const Story = require('../models/Story')
const UStory = require('../models/UStory')
const Comment = require('../models/Comment')


router.get('/', ensureAuth, async (req, res) => {
    const search_name = req.query.name;
    const search_results = await User.find({displayName: {$regex: search_name, $options: '$i'}})
    .lean()


    res.render('about/search_results', {
        search_results,
        search_name,
    })
})





module.exports = router
