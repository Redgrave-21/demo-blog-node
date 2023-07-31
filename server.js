//declare app dependancies and variables
require("dotenv").config();
const { Router, response } = require('express');
const bcrypt=require("bcryptjs/dist/bcrypt");
const jwt = require("jsonwebtoken");
const mongoose=require('mongoose');
const Article =require('./models/article.model');
const commentRouter= require('./routes/comment.route');
const express=require('express');
const methodOverride=require('method-override');
const app=express();
const {append, cookie} = require("express/lib/response");
const userrouter=require('./routes/user.route');
const bodyParser=require("body-parser");
const cors= require("cors") //Newly added;
const cookieParser= require('cookie-parser');
const articleRouter=require('./routes/articles');
var validator= require('email-validator');
//const popup=require('popups');
//define database connection
mongoose.connect('mongodb://localhost/blog', {
   useNewUrlParser: true, useUnifiedTopology: true,
})

//set app dependancies
app.set('view engine','ejs')
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.json());
app.use(bodyParser.json());
app.use(cors())  //newly added
app.use(cookieParser());
app.use(express.static('./views'));

//Importing user context
const User= require ("./models/user");
//Importing auth route
const auth = require("./middleware/auth");
const { contentDisposition } = require("express/lib/utils");
var loggedin=false;
var role="user";
//Register 
app.get("/register",async (req,res,)=>{
    res.render('register', {user: new User})
})

app.post("/register", async (req,res) => {
    //register logic starts from here
    
    try{
        //get user input
        const { user_name, email, password } = req.body;
        if(validator.validate(req.body.email)){

        

        //validate user input
        if (!(user_name && email && password)) {
            res.status(400).send("All input fields are required");
        }

        //check if user already exists
        //validate user credentials if user already exists
        const oldUser = await User.findOne({ email });
        
        if (oldUser) {
            return res.status(409).send("User already exists please use login instead");
        }

        //Encrypt user password
        encryptedPassword = await bcrypt.hash (password, 10);

        //Create a new user in DB
        const user = await User.create({
            user_name,
            email: email.toLowerCase(), //sanitize: Convert email to all lowercase
            password: encryptedPassword, // Encrypt password
        });

        //Create Token
        const token = jwt.sign(
            { user_id : user_name, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "1h",
            },
        );

        //save user token
        user.token = token;

        //return new user
        res.redirect('/');
    }
    else{
        res.status(400).send("Invalid Email");
    }
    } catch (err) {
        console.log(err);
    }
    //Registration logic ends here
});

//get login page
app.get("/login",async (req,res,)=>{
    res.render('login', {user: new User })
})

//Login
app.post("/login", async (req, res ) =>{
    //Start of login logic
    try{
        //get user input
        const {email, password } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send("All input fields are required");
        }
        //validate if user exists in database
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            //Create token
            const token = jwt.sign(
                { user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"1h",
                } 
            );
            //Save user token
            user.token = token;
            loggedin=true;
            //Show user token and credentials
            //return res.status(200).json(user);
             //res.status(200).json(user);
            let options= {
                path:"/",
                sameSite: true,
                maxAge:1000*60*60*24,//Would expire after 24 hours
                httpOnly: true,//The cookie is only accessible to site
            }
            res.cookie('x-access-token', token, options);
            console.log(email);
            //res.setHeader('x-access-token','Bearer '+ token);
            if(user.role =='admin')
            {
                role="admin"                 
                 console.log(role);
                res.redirect('/articles/index');
            
            }
            else {
                role="user"
                console.log(role);
                res.redirect('/articles/home');
            }
            exports.role=role;
        }
        res.status(400).send("Invalid Credentials");
        res.json("invalid credentials");
    } catch(err){
        console.log(err);
    }
    //End of login logic
});

//Logout route
app.get('/logout', (req,res)=> {
    res.clearCookie('x-access-token');
    res.redirect('/')
    loggedin=false;
})
//Welcome Route
app.post("/welcome", auth, (req, res) =>{
    res.status(200).send("welcome");
});


//function to call and display all articles for regular users
app.get('/',async (req,res)=>{
    const articles=await Article.find().sort({createdAt: 'desc'})
    res.render('articles/home',{articles:articles, loggedin:loggedin, role:role})
})

//function to call and display all articles for admin
app.get('/articles/index', async (req,res) => {
    const articles=await Article.find().sort({createdAt: 'desc'})
    res.render('articles/index',{articles:articles})
})


//set app to listen on given port
app.use('/articles',articleRouter)
app.use('/user.route', userrouter)   
app.use('/comment.route',commentRouter)
app.listen(3000,console.log("app is listening on port 3000"));

