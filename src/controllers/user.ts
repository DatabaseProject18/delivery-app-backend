import { Request, Response } from "express";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";

const getStudents = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await queryBuilder({
          select: null,
          from: "student",
        });
      },
    ],
  };

  return rHandlerData;
};

export { getStudents };
