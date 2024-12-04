const User = require('../models/user');

const checkTouristOrAdminOrSellerRole = async (req, res, next) => {
    try {
        const id = req.user.id;
        const type = req.user.type;
        const user = await User.findOne({
            where: { _id: id },
        });

        if (!user && !(type == "tourist")) {
            return res.status(404).json({ message: "User not found" });
        }

        if ( type !== "tourist" && user.type !== "seller" && user.type !== "admin") {
            return res.status(403).json({ message: "Access denied. Tourists or Admins or Sellers only." });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

export { checkTouristOrAdminOrSellerRole };
