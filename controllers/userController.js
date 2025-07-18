const Users = require("../models/userModel");
const generateToken = require("../utils/generateToken");

//@desc register user
//route POST/api/users/auth/login
//access public
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      throw customError(401, "Email required");
    }

    const user = await Users.findOne({ email, provider: "credentials" });

    if (user && (await user.matchPassword(password))) {
      const { password: passcode, ...userData } = user._doc;
      const response = {
        ...userData,
        token: generateToken({ email: userData.email }),
      };
      res.status(200).send(response);
    } else {
      throw customError(400, "Invalid credentials");
    }
  } catch (error) {
    next(error);
  }
};

//@desc register user
//route POST/api/users/auth/register
//access public
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, provider } = req.body;

    if (!name || !email) {
      throw customError(401, "Fill up the required field");
    }

    const user = await Users.findOne({ email });

    if (user) {
      throw customError(309, "This email already in use");
    }
    const createdUser = await Users.create({ name, email, password, provider });
    const { password: passcode, ...userData } = createdUser;

    const response = {
      ...userData,
      token: generateToken({ email: userData.email }),
    };

    res.status(201).send(response);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
};
