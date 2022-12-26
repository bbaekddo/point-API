# 포인트 API Server

Node.js(Typescript) API Server

## Features

- typescript
- Node.js
- express
- RESTful API
- Prisma (ORM)
- Swagger API(API Test)

## Folder Structure

```
.
├── config                              # 설정 파일
│   ├── baseResponseStatus.ts           # API 응답 코드 및 메세지
│   ├── express.ts                      # express 옵션
│   ├── response.ts                     # API 응답 프레임
│   ├── responseInterface.ts            # 응답 객체 인터페이스
│   ├── swagger.yaml                    # swagger API 설정
├── node_modules                        # 노드 모듈
├── db                                  # sqlite 파일
├── prisma                              # prisma 스키마
├── src
│   ├── app                             # 어플리케이션에 대한 코드
│   │   ├── Review                      
│   │   │   ├── reviewRoute.ts          # 라우팅 설정
│   │   │   ├── reviewController.ts     # 유효성 검사
│   │   │   ├── reviewProvider.ts       # R 로직 처리
│   │   │   ├── reviewService.ts        # CUD 로직 처리
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
> 
> UserPoint(Type)
> - 1 : 내용 점수
> - 2 : 보너스 점수
> - 3 : 내용 점수 회수
> - 4 : 리뷰 삭제

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

## API 테스트
- 서버 구동 후 swagger API 접속
> http://localhost:3000/api-docs

- Point 태그 그룹 내 API 테스트

## 비고
- 라우팅 디렉토리와 파일은 원래 기능별로 구분하려고 했으나, 작업 편의상 Review 폴더 내에 모두 합쳐서 구현했습니다
- 사용자가 리뷰를 수정할 때 내용 없이 ""(아무값이 없는 string)로 변경할 경우 내용 점수가 회수됩니다 (단, 기존 내용도 "" 라면 회수 작업은 일어나지 않습니다)
- " " (공백)도 1글자 이상으로 처리되어 리뷰 작성 시 내용 점수가 추가됩니다
- 리뷰를 작성한 사용자와 사용자 UUID가 다를 경우 에러를 응답합니다
- 작업 편의상 HTTP Response Code는 200에만 커스텀 메세지를 넣었습니다
- 리뷰 삭제 이력은 무한하게 추가됩니다

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
