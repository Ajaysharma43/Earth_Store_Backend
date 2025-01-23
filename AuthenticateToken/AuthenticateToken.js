const Jwt = require('jsonwebtoken')

const Authenticate = (req , res , next) => {
    const token = req.headers.authorization.split(' ')[1]

    if(!token)
    {
        return res.json({message : "Invalid"})
    }

    try{
        const verify = Jwt.verify(token , process.env.JWT_SECRET_KEY)

        req.user = verify

        next();
    }
    catch(error)
    {
        console.log("the error is " + error); 
    }
}

module.exports = Authenticate;