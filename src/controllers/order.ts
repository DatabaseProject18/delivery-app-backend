import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { pastOrders } from "../models/order";

const getPastOrders = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            const user_id = 1000; // this should be changed
        return await pastOrders(user_id);
      },
    ],
  };
  return rHandlerData;
};

const getPastOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            const user_id = 1000; // this should be changed
        return await pastOrders(+req.query.user_id);
      },
    ],
  };
  return rHandlerData;
};

export { getPastOrders }
