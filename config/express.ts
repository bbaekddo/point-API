import express, {Application} from 'express';
import compression from "compression";
import methodOverride from 'method-override';
import reviewRoute from '../src/Review/reviewRoute';
import swaggerUI from 'swagger-ui-express';
import YAML from 'yamljs';
import path from "path";
// import boolParser from 'express-query-boolean';

export default function (): Application {
    const app: Application = express();

    // swagger 설정 파일 연동
    const swaggerYaml = YAML.load(path.join(__dirname, './swagger.yaml'));

    // express 옵션 설정
    app.use(compression());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(methodOverride());
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerYaml));

    // 서버 라우팅
    reviewRoute.route(app);

    return app;
}