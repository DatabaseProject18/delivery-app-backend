import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  getUserDetails,
  getUserFullDetails,
  getUsersDetailsWithAccountStatus,
} from "../models/user";

const userDetails = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getUserDetails();
      },
    ],
  };
  return rHandlerData;
};

const userFullDetails = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getUserFullDetails(+req.params.user_id);
      },
    ],
  };
  return rHandlerData;
};

const usersDetailsWithAccountStatus = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "admin",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getUsersDetailsWithAccountStatus();
      },
    ],
  };
  return rHandlerData;
};

export { userDetails, userFullDetails, usersDetailsWithAccountStatus };
