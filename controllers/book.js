const express = require('express')
const router = express.Router();
const Book = require('../models/bookmodel')
const validate = require('./validations');
const User = require('../models/usermodel')
const jwt = require('jsonwebtoken')
const { userAuth } = require('../middleware/middleware');
router.post('/createbook', userAuth, async (req, res) => {
    try {
        const requestBody = req.body;
        const userIdFromToken = req.userId
        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide book details' })
            return
        }
        if (!validate.isValidObjectId(userIdFromToken)) {
            res.status(400).send({ status: false, message: 'invalid user token id' })
        }
        const { title, excerpt, userId, ISBN, category, subcategory, releasedAt } = requestBody
        let book = {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            subcategory,
            releasedAt
        }
        if (!validate.isValid(title)) {
            res.status(400).send({ status: false, message: 'Book Title is required' })
            return
        }
        if (!validate.isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'excerpt Title is required' })
            return
        }
        if (!validate.isValid(userId)) {
            res.status(400).send({ status: false, message: 'user id is required' })
        }
        if (!validate.isValidObjectId(userId)) {
            res.status(400).send({ status: false, message: `${userId}is invalid user id` })
            return
        }
        if (!validate.isValid(ISBN)) {
            res.status(400).send({ status: false, message: 'Book Isbn is required ' })
            return
        }

        if (!validate.isValid(category)) {
            res.status(400).send({ status: false, message: 'categort is required' })
            return
        }
        if (!validate.isValid(subcategory)) {
            res.status(400).send({ status: false, message: 'subcategory is required' })
            return
        }

        if (!validate.isValid(releasedAt)) {
            res.status(400).send({ status: false, message: 'releasedAt bookdate is required' })
            return
        }
        if (userId !== userIdFromToken) {
            res.status(401).send({ status: false, message: `Unauthorized access! Owner info doesn't match` });
            return
        }
        // const user = await Book.findById(userId);

        // if (!user) {
        //     res.status(404).send({ status: false, message: `user does not exit` })
        //     return
        // }

        const bookData = await Book.create(book)
        res.status(201).send({ status: true, message: 'New book created successfully', data: bookData })
    } catch (error) {
        res.status(500).send({ status: false, message: error.message })
    }
})
router.get('/getbooks', userAuth, async (req, res) => {
    try {
        const queryParams = req.query
        let filterQuery = { isDeleted: false, deletedAt: null }
        let { userId, category, subcategory } = queryParams
        if (userId) {
            filterQuery["userId"] = userId
        }
        if (category) {
            filterQuery["category"] = category
        }

        if (subcategory) {
            filterQuery["subcategory"] = subcategory
        }


        let book = await Book.find(filterQuery)
        const book1 = await Book.find(filterQuery).select({ "_id": 1, "title": 1, "excerpt": 1, "userId": 1, "category": 1, "releasedAt": 1, "reviews": 1 }).sort({ title: 1 })
        if (book.length > 0) {
            res.status(200).send({ status: true, message: 'Books list', data: book1 })
        }
        else {
            res.status(404).send({ msg: "book not find" })
        }
    }
    catch (error) {
        res.status({ status: false, message: error.message })
    }

})
router.get('/getbooks/:id', userAuth, async (req, res) => {
    let booksId = req.params.id
    try {
        if (!validate.isValidObjectId(booksId)) {
            res.status(400).send({ status: false, message: "bookId should be valid" })
            return
        }
        let bookDetails = await Book.findOne({ booksId, isDeleted: false })
        if (!bookDetails) {
            res.status(404).send({ status: false, message: "No book found" })
            return
        }
    }catch (error) {
        res.status(200).send({status:false,message:"book list"})

    }
})
// update
router.put('/update/:bookId',userAuth,async function (req, res) {
    try {
        const _id = req.params.bookId
        const requestBody = req.body
        const userIdFromToken=req.userId

        if (!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: "Please provide valid data in request body" })
            return
        }

        if (!validate.isValidObjectId(_id)) {
            res.status(400).send({ status: false, message: "bookId should be valid" })
            return
        }
        let bookDetails = await Book.findOne({ _id })
        
        if (!bookDetails) {
            res.status(404).send({ status: false, message: "No book found" })
            return
        } 
        const { title, excerpt, ISBN, releasedAt } = requestBody
        let updateBook = {
            title,
            excerpt,
            ISBN,
            releasedAt
        }
        if (!validate.isValid(title)) {
            res.status(400).send({ status: false, message: 'Book Title is required' })
            return
        }    
        // const titleUsed =await Book.findOne({titleUsed})
        // if (titleUsed) {
        //     res.status(400).send({ status: false, message: "Title is already in use, try something different" })
        //     return
        // 
        if (!validate.isValid(excerpt)) {
            res.status(400).send({ status: false, message: 'excerpt Title is required' })
            return
        }
        if (!validate.isValid(_id)) {
            res.status(400).send({ status: false, message: 'user id is required' })
        }
        if (!validate.isValidObjectId(_id)) {
            res.status(400).send({ status: false, message: `${_id}is invalid user id` })
            return
        }
        if (!validate.isValid(ISBN)) {
            res.status(400).send({ status: false, message: 'Book Isbn is required ' })
            return
        }
        // const isbnUsed =await Book.findOne({isbnUsed})
        // if (isbnUsed) {
        //     res.status(400).send({ status: false, message: "isbn is already in use, try something different" })
        //     return
        // }
        if(!validate.isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }

        let udatedBookDetails = await Book.findOneAndUpdate({ _id }, updateBook, { new: true })
        return res.status(200).send({ status: true, message: 'Book details updated successfully', data: udatedBookDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }

}) 

router.delete('/books/:bookId',userAuth,async(req,res)=>{
    try {
        const params = req.params
        const bookId = params.bookId
        const userIdFromToken = req.userId

        if(!validate.isValidObjectId(bookId)) {
            res.status(400).send({status: false, message: `${bookId} is not a valid book id`})
            return
        }

        if(!validate.isValidObjectId(userIdFromToken)) {
            res.status(400).send({status: false, message: `${userIdFromToken} is not a valid token id`})
            return
        }

        let deleteBookDetails = await Book.findOneAndDelete({ bookId }, { new: true })
        return res.status(200).send({ status: true, message: 'Book details deleted successfully', data: deleteBookDetails })

    } catch (err) {
        return res.status(500).send({ status: false, message: err.message })
    }
    
   
})




module.exports = router