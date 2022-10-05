const express = require("express");
const app = express();
const port = 3000;
const indexRouter = require("./routes/index");
const connect = require("./schemas/index");

connect(); // 스키마인덱스 연결

app.use(express.json()); // 바디파서가 라우트 위에 있어야 req.body로 들어오는 값을 파싱해서 결과를 내보낸다.

app.use(indexRouter); // 라우트인덱스 연결

app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});

