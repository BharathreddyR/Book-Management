const express = require('express')
const router = express.Router();
const Book = require('../models/bookmodel')
const Review =require('../models/reviewmodel')
const validate = require('./validations');
const jwt = require('jsonwebtoken')
const { userAuth } = require('../middleware/middleware');
router.post('book/:bookId/review', userAuth, async (req, res) => {
    try {
        const requestBody = req.body
        if (!isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide review details' })
            return
        }
        let bookId = req.params.bookId
        let { reviewedBy, rating, review, } = requestBody

        if (!validate.isValid(bookId)) {
            res.status(400).send({ status: false, message: 'BookId is required' })
            return
        }
        if (!validate.isValidObjectId(bookId)) {
            res.status(400).send({ status: false, message: `${bookId} is not a valid book id` })
            return
        }

        if (!validate.isValid(reviewedBy)) {
            res.status(400).send({ status: false, message: 'reviewedBy is required' })
            return
        }
        if (!validate.isValid(rating)) {
            res.status(400).send({ status: false, message: 'rating is required' })
            return
        }

        if (!validate.isValidNumber(rating)) {
            res.status(400).send({ status: false, message: 'rating should not be in decimal' })
            return
        }


        if (!validate.isValid(review)) {
            res.status(400).send({ status: false, message: 'review is required' })
            return
        }


        const book = await Review.findOne({ _id: bookId, isDeleted: false, detetedAt: null });

        if (!book) {
            res.status(404).send({ status: false, message: `book does not exit` })
            return
        }
        
        const bookData = await Book.create(book)
        res.status(201).send({ status: true, message: '', data: bookData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }

    })


module.exports = router