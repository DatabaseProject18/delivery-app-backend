import { Request, Response } from "express";
import Joi from "joi";
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
          from: "city",
        });
      },
    ],
  };
  return rHandlerData;
};

const insertStudent = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    validateSchema: {
      body: {
        ID: Joi.string().min(4).max(8).required(),
        name: Joi.string().min(5).required(),
        dept_name: Joi.string().required(),
        tot_cred: Joi.number().min(50).required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await queryBuilder({
          insert: {
            tableName: "student",
            columns: null,
            values: Object.values(req.body),
          },
        });
      },
    ],
  };

  return rHandlerData;
};

export { getStudents, insertStudent };
