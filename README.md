# 육아크루 API Server

Node.js(Typescript) API Server

## Features

- typescript
- Node.js
- express framework
- REST API

## Folder Structure

```
.
├── config                              # 설정 파일
│   ├── express.ts                      # express 옵션
│   ├── response.ts                     # API 응답 프레임
│   ├── baseResponseStatus.ts           # API 응답 코드 및 메세지
├── node_modules                        # 노드 모듈
├── src
│   ├── app                             # 어플리케이션에 대한 코드
│   │   ├── User                        # User 관련 코드
│   │   │   ├── userRoute.ts
│   │   │   ├── userController.ts
│   │   │   ├── userProvider.ts
│   │   │   ├── userService.ts
│   │   ├── Review                      # Review 관련 코드
│   │   │   ├── reviewRoute.ts
│   │   │   ├── reviewController.ts
│   │   │   ├── reviewProvider.ts
│   │   │   ├── reviewService.ts
├── .env.development                    # 환경변수                          
├── .gitignore
├── package-lock.json
├── package.json                        # Node.js 정보
└── README.md
```

<br>
<br>

---
## 사용법
### 1) 사용자 등록
1. 

### 2) seeding
1. `prisma/seed.js`에 mock up 데이터 추가 쿼리 작성
2. `npm run seed` 실행
3. `prisma.schema`에 설정된 db에 row 삽입됨(만약 이미 존재하는 경우 unique 규칙에 위반되면 오류 발생)

### 3) DB 초기화 후 처음부터 migration 진행
1. `npx prisma migrate reset`
2. `npm run seed` 로 seeding

### 4) DB에서 스키마 변경 후 작업
```javascript
// db에서 스키마 불러오기
npx prisma db pull

// prisma client에 적용
npx prisma generate
```

### 5) express에서 prisma client 사용
```javascript
const {PrismaClient} = require('@prisma/client');
const prisma = new PrismaClient();
```

---

<br>
<br>

## RESPONSE CODE
`config/response.js`
```javascript
{
    const response = ({isSuccess, code, message}, result) => {
        return {
            isSuccess: isSuccess,
            code: code,
            message: message,
            result: result
        }
    };
    
    const errResponse = ({isSuccess, code, message}) => {
        return {
            isSuccess: isSuccess,
            code     : code,
            message  : message
        }
    };
}
```

<br>
<br>

---

## API Connection

본 서버는 러닝하이(생활운동 앱테크) 서비스에서 사용하는 API로써 역할을 함

### Option 1: Connection Test

서버 연결을 위한 API 테스트 가이드

https://www.sosocamp.shop/app/test/connection 으로 POST 요청
