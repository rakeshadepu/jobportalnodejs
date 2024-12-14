import userModel from "../models/userModel.js";

export const registerController = async (req,res,next) => {
        const { firstName, lastName, email, password } = req.body;
        //validate
        if (!firstName) {
            next("Please provide firstname");
        }
        if (!lastName) {
          next("Please provide lastname");
        }
        if (!email) {
          next("Please provide email");
        }
        if (!password) {
          next("Please provide password");
        }

        const existinguser = await userModel.findOne({ email })
        if (existinguser) {
            next("Email already registered please login");
        }
 
        const user = await userModel.create({
          firstName,
          lastName,
          email,
          password,
        });
    //token
    const token = user.createJWT();
        res.status(201).send({
            success: true,
            message: 'User created Successfully',
            user: {
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                location:user.location,
            },
            token,
        });
};

export const loginControllers = async (req, res, next) => {
    const { email, password } = req.body;
    //valdation
    if (!email || !password) {
        return next("Please provide all fields");
    }
    //find user by email
    const user = await userModel.findOne({ email }).select("+password")
    if (!user) {
        return next('Incoorect email or email doesnt exists')
    }
    //compare password
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
        return next("Recheck your password");
    }
    user.password = undefined;
    const token = user.createJWT();
    res.status(200).json({
        success: true,
        message: 'Login successfull',
        user,
        token,
    })
};