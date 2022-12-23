import express from './config/express';
import * as dotenv from 'dotenv';

// express 앱 설정
const app = express();

// 환경변수 불러오기
dotenv.config({
    path: `.env.${process?.env?.NODE_ENV ?? 'development'}`
});

// 포트 설정
const port: number = Number(process.env.PORT);

// 서버 시작
app.listen(port, () => {
    console.log(`${process.env.NODE_ENV} - Node.js Server Start At Port ${port}`)
});