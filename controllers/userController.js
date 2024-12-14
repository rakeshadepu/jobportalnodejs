import userModel from "../models/userModel.js";

export const updateUserController = async (req, res, next) => {
    const { firstName, lastName, email, location } = req.body;
    if (!firstName || !lastName || !email || !location) {
      next("Please provide all Fields");
    }
    const user = await userModel.findOne({ _id: req.user.userId })
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.location = location;

    await user.save()
    const token = user.createJWT();
    res.status(200).json({
        user,
        token,
    });
};