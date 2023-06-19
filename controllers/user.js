const express = require('express')
const router =express.Router();
const validate =require('./validations')
const User=require('../models/usermodel')
const jwt =require('jsonwebtoken')
router.post('/createUser',async(req,res)=>{
    try {
        const requestBody = req.body;
        if(!validate.isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide author details'})
            return
        }

        // Extract params
        let  {title , name,  phone, email, password,address} = requestBody; // Object destructing
    
        // Validation starts

        if(!validate.isValid(title)) {
            res.status(400).send({status: false, message: 'Title is required'})
            return
        }
        // title=title.trim()
        
        if(!validate.isValidTitle(title)) {
            res.status(400).send({status: false, message: `Title should be among Mr, Mrs, Miss and Mast`})
            return
        }

        if(!validate.isValid(name.trim())) {
            res.status(400).send({status: false, message: ' name is required'})
            return
        }

        if (!validate.isValidphone(phone, 'number')) {
            res.status(400).send({ status: false, message: "phone number is required" })
            return
        }
        //mobile number validation
        if (!(/^\d{10}$/.test(phone))) {
            res.status(400).send({ status: false, message: `phone number  should be a valid` })
            return
        }

        if(!validate.isValid(email.trim())) {
            res.status(400).send({status: false, message: `Email is required`})
            return
        }
        
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }

        if(!validate.isValid(password.trim())) {
            res.status(400).send({status: false, message: `Password is required`})
            return
        }

        if(!validate.isValidPassword(password.trim())){
            res.status(400).send({status: false, message: `Password must contain characters between 8 `})
            return
        }

         
    //    trimObjValues(address)
        
       
        
        const isEmailAlreadyUsed = await User.findOne({email}); // {email: email} object shorthand property

        if(isEmailAlreadyUsed) {
            res.status(400).send({status: false, message: `${email} email address is already registered`})
            return
        }

        const isphoneAlreadyUsed = await User.findOne({phone})
        if (isphoneAlreadyUsed) {
            res.status(400).send({status:false, message :"phone number is already used, try another one"})
            return
        }

    
        // Validation ends

        const userData = {title, name, phone, email, password, address}
        const newUser = await User.create(userData);

        res.status(201).send({status: true, message: `user created successfully`, data: newUser});
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
})
router.post('/loginUp',async(req,res)=>{
    try{
        const requestBody =req.body
        if(!validate.isValidRequestBody){
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide author details'})
            return
        }
        const {email,password}=req.body
        if(!validate.isValid(email.trim())) {
            res.status(400).send({status: false, message: `Email is required`})
            return
        }
        
        if(!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email.trim()))) {
            res.status(400).send({status: false, message: `Email should be a valid email address`})
            return
        }
        if(!validate.isValid(password.trim())){
            res.status(400).send({status:false,message:'password is required' })
        }
        const user = await User.findOne({email, password});

        if(!user) {
            res.status(401).send({status: false, message: `Invalid login credentials`});
            return
        }

        const token = await jwt.sign({userId: user._id}, 'secretkey',{

            expiresIn:"2h"

        })

        res.header('x-api-key', token);
        res.status(200).send({status: true, message: `user login successfull`, data: {token}});
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }



    })

module.exports =router




