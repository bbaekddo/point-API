import reviewProvider from './reviewProvider';
import baseResponse from '../../config/baseResponseStatus';
import {response, errResponse} from '../../config/response';
import {v4 as uuidv4} from 'uuid';
import {CreatePoint} from '../../config/responseInterface';

// Use Prisma
import {PrismaClient, User, Product, Review, UserPoint} from '@prisma/client';

const prisma = new PrismaClient();

// Service Create, Update, Delete 로직 처리
// 사용자 생성
const createUser = async function (userName: string): Promise<object> {
    // 기존 사용자 이름 확인
    let userNameResult: object[];
    try {
        userNameResult = await reviewProvider.retrieveUserName(userName);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 사용자 이름이 이미 있을 경우
    if (userNameResult.length > 0) {
        return errResponse(baseResponse.USER_DUPLICATE_NAME);
    }

    // UUID 생성
    const uuid: string = uuidv4();

    try {
        // 사용자 생성
        const newUser: object = await prisma.user.create({
            data: {
                uuid: uuid,
                name: userName
            }
        });

        return response(baseResponse.SUCCESS, newUser);
    } catch (error) {
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 상품 생성
const createProduct = async function (title: string, content: string): Promise<object> {
    // UUID 생성
    const uuid: string = uuidv4();

    try {
        // 상품 생성
        const newProduct: object = await prisma.product.create({
            data: {
                uuid,
                title,
                content
            }
        });

        return response(baseResponse.SUCCESS, newProduct);
    } catch (error) {
        return errResponse(baseResponse.DB_ERROR);
    }
};

// 포인트 적립
const createPoint = async function (user: User, product: Product, content: string, contentScore: boolean): Promise<object> {
    // 사용자가 작성한 리뷰 확인
    let userReviewResult: { uuid: string | null }[];
    try {
        userReviewResult = await reviewProvider.retrieveReviewByUserId(user.id);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 사용자가 이미 작성한 리뷰가 있을 경우
    if (userReviewResult.length > 0) {
        return errResponse(baseResponse.USER_REVIEW_ALREADY_DONE);
    }

    // 상품의 리뷰 개수 확인
    let reviewCountResult: { uuid: string | null }[];
    try {
        reviewCountResult = await reviewProvider.retrieveReviewByProductId(product.id);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 상품의 첫 리뷰인지 확인
    let firstReviewScore = false;
    if (reviewCountResult.length < 1) {
        firstReviewScore = true;
    }

    // 포인트 결정
    let currentPoint: number = user.point;
    let point: number = 0;
    // 내용 점수
    if (contentScore) {
        point++;
    }
    // 보너스 점수
    if (firstReviewScore) {
        point++;
    }
    // 포인트 합산
    currentPoint += point;

    // UUID 생성
    const uuid: string = uuidv4();

    // 포인트 적립
    try {
        // 리뷰 작성
        const newReview = prisma.review.create({
            data: {
                uuid: uuid,
                user: user.id,
                product: product.id,
                content: content
            }
        });

        // 사용자 포인트 점수 업데이트
        const userPoint = prisma.user.updateMany({
            where: {
                id: user.id
            },
            data: {
                point: currentPoint
            }
        });

        // 트랜잭션 처리
        if (contentScore && firstReviewScore) {
            // 내용 점수와 보너스 점수를 받을 경우
            await prisma.$transaction([newReview, userPoint,
                prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: product.id,
                        point: 1,
                        reason: '1자 이상 텍스트 작성',
                        type: 1
                    }
                }), prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: product.id,
                        point: 1,
                        reason: '특정 상품의 첫 리뷰 작성',
                        type: 2
                    }
                })]);
        } else if (contentScore && !firstReviewScore) {
            // 내용 점수만 받을 경우
            await prisma.$transaction([newReview, userPoint,
                prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: product.id,
                        point: 1,
                        reason: '1자 이상 텍스트 작성',
                        type: 1
                    }
                })]);
        } else if (!contentScore && firstReviewScore) {
            // 보너스 점수만 받을 경우
            await prisma.$transaction([newReview, userPoint,
                prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: product.id,
                        point: 1,
                        reason: '특정 상품의 첫 리뷰 작성',
                        type: 2
                    }
                })]);
        } else {
            // 점수를 못 받을 경우
            await prisma.$transaction([newReview]);
        }
    } catch (error) {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 리뷰 UUID 확인
    try {
        userReviewResult = await reviewProvider.retrieveReviewByUserId(user.id);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 최종 응답 객체
    const finalResponse: CreatePoint = {
        reviewId: userReviewResult[0].uuid,
        content: content,
        userId: user.uuid,
        productId: product.uuid
    }

    return response(baseResponse.SUCCESS, finalResponse);
};

// 포인트 수정
const updatePoint = async function (user: User, review: Review, content: string, contentScore: boolean): Promise<object> {
    // 사용자가 받은 포인트 확인
    let userPointResult: UserPoint[];
    try {
        userPointResult = await reviewProvider.retrieveUserPointByUserAndProductId(user.id, review.product);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 내용 점수로 받은 포인트가 있는지 확인
    let checkPointHistory: boolean = false;
    for (let userPoint of userPointResult) {
        if (userPoint.type === 1) {
            checkPointHistory = true
        }
    }

    // TODO: 회수 부분 삭제
    // 포인트 결정
    let currentPoint: number = user.point;
    let point: number = 0;
    // 내용 점수를 받을 경우
    if (!checkPointHistory && contentScore) {
        point++;
    } else if (checkPointHistory && !contentScore) {
        // 내용 점수를 회수할 경우
        point--;
    }
    // 포인트 합산
    currentPoint += point;

    // 포인트 적립
    try {
        // 리뷰 수정
        const updateReview = prisma.review.updateMany({
            where: {
                id: review.id
            },
            data: {
                content: content
            }
        });

        // 트랜잭션 처리
        if (!checkPointHistory && contentScore) {
            // 내용 점수를 받을 경우
            await prisma.$transaction([updateReview,
                prisma.user.updateMany({
                    where: {
                        id: user.id
                    },
                    data: {
                        point: currentPoint
                    }
                }),
                prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: review.product,
                        point: point,
                        reason: '1자 이상 텍스트 작성',
                        type: 1
                    }
                })]);
        } else if (checkPointHistory && !contentScore) {
            // 내용 점수를 회수할 경우
            await prisma.$transaction([updateReview,
                prisma.user.updateMany({
                    where: {
                        id: user.id
                    },
                    data: {
                        point: currentPoint
                    }
                }),
                prisma.userPoint.create({
                    data: {
                        user: user.id,
                        product: review.product,
                        point: point,
                        reason: '내용 점수 회수',
                        type: 3
                    }
                })]);
        } else {
            // 점수를 못 받을 경우
            await prisma.$transaction([updateReview]);
        }
    } catch (error) {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 리뷰 확인
    let reviewResult: Review[];
    try {
        reviewResult = await reviewProvider.retrieveReviewByUUID(review.uuid);
    } catch {
        return errResponse(baseResponse.DB_ERROR);
    }

    // 최종 응답 객체
    const finalResult = {
        uuid : reviewResult[0].uuid,
        content: reviewResult[0].content
    };

    return response(baseResponse.SUCCESS, finalResult);
};

export default {
    createUser,
    createProduct,
    createPoint,
    updatePoint,
}