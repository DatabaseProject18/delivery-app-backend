import { NextFunction, Request, Response } from "express";
import { responseBulider, ResponseResult } from "../utils/res/responseBuilder";
import {
  AuthHandlerData,
  TokenType,
  validateToken,
} from "../utils/token/tokenManager";

const authorizeUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => async (authSchema: AuthHandlerData): Promise<void> => {
  if (authSchema.hasToken) {
    const response: ResponseResult = {};

    const token = req.headers["auth-token"] as string | undefined;

    if (!token) {
      response.resCode = 401;
      response.error.auth = "Authorization token is not provided";
      responseBulider(res)(response);
      return;
    }

    const payload = await validateToken(token, TokenType.ACCESS);

    if (!payload) {
      response.resCode = 403;
      response.error.auth = "Authorization token is invalid";
      responseBulider(res)(response);
      return;
    }

    if (payload.userType !== authSchema.userType) {
      response.resCode = 403;
      response.error.auth = "You have not permission to access these resources";
      responseBulider(res)(response);
      return;
    }
  }
  next();
};

export default authorizeUser;
