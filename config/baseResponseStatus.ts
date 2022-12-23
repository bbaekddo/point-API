export default {
    // Success
    SUCCESS: {"isSuccess": true, "code": 1000, "message": "성공"},
    
    // Request error
    SIGNUP_PHONE_LENGTH: {"isSuccess": false, "code": 2001, "message": "핸드폰 번호의 길이가 맞지 않습니다"},
    SIGNUP_PHONE_TYPE  : {"isSuccess": false, "code": 2002, "message": "핸드폰 번호는 숫자만 입력해주세요"},
    
    
    // Response error
    SIGNUP_REDUNDANT_NICKNAME: {"isSuccess": false, "code": 3001, "message": "중복된 닉네임입니다"},
    SIGNUP_USER_NOT_FOUND    : {"isSuccess": false, "code": 3002, "message": "가입한 계정 정보를 찾을 수 없습니다"},
    
    //Connection, Transaction 등의 서버 오류
    DB_ERROR: {"isSuccess": false, "code": 4000, "message": "데이터 베이스 에러"}
};