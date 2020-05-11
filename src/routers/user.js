const express = require('express')
const multer = require('multer')
const sharp = require('sharp');

const User = require('../models/user')
const auth = require('../middleware/auth')
const {sendWelcomeEmail, sendCancelationEmail} = require('../emails/account')

const router = new express.Router()


//Create New User
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        await sendWelcomeEmail(user.name, user.email)
        const token = await user.generateAuthToken()
        res.status(201).send({user, token})
    } catch(e) {
        res.status(400).send(e)
    }
})


//User login
router.post('/users/login', async (req, res) => {
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({user, token})
    } catch(e) {
        res.status(400).send()
    }
})

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        file.originalname = file.originalname.toLowerCase()
        const correctfileExt = file.originalname.match(/\.(jpe?g|png)$/)
        if(correctfileExt){
            cb(undefined, true)
        }
        else{
            cb(new Error("Only images (.png, .jpg, .jpeg) are supported!"))
        }
        
    }
})

//User upload profile picture
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({height: 250, width: 250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
})


//User delete profile picture
router.delete('/users/me/avatar', auth, async (req, res) => {
    if(!req.user.avatar){
        return
    }
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})


//User fetch profile picture
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar){
            throw new Error()
        }
        const avatarData = user.avatar
        res.set('Content-Type', 'image/png')
        res.send(avatarData)
    } catch (e) {
        res.status(404).send()
    }
})
//User Logout
router.post('/users/logout', auth, async (req, res) => {
    try{
        req.user.tokens = req.user.tokens.filter(item => item.token != req.token)
        await req.user.save()
        res.send("Logged out")
    } catch(e) {
        res.status(500).send()
    }
})

//User Logout All Active Sessions
router.post('/users/logoutAll', auth, async (req, res) => {
    try{
        req.user.tokens = []
        await req.user.save()
        res.send("Logged out from all active sessions")
    } catch(e) {
        res.status(500).send()
    }
})

//Read User Profile
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)
})


//Update User
router.patch('/users/me', auth, async (req, res) => {
    //Handle unavaiable fields to update in the user models
    const reqUpdates = Object.keys(req.body)
    const allowedUpdates = ['name', 'password', 'age', 'email']
    const isValidUpdates = reqUpdates.every( update => allowedUpdates.includes(update) )

    if(!isValidUpdates){
        return res.status(400).send({error: 'Invalid fields'})
    }

    const userID = req.user._id
    const modData = req.body
    try {

        //const user = await User.findByIdAndUpdate(userID, modData, {new: true, runValidators: true})

        const user = req.user
        reqUpdates.forEach(update => user[update] = req.body[update])
        await user.save()
        res.send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})

//Delete User
router.delete('/users/me', auth, async (req, res) => {
    const userID = req.user._id
    try {
        await req.user.remove()
        sendCancelationEmail(req.user.name, req.user.email)
        res.send(req.user)
    } catch(e) {
        res.status(500).send({error: "Server error"})
    }
})


module.exports = router