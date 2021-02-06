import { NextFunction, Request, Response } from "express";
import { responseBulider, ResponseResult } from "../utils/res/responseBuilder";
import {
  validate,
  ValidateHandlerData,
  ValidateResult,
} from "../utils/validator/inspector";

const validateData = (schema: ValidateHandlerData) => (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let result: ValidateResult;
  let response: ResponseResult;

  const method = ["body", "query", "params"];

  method.map((m) => {
    if (schema[m]) {
      result = validate(schema[m], req[m]);

      if (result) {
        response.resCode = 400;
        response.error.multiple = result;
        responseBulider(res)(response);
        return;
      }

      next();
    }
  });
};

export default validateData;
