const Users = require("../models/userModel");
const customError = require("../utils/customError");
const generateToken = require("../utils/generateToken");
const {
  validateUserCredentials,
  validateUserInfo,
} = require("../utils/validate");

//@desc register user
//route POST/api/users/auth/login
//access public
const loginUser = async (req, res, next) => {
  try {
    console.log("hit");
    const { error, value } = validateUserCredentials(req.body);

    if (error) {
      throw customError(400, error.message);
    }

    // user email and password from validated body
    const { email, password } = value;

    const user = await Users.findOne({ email, provider: "credentials" });

    if (user && (await user.matchPassword(password))) {
      const responseObject = user?.toObject();
      delete responseObject.password;
      responseObject.token = generateToken({ email: responseObject.email });

      res.status(200).send(responseObject);
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
    const { error, value } = validateUserInfo(req.body);
    if (error) {
      throw customError(400, error.message);
    }
    const { name, email, password, provider } = value;

    const user = await Users.findOne({ email }).lean();

    if (user) {
      throw customError(309, "This email already in use");
    }
    const createdUser = await Users.create({ name, email, password, provider });

    const responseObject = createdUser?.toObject();
    delete responseObject.password;
    responseObject.token = generateToken({ email: responseObject.email });

    res.status(201).send(responseObject);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  loginUser,
  registerUser,
};
