import {Application} from "express";
import review from './reviewController';

export default {
    route (app: Application): void {
        // 사용자 API
        app.route('/users')
            .get(review.getUser)
            .post(review.postUser);

        // 상품 API
        app.route('/products')
            .get(review.getProduct)
            .post(review.postProduct);

        // 리뷰 API
        app.route('/reviews')
            .get(review.getReview);

        // 포인트 API
        app.route('/reviews/point')
            .get(review.getPoint)
            .post(review.postPoint)
            .patch(review.patchPoint)
            .delete(review.deletePoint);
    }
}