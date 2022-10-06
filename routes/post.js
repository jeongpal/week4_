const express = require("express");
const { title } = require("process");
const router = express.Router();
const Post = require("../schemas/post");


//게시글 작성
router.post("/", async (req, res) => {
    try { 
        let createdAt = new Date();

        const { user, title, password, content } = req.body;

        await Post.create({ user, title, password, content, createdAt });

        res.json({ 
            msg : "게시글을 생성하였습니다." 
        });
    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "작성실패error"})
    }
});


// 게시글 조회
router.get("/", async (req, res) => {  
    try { 
    const post = await  Post.find().sort("-createdAt");
    
    const data = post.map((item)=> { // _id, password, _v를 제외한 데이터를 내보내는 로직
        return {
        postId: item._id,
        user: item.user,
        title: item.title,
        content: item.content,
        createdAt: item.createdAt}
        });
    
    res.json({
        data,
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({message: "조회실패error"}) 
    }
});


// 게시글 상세 조회
router.get("/:_postId", async (req, res) => { 
    try {
    // const { _id } = req.params;
    // const [detail] = await Post.find({ _postId: _id }) find로 불러오면 배열로 반환되니 변수에 대괄호를 칠 필요가 없음.
    const { _postId } = req.params; // const _postId = req.params._postId를 구조분해할당한 형태

    const detail = await Post.findOne({ _id: _postId }) //앞이 디비의 키값
    const data = { // findOne이라서 하나만 반환되니 배열 순회가 필요없다. 그래서 위랑 다르게 map 메소드를 쓰지 않는다.
            postId: detail._id,
            user: detail.user,
            title: detail.title,
            content: detail.content,
            createdAt: detail.createdAt
    }
    res.json({
        data,
    });
    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "상세조회실패error"})
        }
    
});

// 게시글 수정
router.put("/:_postId", async (req, res) => { 
    try{
    const { _postId } = req.params; // 위의 주소와 일치시키는게 좋음.
    const { user, title, password, content } = req.body;   
    
    const existArticle = await Post.findOne({ _id: _postId, password }); // 수정은 글 하나를 골라서 하는거니까 findOne()

    if (existArticle.password == password) { // 그냥 existArticle을 넣으면 불린값으로 참거짓 판별, 값이 있으면 1이니 true, 없으면 0이니 false
        await Post.updateOne({ _id: _postId }, { $set: { title, content } });
    } else {
        return res.status(400).json({ 
            success: false, msg: "비밀번호가 일치하지 않습니다!" 
        });
    }

    res.json({ 
        success: true, msg: "게시글을 수정하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "게시글수정실패error"})
        }
});

// 게시글 삭제
router.delete("/:_postId", async (req, res) => {
    try{
    const { _postId } = req.params; // req.params._postId의 구조분해할당
    const { password } = req.body; // req.body.password의 구조분해할당
  
    const existArticle = await Post.findOne({ _id: _postId }); // 스키마에서 패스워드를 스트링으로 받았으면 여기도 스트링

    if (existArticle.password == password) { 
        await Post.deleteOne({ _postId });
    } else {
        return res.status(400).json({ 
            success: false, msg: "비밀번호가 일치하지 않습니다!" 
        });
    }
    
    res.json({ 
        success: true, msg: "게시글을 삭제하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "게시글삭제실패error"})
        }
});

module.exports = router;