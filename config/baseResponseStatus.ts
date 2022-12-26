export default {
    // Success
    SUCCESS: {"isSuccess": true, "code": 1000, "message": "성공"},
    
    // Request error
    USER_NOT_FOUND: {"isSuccess": false, "code": 2001, "message": "사용자를 찾을 수 없습니다"},
    PRODUCT_NOT_FOUND: {"isSuccess": false, "code": 2002, "message": "상품을 찾을 수 없습니다"},
    REVIEW_NOT_FOUND: {"isSuccess": false, "code": 2003, "message": "리뷰를 찾을 수 없습니다"},
    REVIEW_WRITER_WRONG: {"isSuccess": false, "code": 2004, "message": "리뷰를 작성한 사용자가 아닙니다"},

    
    // Response error
    USER_DUPLICATE_NAME: {"isSuccess": false, "code": 3001, "message": "중복된 이름입니다"},
    USER_REVIEW_ALREADY_DONE: {"isSuccess": false, "code": 3002, "message": "기존에 작성한 리뷰가 있습니다"},

    //Connection, Transaction 등의 서버 오류
    DB_ERROR: {"isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"}
};