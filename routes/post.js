const express = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const router = express.Router();
const { Post } = require("../models");

//게시글 작성
router.post('/',authMiddleware,async (req, res) => { //post누르면 정보가 담겨있음 
    // try{
    const { user } = res.locals;
    const { title, content, } = req.body; //저장해야할 정보를 받아와서 변수에 등록시킨다. req.body에 정보가 들어있음
    const createdAt = new Date(); //날짜 지정 yyyddmmm이거 쓰기 나중에 하자!!
    const updatedAt = new Date();

    await Post.create({
        userId : user.userId,
        nickname : user.nickname,
        title,
        content,
        createdAt,
        updatedAt,
        likes : 0,
    }); //스키마.db에 정보를 만들어준다 //앞에는 키값 : 벨류값 중복되는 이름일시 객체구조분해 활용

    res.status(201).send({'message': "게시글을 생성하였습니다."}); //스키마 Post 아이디로 정보를 저장하고 만들어줌
    // }catch(error){ //catch가 에러를 받는다.
    // console.log(error)
    // res.status(400).send({'message': "작성실패error"}) //에러 400 try catch try문 안에 에러가 나면 catch가 잡아줘서 에러문구를 보내준다.(서버가 꺼지지 않음)
    // }
    });

// 게시글 조회(로그인 검사 제외)
router.get("/", async (req, res, next) => {
    try{
      const posts = await Post.findAll({attributes:{ exclude:["content"]}, order : [["createdAt", "DESC"]], })
      res.json({
        posts,
    })
  }
    catch(error){ // catch가 에러를 받는다.
      console.log(error)
    res.status(400).send({'message': "게시글 작성하기 error"})}
});


// 게시글 상세 조회(로그인 검사 제외)
router.get("/:postId", async (req, res) => { 
    try {
    // const { _id } = req.params;
    // const [detail] = await Post.find({ _postId: _id }) find로 불러오면 배열로 반환되니 변수에 대괄호를 칠 필요가 없음.
    const { postId } = req.params; // const _postId = req.params._postId를 구조분해할당한 형태

    const post = await Post.findOne({ where:{ postId } }) //앞이 디비의 키값
    res.json({ post:post });
    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "상세조회실패error"})
        }
    
});

// 게시글 수정
router.put("/:postId", authMiddleware, async (req, res) => { 
    try{
    const { postId } = req.params; // 위의 주소와 일치시키는게 좋음.
    const { title, content } = req.body;   
    
    const existArticle = await Post.update({ title, content },{ where: { postId } }); // 수정은 글 하나를 골라서 하는거니까 findOne()

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
router.delete("/:postId", authMiddleware, async (req, res) => {
    try{
    const { postId } = req.params; // req.params._postId의 구조분해할당
  
    const existArticle = await Post.destroy({ where: { postId} }); // 스키마에서 패스워드를 스트링으로 받았으면 여기도 스트링

    res.json({ 
        msg: "게시글을 삭제하였습니다." 
    });

    }
    catch(error){
        console.log(error)
        res.status(400).send({'message': "게시글삭제실패error"})
        }
});

module.exports = router;