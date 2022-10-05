const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment");
const Post = require("../schemas/post");


//댓글 작성
router.post("/:_postId", async (req, res) => { 
    try{
    const { _postId } = req.params; // const _postId = req.params._postId를 구조분해할당한 형태

    const { user, password, content } = req.body;
    
    await Comment.create({ _postId, user, password, content });

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
router.get("/:_postId", async (req, res) => { 
    try{ 
    const { _postId } = req.params; // const _postId = req.params._postId를 구조분해할당한 형태
    const detail = await Comment.find({ _postId }) //앞이 디비의 키값, 구조분해할당
    
    res.json({
        detail,
    });
    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "댓글목록조회실패error"})
    }
});


// 댓글 수정
router.put("/:_commentId", async (req, res) => { 
    try{
    const { _commentId } = req.params; // 위의 주소와 일치시키는게 좋음.
    const { password, content } = req.body;   
    
    const existArticle = await Comment.findOne({ _id: _commentId, password }); // 수정은 글 하나를 골라서 하는거니까 findOne()

    if (existArticle) { // 그냥 existArticle을 넣으면 불린값으로 참거짓 판별, 값이 있으면 1이니 true, 없으면 0이니 false
        await Comment.updateOne({ _id: _commentId }, { $set: { content } });
    } else {
        return res.status(400).json({ 
            success: false, msg: "비밀번호가 일치하지 않습니다!" 
        });
    }

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
router.delete("/:_commentId", async (req, res) => {
    try{
    const { _commentId } = req.params; // req.params._postId의 구조분해할당
    const { password } = req.body; // req.body.password의 구조분해할당
  
    const existArticle = await Comment.findOne({ _id: _commentId, password }); // 스키마에서 패스워드를 스트링으로 받았으면 여기도 스트링, 패스워드 구조분해할당

    if (existArticle) { 
        await Comment.deleteOne({ _commentId });
    } else {
        return res.status(400).json({ 
            success: false, msg: "비밀번호가 일치하지 않습니다!" 
        });
    }
    
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