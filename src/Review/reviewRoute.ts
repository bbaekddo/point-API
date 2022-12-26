import {Application} from "express";
import review from './reviewController';

export default {
    route (app: Application): void {
        // 사용자 API
        app.route('/app/users')
            .get(review.getUser)
            .post(review.postUser);

        // 상품 API
        app.route('/app/products')
            .get(review.getProduct)
            .post(review.postProduct);

        // 포인트 API
        app.route('/app/reviews/point')
            .get(review.getPoint)
            .post(review.postPoint)
            .patch(review.patchPoint);

    }
}