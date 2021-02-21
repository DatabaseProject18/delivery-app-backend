import { NextFunction, Request, Response } from "express";
import _ from "lodash";
import { responseBulider, ResponseResult } from "../utils/res/responseBuilder";
import {
  AuthHandlerData,
  TokenType,
  validateToken,
} from "../utils/token/tokenManager";

const authorizeUser = (authSchema: AuthHandlerData) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const response: ResponseResult = {};

  if (authSchema.hasAccessToken !== undefined) {
    if (authSchema.hasAccessToken) {
      const token: string = req.headers["scms-auth-token"] as
        | string
        | undefined;

      if (!token) {
        response.resCode = 401;
        _.set(response, "error.single", "Authorization token is not provided");
        responseBulider(res)(response);
        return;
      }

      const payload: { [name: string]: any } = validateToken(
        token,
        TokenType.ACCESS
      );

      if (!payload) {
        response.resCode = 403;
        _.set(response, "error.single", "Authorization token is invalid");
        responseBulider(res)(response);
        return;
      }

      if (authSchema.userType && payload.user_type !== authSchema.userType) {
        response.resCode = 403;
        _.set(
          response,
          "error.single",
          "You have not permission to access these resources"
        );
        responseBulider(res)(response);
        return;
      }

      _.set(
        req,
        "user",
        _.pick(payload, [
          "user_id",
          "first_name",
          "user_type",
          `${payload.user_type}`,
        ])
      );
    }
  }

  if (authSchema.hasRefreshToken !== undefined) {
    if (authSchema.hasRefreshToken) {
      if (!req.body.refreshToken) {
        response.resCode = 401;
        _.set(response, "error.single", "Refresh token is not provided");
        responseBulider(res)(response);
        return;
      }

      const payload: { [name: string]: any } = validateToken(
        req.body.refreshToken,
        TokenType.REFRESH
      );

      if (!payload) {
        response.resCode = 403;
        _.set(response, "error.single", "Refresh token is invalid");
        responseBulider(res)(response);
        return;
      }

      if (authSchema.userType && payload.user_type !== authSchema.userType) {
        response.resCode = 403;
        _.set(
          response,
          "error.single",
          "You have not permission to Access these resources"
        );
        responseBulider(res)(response);
        return;
      }

      req.body.tokenData = _.pick(payload, [
        "user_id",
        `${payload.user_type}_id`,
        "first_name",
        "user_type",
      ]);
    }
  }

  if (
    authSchema.hasAccessToken !== undefined &&
    authSchema.hasRefreshToken !== undefined
  ) {
    if (!authSchema.hasAccessToken && !authSchema.hasRefreshToken) {
      const token: string = req.headers["scms-auth-token"] as
        | string
        | undefined;

      if (token && req.body.refreshToken) {
        const payload1: { [name: string]: any } = validateToken(
          token,
          TokenType.ACCESS
        );

        const payload2: { [name: string]: any } = validateToken(
          req.body.refreshToken,
          TokenType.REFRESH
        );

        if ((!payload1 && payload2) || (payload1 && payload2)) {
          response.resCode = 400;
          _.set(response, "error.single", "You are already login.");
          responseBulider(res)(response);
          return;
        }
      }
    }
  }

  next();
};

export default authorizeUser;
