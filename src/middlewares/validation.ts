import { NextFunction, Request, Response } from "express";
import _ from "lodash";
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
  if (schema) {
    let response: ResponseResult = {};

    const method = ["body", "query", "params"];

    method.map((m) => {
      if (schema[m]) {
        let result: ValidateResult = validate(schema[m], req[m]);

        if (result) {
          _.set(response, `error.multiple.${m}`, result);
        }
      }
    });

    if (response.error) {
      response.resCode = 400;
      responseBulider(res)(response);
      return;
    }
  }
  next();
};

export default validateData;
