const express = require("express");
const userController = require("./controller.user");

const router = express.Router();
router.post("/register", userController.registerUser);
router.post("/login", userController.loginUser)
router.get("/user", userController.getAllusers)
router.delete("/:id", userController.deleteUser)
router.patch("/:id", userController.updateduserRoute)


module.exports = router;