const express =require('express');
require('dotenv').config()
const  app =express();
const mongoose = require('mongoose')

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));




mongoose.connect('mongodb://127.0.0.1:27017/project',
 ).then(()=>console.log('connected mongodb')).catch((err)=>console.log(err.message))

const router = require('./router');
app.use('/api',router)



app.listen(process.env.PORT || 3000, ()=> {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});

