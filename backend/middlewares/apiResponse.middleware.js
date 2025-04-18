// apiResponse.middleware.js
export const sendApiResponse = (req, res, next) => {
  const originalSend = res.send;
  res.send = function (apiResponse) {
    if (apiResponse instanceof ApiResponse) {
      res.status(apiResponse.statusCode || 200).json(apiResponse.body);
    } else {
      return originalSend.call(res, apiResponse);
    }
  };
  next();
};

export class ApiResponse {
  constructor(body, statusCode = 200, errors) {
    this.body = this.formatResponseBody(body, statusCode, errors);
    this.statusCode = statusCode;
  }

  formatResponseBody(body, statusCode, errors) {
    if (statusCode >= 400) {
      return {
        message: body.message || body,
        errors: errors,
      };
    }
    return body;
  }
}
