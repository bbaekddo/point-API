import express, {Application} from 'express';
import compression from "compression";
import methodOverride from 'method-override';
import reviewRoute from '../src/Review/reviewRoute';
// import boolParser from 'express-query-boolean';

export default function (): Application {
    const app: Application = express();

    // express 옵션 설정
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());

    // 서버 라우팅
    reviewRoute.route(app);

    return app;
}