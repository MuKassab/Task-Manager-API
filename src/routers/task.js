const express = require('express')

const auth = require('../middleware/auth')
const Task = require('../models/task')

const router = new express.Router()

//Create New Taks
router.post('/tasks', auth, async (req, res) => {
    //const newTask = new Task(req.body)
    const newTask = new Task({
        ...req.body,
        user_id: req.user._id
    })
    try{
        await newTask.save()
        res.status(201).send(newTask)
    } catch(e) {
        res.status(400).send(e)
    }
})


//Read All Tasks with options
//Completed = true || false
//Limit = INT (limit no of results coming back)
//Skip = INT (Skip n results and show the next x (LIMIT) results)
//SortBy = FieldName:Order  createdAt:desc/asc
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[ parts[0] ] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks)
    } catch(e) {
        res.status(500).send("Service is Down")
    }
})


//Read a Single Task
router.get('/tasks/:id', auth, async (req, res) => {
    const taskID = req.params.id

    try {
        const task = await Task.findOne({_id: taskID, user_id: req.user._id})
        if(!task){
            return res.status(400).send("No task with given ID!")
        }

        res.send(task)
    } catch(e) {
        res.status(500).send({error: "Service is Down"})
    }
})

//Update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    const reqUpdates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidUpdates = reqUpdates.every( update => allowedUpdates.includes(update))

    if(!isValidUpdates){
        return res.status(400).send({error: "Invalid Update Fields!"})
    }
    const taskID = req.params.id
    const modData = req.body
    try {
        //const task = await Task.findByIdAndUpdate(taskID, modData, {new: true, runValidators: true})
        
        const task = await Task.findOne({_id: taskID, user_id: req.user._id})
        if(!task){
            return res.status(404).send({error: "No task to update with given id"})
        }
        reqUpdates.forEach(update => task[update] = req.body[update])
        await task.save()
        res.send(task)
    } catch(e) {
        res.status(400).send(e)
    }
})

//Delete Task
router.delete('/tasks/:id', auth, async (req, res) => {
    const taskID = req.params.id
    
    try{
        const task = await Task.findOneAndDelete({_id: taskID, user_id: req.user._id})
        if(!task){
            res.status(404).send({error: "No task to delete with given ID!"})
        }
        res.send(task)
    } catch(e) {
        res.status(500).send({error: "Server Error"})
    }
})


module.exports = router