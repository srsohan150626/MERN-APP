const asynchandler = require('express-async-handler')

const Goal = require('../models/goalModel')
// @desc GET goals
// @route GET /api/goals
// @access private
const getGoals = asynchandler(async (req,res) => {
    const goals = await Goal.find()
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
    })
    res.status(200).json(goal)
})

// @desc update goal
// @route PUT /api/goals/:id
// @access private
const updateGoals = asynchandler(async (req,res) => {
    res.status(200).json({message: `Update goal ${req.params.id}` })
})

// @desc delete goal
// @route DELETE /api/goals/:id
// @access private
const deleteGoals = asynchandler(async (req,res) => {
    res.status(200).json({message: `Delete goal ${req.params.id}` })
})
module.exports = {
    getGoals,
    setGoals,
    updateGoals,
    deleteGoals
}