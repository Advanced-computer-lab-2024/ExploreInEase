const Tourist  = require('../models/tourist');

const checkTouristRole = async (req, res, next) => {
    try {
        const id = req.user.id;
        const type = req.user.type;
        console.log("User in the Token: ",req.user);

        const user = await Tourist.findOne({_id: id});

        if (!user) {
            return res.status(404).json({ message: "Tourist not found" });
        }

        if (type != "tourist") {
            return res.status(403).json({ message: "Access denied. Tourists only." });
        }

        next();
        return;
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = checkTouristRole ;
