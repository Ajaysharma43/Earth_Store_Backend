const jwt  = require('jsonwebtoken')

const VerifyUser = (req , res , next) => {
    try
    {
        const Role = req.headers.authorization.split(' ')[1];
        const AllowedRoles = ["Admin"];
        if(AllowedRoles.includes(Role))
        {
            res.json({Success  : true})
        }
        else
        {
            res.json({Success : false})
        }
    }
    catch(error)
    {
        res.json({error : error})
    }
} 

module.exports = VerifyUser;