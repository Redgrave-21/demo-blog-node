//define dependancies and variables for article model
const mongoose = require('mongoose')
const {marked}= require('marked')
const slugify=require('slugify')
const createDomPurify=require('dompurify')
const { JSDOM }= require('jsdom')
const dompurify=createDomPurify(new JSDOM().window)
const { stringify } = require('nodemon/lib/utils')
const user = require('./user')


//Define Database schema
const articleSchema=new mongoose.Schema({
    title:{
        type:String,
        required: true
    },
    createdBy:{
        type:String,
        type:mongoose.Schema.ObjectId,
        ref:'user',
    },
    
    description:{
        type:String,
        required:true
    },
    markdown:{
        type:String,
        required:true
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
    slug:{
       type:String,
       required:true,
       unique:true 
    },
    sanitizedHtml:{
        type: String,
        required:true
    },
    comments:[{
        type: String,
        type:mongoose.Schema.Types.ObjectId,
        ref:'Comment'
    }],
    likes:
        {
            type:Number,
            default:0,
        },
    dislikes:{
        type:Number,
        default:0,
    }

           
})

//validation and sanitize function
articleSchema.pre('validate', function(next){
    if(this.title){
        this.slug=slugify(this.title,{lower:true,strict: true})
    }

    if(this.markdown){
        this.sanitizedHtml=dompurify.sanitize(marked(this.markdown))
    }

    next()
})

//export Article model
module.exports=mongoose.model('Article',articleSchema)