// 포인트 적립 응답 객체
interface CreatePoint {
    reviewId: string | null,
    content: string,
    userId: string | null,
    productId: string | null
}

export {
    CreatePoint,
}