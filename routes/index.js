const express = require("express");
const router = express.Router();
const commentRouter = require("./comment");
const postRouter = require("./post");

router.use("/comments", commentRouter);
router.use("/posts", postRouter);

module.exports = router;