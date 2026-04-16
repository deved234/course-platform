const express = require("express");
const validate = require("../../middlewares/validate.middleware");
const controller = require("./auth.controller");
const { registerSchema, loginSchema } = require("./auth.validation");

const router = express.Router();

router.post("/register", validate(registerSchema), controller.register);
router.post("/login", validate(loginSchema), controller.login);

module.exports = router;
