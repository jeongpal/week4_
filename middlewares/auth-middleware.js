const { appendFile } = require("fs");
const jwt = require("jsonwebtoken");
const { User } = require("../models");


module.exports = (req,res,next) => {
    const { token } = req.cookies
    // console.log(token);  ㅇㅋ
    if(!token) {
        res.status(401).send({
            errorMessage: '로그인 후 사용하세요1',
        });
        return;
    }
    // try {
        const { userId } = jwt.verify(token, "1q2w3e4r");
        // console.log(userId) ㅇㅋ
        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            // console.log(user)
            next();
        });
    // } catch (error) {
        // res.status(401).send({
        //     errorMessage: '로그인 후 사용하세요3',
        // });
        return;
    // }
};