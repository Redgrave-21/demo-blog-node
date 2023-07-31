//Route for user registration

const express= require('express')
const userrouter=express.Router()
const Auth = require('../middleware/auth')
const bcrypt=require("bcryptjs/dist/bcrypt")
const jwt = require("jsonwebtoken")


//importing user context
const User= require("../models/user")


//Register




userrouter.post("/login", async (req, res ) =>{
    //Start of login logic
    try{
        //get user input
        const { email, password } = req.body;

        //validate user input
        if(!(email && password)) {
            res.status(400).send("All input fields are required");
        }
        //validate if user exists in database
        const user = await User.findOne({ email });
        
        if (user && (await bcrypt.compare(password, user.password))) {
            //Create token
            const token = jwt.sign(
                { user_jd: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn:"1h",
                } 
            );

            //Save user token
            user.token = token; //The required user Token

            //user
           res.status(200).json(user);
        
        }
        res.status(400).send("Invalid Credentials");
    } catch(err) {
        console.log(err);
        console.log(req.user)
    }
    //End of login logic
});



module.exports=userrouter;