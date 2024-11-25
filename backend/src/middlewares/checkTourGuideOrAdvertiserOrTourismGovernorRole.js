const User = require('../models/user');

const checkTourGuideOrAdvertiserOrTourismGovernor = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await User.findOne({
            where: { _id: id },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.type !== "advertiser" && user.type !== "tourismGovernor" && user.type !== "tourGuide") {
            return res.status(403).json({ message: "Access denied. Advertisers or Tourism Governors or Tour Guides only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { checkTourGuideOrAdvertiserOrTourismGovernor };
