const express = require("express");
// const mongoose = require("mongoose");
// const { User, Course, Admin } = require("../db");
// const jwt = require('jsonwebtoken');
// const { SECRET } = require("../middleware/auth")
// const { authenticateJwt } = require("../middleware/auth");

const router = express.Router();

router.get("/", (req, res) => {
   res.send('hello')
});

module.exports = router;
