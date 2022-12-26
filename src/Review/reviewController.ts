import reviewProvider from './reviewProvider';
import reviewService from './reviewService';
import baseResponse from '../../config/baseResponseStatus';
import {response, errResponse} from '../../config/response';
import {Request, Response} from 'express';

// Prisma Type
import {User, Product, Review, UserPoint} from '@prisma/client'

// 글자수 체크
const byteCounter = function (text: string): number {
    let byte = 0;

    // 한, 중, 일이라면 2바이트로 체크
    for (let i = 0; i < text.length; i++) {
        if (/[ㄱ-ㅎㅏ-ㅣ가-힣一-龥ぁ-ゔァ-ヴー々〆〤]/.test(text[i])) {
            byte = byte + 2
        } else {
            byte++
        }
    }
    return byte
}

/** 전체 사용자 조회 API
 * [GET] /app/users
 */
const getUser = async function (req: Request, res: Response): Promise<Response> {
    // 전체 사용자 목록
    let userResult: object[];
    try {
        userResult = await reviewProvider.retrieveUser();
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 응답
    return res.send(response(baseResponse.SUCCESS, userResult));
};

/** 사용자 등록 API
 * [POST] /app/users
 * body : userName
 */
const postUser = async function (req: Request, res: Response): Promise<Response> {
    // 사용자 이름
    const userName: string = req.body.userName;

    // 사용자 생성
    const postUserResponse: object = await reviewService.createUser(userName);

    // 응답
    return res.send(postUserResponse);
};

/** 전체 상품 조회 API
 * [GET] /app/products
 */
const getProduct = async function (req: Request, res: Response): Promise<Response> {
    // 전체 상품 목록
    let productResult: object[];
    try {
        productResult = await reviewProvider.retrieveProduct();
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 응답
    return res.send(response(baseResponse.SUCCESS, productResult));
};

/** 상품 등록 API
 * [POST] /app/products
 * body : title, content
 */
const postProduct = async function (req: Request, res: Response): Promise<Response> {
    // 상품 제목, 내용
    const {title, content}: {title: string, content: string} = req.body;

    // 상품 등록
    const postProductResponse: object = await reviewService.createProduct(title, content);

    // 응답
    return res.send(postProductResponse);
};




/*
 **************************
 * 과제 API
 **************************
 */

/** 포인트 조회 API
 * [GET] /app/reviews/point
 * query : userId
 */
const getPoint = async function (req: Request, res: Response): Promise<Response> {
    const userId: string = req.query.userId as string;

    // 사용자 계정 조회
    let userResult: User[];
    try {
        userResult = await reviewProvider.retrieveUserById(userId);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 사용자 계정을 조회할 수 없는 경우
    if (userResult.length < 1) {
        return res.send(errResponse(baseResponse.USER_NOT_FOUND));
    }

    // 포인트 이력 조회
    let userPointResult: object[];
    try {
        userPointResult = await reviewProvider.retrieveUserPoint(userResult[0].id);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 최종 응답 객체 생성
    const finalResult = {
        totalPoint: userResult[0].point,
        pointHistory: userPointResult
    };

    // 응답
    return res.send(response(baseResponse.SUCCESS, finalResult));
};

/** 포인트 적립 API
 * [POST] /app/reviews/point
 * body : userId, productId, content
 */
const postPoint = async function (req: Request, res: Response): Promise<Response> {
    // 사용자 ID, 상품 ID, 리뷰 내용
    const {userId, productId, content}: {userId: string, productId: string, content: string} = req.body;

    // 사용자 계정 조회
    let userResult: User[];
    try {
        userResult = await reviewProvider.retrieveUserById(userId);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 사용자 계정을 조회할 수 없는 경우
    if (userResult.length < 1) {
        return res.send(errResponse(baseResponse.USER_NOT_FOUND));
    }

    // 상품 조회
    let productResult: Product[];
    try {
        productResult = await reviewProvider.retrieveProductById(productId);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 상품을 조회할 수 없는 경우
    if (productResult.length < 1) {
        return res.send(errResponse(baseResponse.PRODUCT_NOT_FOUND));
    }

    // 리뷰 내용 길이 검사
    let contentScore: boolean = false;
    if (content !== undefined && content !== null) {
        const contentLength = byteCounter(content);

        // 내용이 1자 이상 작성될 경우 1점
        if (contentLength > 0) {
            contentScore = true;
        }
    }

    // 포인트 적립
    const postPointResponse: object = await reviewService.createPoint(userResult[0], productResult[0], content, contentScore);

    // 응답
    return res.send(postPointResponse);
};

/** 포인트 수정 API
 * [PATCH] /app/reviews/point
 * body : reviewId, content
 */
const patchPoint = async function (req: Request, res: Response): Promise<Response> {
    // 사용자 ID, 상품 ID, 리뷰 내용
    const {userId, productId, content}: {userId: string, productId: string, content: string} = req.body;

    // 사용자 계정 조회
    let userResult: User[];
    try {
        userResult = await reviewProvider.retrieveUserById(userId);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 사용자 계정을 조회할 수 없는 경우
    if (userResult.length < 1) {
        return res.send(errResponse(baseResponse.USER_NOT_FOUND));
    }

    // 상품 조회
    let productResult: Product[];
    try {
        productResult = await reviewProvider.retrieveProductById(productId);
    } catch {
        return res.send(errResponse(baseResponse.DB_ERROR));
    }

    // 상품을 조회할 수 없는 경우
    if (productResult.length < 1) {
        return res.send(errResponse(baseResponse.PRODUCT_NOT_FOUND));
    }

    // 리뷰 내용 길이 검사
    let contentScore: boolean = false;
    if (content !== undefined && content !== null) {
        const contentLength = byteCounter(content);

        // 내용이 1자 이상 작성될 경우 1점
        if (contentLength > 0) {
            contentScore = true;
        }
    }

    // 포인트 적립
    const postPointResponse: object = await reviewService.createPoint(userResult[0], productResult[0], content, contentScore);

    // 응답
    return res.send(postPointResponse);
};



export default {
    getUser,
    postUser,
    getProduct,
    postProduct,
    getPoint,
    postPoint,
    patchPoint,
}