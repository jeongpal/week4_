const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Post } = require("../models");
const { Like } = require("../models");

// 좋아요 게시글 조회
router.get("/",authMiddleware, async (req, res) => {
    const { user } = res.locals;
    console.log(user)
    try {
        const like = await Like.findAll({
          where: {userId : user.userId}, 
          order: [['likes', 'DESC']],
          attributes: {exclude: ["createdAt", "updatedAt"]},
          include: [{ 
            model: Post, 
            key: 'postId', 
            attributes:['createdAt', 'updatedAt', 'likes' ] 
          }],
        });
        console.log(like)
      res.status(200).json({ data: like });
    } catch(error) {
        res.status(400).send({
            errorMessage: "요청에 실패하였습니다."
        });
    }
});

// 게시글 좋아요
router.put("/posts/:postId/like", authMiddleware,async (req,res) => {
    try{
    // 파라미터로 확인하여 좋아요를 누를 postId
    const { postId } = req.params;
    // console.log(postId)
    // 로그인 검증과 like테이블에 저장할 userId
    const { userId } = res.locals.user;
    // console.log(user)
    const like = await Like.findOne({
        where: { postId }
    });
    // 좋아요가 0일때 조회하면 undefined니까 좋아요 바로 등록
    if (!like) {
        await Like.create({ postId,userId });
        await Post.increment({ likes: 1, }, { where: { postId }});
        return res.status(200).send({ message: "게시글의 좋아요를 등록하였습니다."});
    } else {
        await Like.destroy({where: { postId,userId }});
        await Post.decrement({ likes: 1, }, { where: { postId }});
        return res.status(200).send({ message: "게시글의 좋아요를 취소하였습니다."})
    }
    } catch(error) {
        res.status(400).send({ errorMessage: "요청에 실패하였습니다."})
    }
});

module.exports = router;