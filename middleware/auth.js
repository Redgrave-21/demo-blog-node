const jwt = require("jsonwebtoken")
const user=require('../models/user')
const User=require('../models/user')


const config=process.env;

const verifyToken = (req,res, next) => {
    const token= req.cookies['x-access-token'];
    //req.token=token['x-access-token'] || req.body.token || req.query.token || req.headers["x-access-token"];
    if(!token) {
        return res.status(403).send("A token is required for authentication");
    }

    //decoding the token
    try{
        const decoded = jwt.verify(token, config.TOKEN_KEY);
       /* const decode =jwt.decode(token, config.TOKEN_KEY);
        console.log(decode.email);
        email=decode.email; */
    }   catch(err) {
        return res.status(401).send("Invalid Token");
    }
    
    return next ();
};


module.exports = verifyToken;