const express=require('express')
const Article = require('../models/article.model')
const Comment = require('../models/comment.model');
const bodyParser = require('body-parser');
const router=express.Router();
router.use(bodyParser.urlencoded({extended: false}))
const verifyToken= require('./../middleware/auth');
const User=require('../models/user');
const user = require('../models/user');
const jwt=require('jsonwebtoken');
const { findOne } = require('../models/user');
const config=process.env;
var role=require('../server');
const { Mongoose } = require('mongoose');



//GET request to create new article
router.get('/new',(req, res)=>{
    res.render('articles/new',{article: new Article()})
})
 
//GET request to edit an article by finding it using ID
router.get('/edit/:id', async (req,res)=>{
    console.log("Article edit get route accessed")
    const article=await Article.findById(req.params.id)
    res.render('articles/edit',{article: article})
}) 

//Get request to save add an comment to article

router.get('/edit/:id/comments',async (req,res) =>{
    console.log("comments get route accessed")
    const article = await Article.findById(req.params.id)
    res.render('articles/comments', {article:article})
})

//POST request to save a comment
router.post('/edit/:id/comments', verifyToken, async (req,res)=>{
    const id = req.params.id;
    const token= req.cookies['x-access-token'];
    const decode =jwt.decode(token, config.TOKEN_KEY);
    Email=decode.email;
    var commenter;
    User.findOne({email:Email},function (err, MyUser){
            if(err){
                console.log(err);
            }
            else{
               commenter= MyUser.user_name;               
               console.log(commenter);
            }
        });
        
      var comment=await User.findOne();
      comment=new Comment({
        text: req.body.comment,
        author: commenter,
        Article: id
    });
    console.log(commenter);
    await comment.save();
    const ArticleRelated= await Article.findById(id);
    ArticleRelated.comments.push(comment);
    ArticleRelated.comments.push(comment.Author);
    await ArticleRelated.save(function(err) {
        if(err) {console.log(err)}
        if(user.role =='admin')
        {
        res.redirect('/articles/index')
        }
        else
        {
            res.redirect('/articles/home')
        }
    })
}) 

//POST request to save a new article
router.post('/',async (req, res, next)=>{
    req.article=new Article()
    next() 
}, saveArticleAndRedirect('new'))

//POST request to save an edited article using it's ID
router.put('/:id', async (req,res, next)=>{
    req.article=await Article.findById(req.params.id)
    next()
}, saveArticleAndRedirect('edit'))

//Delete route to delete and article using it's ID
router.delete('/:id', async(req,res)=>{
    await Article.findByIdAndDelete(req.params.id)
    res.redirect('index')
})

//Function to save an article and redirect to home page
function saveArticleAndRedirect(path) {
    return async (req,res)=>{
        let article=req.article
        article.title=req.body.title
        article.description=req.body.description
        article.markdown=req.body.markdown
          try{
              article= await article.save()
              res.redirect(`/articles/${article.slug}`)
          } catch (e){
              res.render(`articles/${path}`,{article:article})
     
          }
    }
}

//GET request to create new article
router.get('/new',(req, res)=>{
    res.render('articles/new',{article: new Article()})
})
 

//GET request to show specific article using it's slug(url)
router.get('/:slug', async (req,res)=>{
    const article= await Article.findOne({slug: req.params.slug}).populate("comments")
    if (article==null) res.redirect('/')
    res.render('articles/show', {article : article, role: role})
    console.log(role)
})

//Post route to add a like
router.post('/:id/likes',verifyToken, async (req,res)=>{
    const id= req.params.id;
    const token=req.cookies['x-access-token'];
    const decode=jwt.decode(token, config.TOKEN_KEY);
    Email=decode.email;
    await User.findOne({email:Email}), function (err){
        if(err){
            console.log(err)
        }
        else{

        }
    }
    const article=await Article.findById(req.params.id)
    article.likes= article.likes+1;
    article.save();
    res.render('articles/show', {article:article ,role: role});
})
/*router.post('/:id/likes',verifyToken, async (req,res)=>{
    var liked;
    const id= req.params.id;
    const token=req.cookies['x-access-token'];
    const decode=jwt.decode(token, config.TOKEN_KEY);
    Email=decode.email;
    await User.findOne({email:Email}), function (err,MyUser){
        if(err){
            console.log(err);
        }
        else{

            liked=MyUser.email;
            console.log(liked);
        }
    }
    console.log("likes button was pressed");
    const article=await Article.findById(req.params.id);
    await article.likes.push(liked);
    await article.save(function(err) {
        if(err) {
            console.log(err)
        }
        else{
            res.render('articles/show',{article:article,role:role});
        }
    })
    
})

/*router.post('/:id/likes',verifyToken, async (req,res)=>{
    const token=req.cookies['x-access-token'];
    const decode=jwt.decode(token, config.TOKEN_KEY);
    console.log(decode);
    Email=decode.email;
    var liked;
    User.findOne({email:Email},function (err, MyUser){
        if(err){
            console.log(err);
        }
        else{
            liked= MyUser.user_id;
            console.log(liked);
        }
    });
    var article= await user.findOne();
    
    console.log("likes button was pressed");
    console.log(liked);
    articlelike=await Article.findById(req.params.id);
    await articlelike.likes.push(liked);
    await articlelike.save(function(err) {
        if(err) {
            console.log(err)
        }
        else{
            res.render('articles/show',{article:article,role:role});
        }
    })
})
*/

//Post route to add a dislike
router.post('/:id/dislikes',verifyToken, async (req,res)=>{
    const id= req.params.id;
    const token=req.cookies['x-access-token'];
    const decode=jwt.decode(token, config.TOKEN_KEY);
    Email=decode.email;
    await User.findOne({email:Email}), function (err){
        if(err){
            console.log(err)
        }
        else{
            
        }
    }
    const article=await Article.findById(req.params.id)
    article.dislikes= article.dislikes+1;
    article.save();
    res.render('articles/show', {article:article ,role: role});
})
/*router.post('/:id/dislikes',verifyToken, async (req,res)=>{
    var disliked;
    const id= req.params.id;
    const token=req.cookies['x-access-token'];
    const decode=jwt.decode(token, config.TOKEN_KEY);
    Email=decode.email;
    await User.findOne({email:Email}), function (err,MyUser){
        if(err){
            console.log(err);
        }
        else{

            disliked=MyUser.email;
            console.log(disliked);
        }
    }
    console.log("dislikes button was pressed");
    const article=await Article.findById(req.params.id);
    await article.dislikes.push(disliked);
    await article.save(function(err) {
        if(err) {
            console.log(err)
        }
        else{
            res.render('articles/show',{article:article,role:role});
        }
    })
    
})*/


module.exports=router 