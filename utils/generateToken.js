const jwt = require("jsonwebtoken");

const generateToken = ({ email }) => {
  const token = jwt.sign({ email }, process.env.SECRET, {
    expiresIn: "30d",
  });

  return token;
};

module.exports = generateToken;
