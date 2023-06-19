const jwt =require('jsonwebtoken')
const userAuth =async function(req,res,next){
    try{
        const token =req.header('x-api-key')
        if(!token){
            res.status(403).send({status:false,message:"Missing  autentication token in req"})
            return
        }
        const decode = await jwt.verify(token,'secretkey')
        if(!decode){
            res.status(403).send({status:false,message:"Missing  autentication token in req"})
            return       
        }
        req.userId=decode.userId
        next()
    }catch(error){
        res.status(500).send({status:false,message:error.message})
    }
}
module.exports ={userAuth}