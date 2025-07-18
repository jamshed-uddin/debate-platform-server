const express = require("express");
const { loginUser, registerUser } = require("../controllers/userController");
const router = express.Router();

router.post("/auth/login", loginUser);
router.post("/auth/register", registerUser);

module.exports = router;
