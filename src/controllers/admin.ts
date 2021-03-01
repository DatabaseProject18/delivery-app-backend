import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { enableUserAccount, disableUserAccount } from "../models/admin";

const enableAccount = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "admin",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await enableUserAccount(
          parseInt(req["user"]["user_id"].toString())
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
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await disableUserAccount(
          parseInt(req["user"]["user_id"].toString())
        );
      },
    ],
  };
  return rHandlerData;
};

export { enableAccount, disableAccount };
