const express = require("express");
const proxyController = require("../controllers/proxy");

const router = express.Router();

/* tag : used to define the use case to which a call belongs */
router.all("/:domain/:tag/*", proxyController.mim);

module.exports = router;
