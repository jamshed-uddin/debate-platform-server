const express = require("express");
const {
  getArguments,
  createArgument,
  editArgument,
  deleteArgument,
} = require("../controllers/argumentController");
const router = express.Router();

router.route("/").get(getArguments).post(createArgument);
router.route("/:id").put(editArgument).delete(deleteArgument);

module.exports = router;
