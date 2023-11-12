const express = require('express')
const Task = require('../models/task.js');
const auth = require('../middleware/auth.js')

const router = new express.Router();

router.get('/tasks',auth,async(req,res)=>{

    try{
        // const task = await Task.find({owner:req.user._id})
        const match = {}
        const sort = {}
        if(req.query.completed){
            match.completed = req.query.completed === 'true'
        }

        if(req.query.sortBy){
            const parts = req.query.sortBy.split(':')
            sort[parts[0]] = parts[1] === 'desc' ? -1:1
        }
        await req.user.populate({
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.send(req.user.tasks)
    }catch(e){
        res.status(400).send('error')

    }
})

router.get('/tasks/:id',auth,async(req,res)=>{

    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(404).send('404')
        }
        res.send(task)
    }catch(e){
        res.status(500).send('server error')
    }

})
router.post('/tasks', auth , async (req,res)=>{
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }catch(e){
        res.status(400).send(e)
    }
})
router.patch('/tasks/:id',auth,async(req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description','completed']
    const isValidUpdate = updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidUpdate){
        return res.status(400).send('invalid update field')
    }
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})

        // const task = await Task.findById(req.params.id)
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send()
    }
    
})
router.delete('/tasks/:id', auth , async(req,res)=>{
    try{
        const task = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!task){
            return res.status(400).send('not found')
        }
        res.send(task)
    }
    catch(e){
        res.status(400).send('e rror')
    }
})

module.exports = router