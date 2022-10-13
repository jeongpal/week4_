const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth-middleware");
const { Comment } = require("../models");
const { Post } = require("../models");


//댓글 작성
router.post("/:postId", authMiddleware, async (req, res) => { 
    try{
    const { postId } = req.params; // const postId = req.params.postId를 구조분해할당한 형태

    const { comment } = req.body;
    
    const { user } = res.locals;

    const createdAt = new Date();
    const updatedAt = new Date();

    await Comment.create({ 
        postId : postId,
        userId : user.userId,
        comment,
        createdAt,
        updatedAt 
    });

    res.json({ 
        msg : "댓글을 생성하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "댓글작성실패error"})
    }
});


// 댓글 목록 조회
router.get("/:postId", async (req, res) => { 
    try{ 
    const { postId } = req.params; // const _postId = req.params._postId를 구조분해할당한 형태
    const comment = await Comment.findAll({ where:{ postId } }); //앞이 디비의 키값, 구조분해할당
    
    if (!comment) {
        res.status(400).send({
            errorMessage: "댓글이 존재하지 않습니다."
        })
    } else{
        res.json({ comment:comment});
    }  
    
    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "댓글목록조회실패error"})
    }
});


// 댓글 수정
router.put("/:commentId", authMiddleware, async (req, res) => { 
    try{
    const { commentId } = req.params; // 위의 주소와 일치시키는게 좋음.
    const { comment } = req.body;   
    
    const existArticle = await Comment.update({ comment },{ where: { commentId } }); 

    res.json({ 
        success: true, msg: "댓글을 수정하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "댓글수정실패error"})
    }
});


// 댓글 삭제
router.delete("/:commentId", authMiddleware, async (req, res) => {
    try{
    const { commentId } = req.params; // req.params._postId의 구조분해할당
  
    const existArticle = await Comment.destroy({ where: { commentId } }); // 스키마에서 패스워드를 스트링으로 받았으면 여기도 스트링

    res.json({ 
        success: true, msg: "댓글을 삭제하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "댓글삭제실패error"})
    }
});

module.exports = router;