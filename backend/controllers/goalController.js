const asynchandler = require('express-async-handler')

const Goal = require('../models/goalModel')
const User = require('../models/userModel')
// @desc GET goals
// @route GET /api/goals
// @access private
const getGoals = asynchandler(async (req,res) => {
    const goals = await Goal.find({user: req.user.id})
    res.status(200).json(goals)
})

// @desc Set goal
// @route POST /api/goals
// @access private
const setGoals = asynchandler(async (req,res) => {
    if(!req.body.text){
        res.status(400)
        throw new Error('Please add a text field!')
    }
    const goal = await Goal.create({
        text: req.body.text,
        user: req.user.id
    })
    res.status(200).json(goal)
})

// @desc update goal
// @route PUT /api/goals/:id
// @access private
const updateGoals = asynchandler(async (req,res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(404)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('This user is unauthorized to update this goal')
    }
    const updatedGoal = await  Goal.findByIdAndUpdate(req.params.id, req.body, {new:true})
    res.status(200).json(updatedGoal)
})

// @desc delete goal
// @route DELETE /api/goals/:id
// @access private
const deleteGoals = asynchandler(async (req,res) => {
    const goal = await Goal.findById(req.params.id)
    if(!goal){
        res.status(404)
        throw new Error('Goal not found')
    }
    const user = await User.findById(req.user.id)
    if(!user){
        res.status(401)
        throw new Error('User not found')
    }
    if(goal.user.toString() !== user.id){
        res.status(401)
        throw new Error('This user is unauthorized to delete this goal')
    }
    goal.remove()
    res.status(200).json(req.params.id)
})
module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}