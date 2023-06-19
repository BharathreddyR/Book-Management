const express = require('express')
const router =express.Router();

const book =require('./controllers/book')
router.use('/book',book)
const review =require('./controllers/review')
router.use('/review',review)



const user =require('./controllers/user')
router.use('/user',user)

module.exports =router