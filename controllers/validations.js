const mongoose =require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const isValid = function(value) {
    if(typeof value === 'undefined' || value === null) return false
    if(typeof value === 'string' && value.trim().length === 0) return false
    return true;
}

const isValidRequestBody = function(requestBody) {
    return Object.keys(requestBody).length > 0
}

const isValidObjectId = function(objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}
const isValidTitle = function(title) {
    return ['Mr', 'Mrs', 'Miss'].indexOf(title) !== -1
}


const isValidphone = function (value, type) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value != type) return false
    return true;
}

const isValidPassword = function (value) {
    if (value.length<8){
        return false
    }else{
        return true
    }
}

const isValidNumber=function(value){
    return Number.isInteger(value)
}


module.exports ={isValid,isValidObjectId,isValidRequestBody,isValidPassword,isValidTitle,isValidphone,isValidNumber}