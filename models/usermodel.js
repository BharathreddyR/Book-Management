const mongoose = require('mongoose')
const userSchema =new mongoose.Schema({
    title:{
        type:String,
        enum:['Mr','Mrs','Miss','Mast'],
        required:"Title is required"
    },
    name:{
        type:String,
        required:"name is required",
        trim:true
    },
    phone: {
        type: Number,
        trim: true,
        unique: true,
        required: 'Mobile number is required',
        validate: function (phone) {
            return /^\d{10}$/.test(phone)
        }, 
        message: 'Please fill a valid phone number',isAsync: true
        },
    email:{type :String,
        trim:true,
        lowercase: true,
        unique : true,
        required: 'Email address is required',
        validate: function (email) {
                return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)
                },message: 'Please fill a valid email address',isAsync: true
    },
    password:{
        type: String,
        trim: true,
        required: 'Password is required',
        unique:true,
        validate:function(password){
                return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8}$/.test(password)
            },message :'Check if password contains at least one uppercase letter, one lowercase letter, and one number',isAsync:true
        
    },
    address: {
        street: {type:String, trim:true },
        city: {type:String, trim:true },
        pincode: {type:String, trim:true }
    }},{  timestamps: true })
module.exports = mongoose.model('User', userSchema)