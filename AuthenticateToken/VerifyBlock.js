const User = require('../Schemma/UserSchemmma'); // Adjust the path as necessary

const VerifyBlock = async (req, res, next) => {
    const { UserId } = req.body;
    console.log("verifyblock", UserId);

    try {
        const user = await User.findOne({ _id : UserId})
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        console.log(user.Block);
        
        if (user.Block == true) {
            res.json({ success : false})
        }
        else if(user.Block == false) {
            res.json({ success : true})
        }
    } catch (error) {
        console.error("Error verifying user block status:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = VerifyBlock;