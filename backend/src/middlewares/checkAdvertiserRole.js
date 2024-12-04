const User = require('../models/user');

const checkAdvertiserRole = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findOne({
            where: { _id: id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.type != "advertiser") {
            return res.status(403).json({ message: "Access denied. Advertisers only." });
        }

        next();
        return;
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { checkAdvertiserRole };
