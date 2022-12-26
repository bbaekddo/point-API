// Use Prisma
import {PrismaClient, User, Product, Review, UserPoint} from '@prisma/client'
const prisma = new PrismaClient()

// Provider : Read 비즈니스 로직 처리
// 사용자 전체 조회
const retrieveUser = async function (): Promise<object[]> {
    try {
        return await prisma.user.findMany({
            select : {
                uuid: true,
                name: true
            }
        });
    } catch (error) {
        throw error;
    }
};

// 사용자 이름 확인
const retrieveUserName = async function (userName: string): Promise<object[]> {
    try {
        return await prisma.user.findMany({
            where : {
                name: userName
            }
        });
    } catch (error) {
        throw error;
    }
};

// 전체 상품 조회
const retrieveProduct = async function (): Promise<object[]> {
    try {
        return await prisma.product.findMany({
            select: {
                uuid: true,
                title: true,
                content: true
            }
        });
    } catch (error) {
        throw error;
    }
};

// 사용자 계정 조회
const retrieveUserById = async function (userId: string): Promise<User[]> {
    try {
        return await prisma.user.findMany({
            where: {
                uuid: userId
            }
        });
    } catch (error) {
        throw error;
    }
};

// 상품 조회
const retrieveProductById = async function (productId: string): Promise<Product[]> {
    try {
        return await prisma.product.findMany({
            where: {
                uuid: productId
            }
        });
    } catch (error) {
        throw error;
    }
};

// 사용자가 작성한 리뷰 조회
const retrieveReviewByUserAndProductId = async function (userId: number, productId: number): Promise<{uuid: string | null}[]> {
    try {
        return await prisma.review.findMany({
            where: {
                user: userId,
                product: productId
            },
            select: {
                uuid: true,
            }
        });
    } catch (error) {
        throw error;
    }
};

// 리뷰 개수 조회
const retrieveReviewByProductId = async function (productId: number): Promise<{uuid: string | null}[]> {
    try {
        return await prisma.review.findMany({
            where: {
                product: productId
            },
            select: {
                uuid: true,
            }
        });
    } catch (error) {
        throw error;
    }
};

// 사용자가 작성한 리뷰 조회 (by UUID)
const retrieveReviewByUUID = async function (uuid: string | null): Promise<Review[]> {
    try {
        return await prisma.review.findMany({
            where: {
                uuid
            }
        });
    } catch (error) {
        throw error;
    }
};

// 사용자 리뷰 조회
const retrieveUserReview = async function (userId: number): Promise<object[]> {
    try {
        return await prisma.review.findMany({
            where: {
                user: userId
            },
            select: {
                Product: {
                    select: {
                        title: true,
                        content: true
                    }
                },
                content: true
            }
        });
    } catch (error) {
        throw error;
    }
};

// 포인트 이력 조회
const retrieveUserPoint = async function (userId: number): Promise<object[]> {
    try {
        return await prisma.userPoint.findMany({
            where: {
                user: userId
            },
            select: {
                Product: {
                    select: {
                        title: true,
                        content: true
                    }
                },
                point: true,
                reason: true
            }
        });
    } catch (error) {
        throw error;
    }
};

// 특정 상품의 포인트 조회
const retrieveUserPointByUserAndProductId = async function (userId: number, productId: number): Promise<UserPoint[]> {
    try {
        return await prisma.userPoint.findMany({
            where: {
                user: userId,
                product: productId
            }
        });
    } catch (error) {
        throw error;
    }
};


export default {
    retrieveUser,
    retrieveUserName,
    retrieveProduct,
    retrieveUserById,
    retrieveProductById,
    retrieveReviewByUserAndProductId,
    retrieveReviewByProductId,
    retrieveReviewByUUID,
    retrieveUserReview,
    retrieveUserPoint,
    retrieveUserPointByUserAndProductId,
}