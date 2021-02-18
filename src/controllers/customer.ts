import { Request, Response } from "express";
import { getAllCustomerTypes } from "../models/customer";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";

const getCustomerTypes = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getAllCustomerTypes();
      },
    ],
  };
  return rHandlerData;
};

export { getCustomerTypes };
