const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const { User } = require("../models")
const Joi = require("joi")
const authMiddleware = require("../middlewares/auth-middleware");

    
// 회원가입
router.post("/signup", async (req,res) => {
        const check = Joi.object().keys({
            nickname: Joi.string().pattern((new RegExp('^[a-zA-Z0-9]{3,20}$'))).required(),
            password : Joi.string().min(4),
            confirm : Joi.string().min(4)
        });
        const createdAt = new Date();
        const updatedAt = new Date();
        const { nickname , password, confirm } = await check.validateAsync(req.body);
        console.log(nickname, password)
        if (nickname == password) {
            res.status(400).send({
                errorMessage: "닉네임 패스워드가 같다."
            })
        }
    if (password !== confirm) {
        res.status(400).send({
            errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
        });
        return;
    }
    try{
    const existUsers = await User.findOne({
          where: { nickname, }
    });
    // console.log(existUsers)
    if (existUsers) {
        res.status(400).send({
            errorMessage: '중복된 닉네임입니다.',
        });
        return;
    }

    const user = new User({ nickname, password, createdAt, updatedAt });
    await user.save();

    res.status(201).send({
        'message': '회원 가입에 성공하였습니다.'
    })
} catch(error) {
        res.status(400).send({
            errorMessage: "잘못됐다."
        })
    }
}
);

// 로그인
router.post("/login", async (req,res) => {
    try{
        console.log(req.cookies.token)
        if(req.cookies.token) {
            res.status(401).send({
                errorMessage: "이미 로그인 되어있습니다."
            })
        }
    const{ nickname, password } = req.body;

    const user = await User.findOne({ 
        where: { nickname, password }
    });

    if (!user) {
        res.status(400).send({
            errorMessage: '닉네임 또는 패스워드를 확인해주세요.'
        });
        return;
    }

    const token = jwt.sign({ userId: user.userId }, "1q2w3e4r");
    res.cookie('token',token);
    res.send({
        token,
    });
} catch(error) {
    res.status(400).send({
        errorMessage: '로그인에 실패하였습니다.'
    })
}
});


router.get("/me", authMiddleware, async (req,res) => {
    const { user } = res.locals;
    console.log(user);
    res.send({
        user,
    });
});

// router.get("/me", authMiddleware, async (req, res) => {
//     console.log(res.locals);
//     res.send({
//         user,
//     });
// });


module.exports = router;