# 포인트 API Server

Node.js(Typescript) API Server

## Features

- typescript
- Node.js
- express framework
- REST API
- Prisma (ORM)

## Folder Structure

```
.
├── config                              # 설정 파일
│   ├── express.ts                      # express 옵션
│   ├── response.ts                     # API 응답 프레임
│   ├── baseResponseStatus.ts           # API 응답 코드 및 메세지
├── node_modules                        # 노드 모듈
├── db                                  # sqlite 파일
├── prisma                              # prisma 스키마
├── src
│   ├── app                             # 어플리케이션에 대한 코드
│   │   ├── Review                      # Review 관련 코드
│   │   │   ├── reviewRoute.ts
│   │   │   ├── reviewController.ts
│   │   │   ├── reviewProvider.ts
│   │   │   ├── reviewService.ts
├── .env.development                    # 환경변수                          
├── .gitignore
├── package-lock.json
├── package.json                        # Node.js 정보
├── app.ts                              # 서버 index
├── tsconfig.json                       # 타입스크립트 설정
└── README.md
```

<br>
<br>

---
## 초기 설정
### 1) npm 모듈 설치
```shell
npm install
```

### 2) Prisma Generate
```shell
# db에서 스키마 불러오기
npx prisma db pull

# prisma client에 적용
npx prisma generate
```

### 3) 로컬 서버 구동
```shell
npm run start
```

<br>
<br>

---

## API Connection

본 서버는 포인트 조회, 수정, 적립, 삭제에 대한 API 서버의 기능을 가짐

## DB
- User : 사용자 정보
- Product : 상품 정보
- Review : 상품에 대한 리뷰
- UserPoint : 사용자별 포인트 이력

> PK : Integer 타입의 id 필드
>
> UUID : 클라이언트에서 서버로 요청할 때 사용하는 ID

## UUID 사용법
### 1) 사용자 계정과 상품 등록
테스트 용도로 5개의 사용자 계정과 5개의 상품이 등록되어 있음
필요 시 사용자 등록 API와 상품 등록 API로 추가 가능

### 2) 사용자 UUID 조회
사용자 전체 조회 API로 원하는 사용자 계정 선택 후 UUID 복사 후 사용

### 3) 상품 UUID 조회
상품 조회 API로 원하는 상품 선택 후 UUID 복사 후 사용

### 4) 리뷰 UUID 조회
사용자 UUID를 쿼리에 입력 후 상품 리뷰 조회 API 호출

원하는 리뷰의 UUID 복사 후 사용

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