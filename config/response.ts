interface BaseResponse {
    isSuccess: boolean,
    code: number,
    message: string,
    result?: object | object[];
}
const response = (baseResponse: BaseResponse, result: object | object[]) => {
    baseResponse.result = result;
    return baseResponse;
};

const errResponse = (baseResponse: BaseResponse) => {
    return baseResponse;
};

export {response, errResponse};