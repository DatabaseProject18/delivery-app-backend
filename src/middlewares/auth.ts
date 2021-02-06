import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { responseBulider, ResponseResult } from "../utils/res/responseBuilder";
import {
  AuthHandlerData,
  TokenType,
  validateToken,
} from "../utils/token/tokenManager";

const authorizeUser = (authSchema: AuthHandlerData) => async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (authSchema.hasToken) {
    const response: ResponseResult = {};

    const token = req.headers["auth-token"] as string | undefined;

    if (!token) {
      response.resCode = 401;
      response.error.single = "Authorization token is not provided";
      responseBulider(res)(response);
      return new Promise((resolve) => resolve());
    }

    const payload = await validateToken(token, TokenType.ACCESS);

    if (!payload) {
      response.resCode = 403;
      response.error.single = "Authorization token is invalid";
      responseBulider(res)(response);
      return new Promise((resolve) => resolve());
    }

    if (payload.userType !== authSchema.userType) {
      response.resCode = 403;
      response.error.single =
        "You have not permission to access these resources";
      responseBulider(res)(response);
      return new Promise((resolve) => resolve());
    }

    _.set(req, "user", payload);
  }
  next();
};

export default authorizeUser;
