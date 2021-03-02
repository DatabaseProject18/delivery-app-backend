import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { enableUserAccount, disableUserAccount } from "../models/admin";
import Joi from "joi";

const enableAccount = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "admin",
    },
    validateSchema: {
      query: {
        user: Joi.number().required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await enableUserAccount(
          parseInt(req.query.user.toString())
        );
      },
    ],
  };
  return rHandlerData;
};

const disableAccount = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "admin",
    },
    validateSchema: {
      query: {
        user: Joi.number().required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await disableUserAccount(
          parseInt(req.query.user.toString())
        );
      },
    ],
  };
  return rHandlerData;
};

export { enableAccount, disableAccount };
