const express = require('express')
const Comment=require('./../models/comment.model')
const commentRouter=express.Router()

//GET request to create a new comment
commentRouter.get('article/:slug', (req,res) =>{
    var _slug=req.params.slug;
    var articleRouter=_.findwhere()
    res.render('/comments',{comment: new Comment()})
    });

    commentRouter.post('article/:slug', (req,res) =>{
        req.comment=new comment()
        res.redirect('article/:slug')
    })
module.exports=commentRouter