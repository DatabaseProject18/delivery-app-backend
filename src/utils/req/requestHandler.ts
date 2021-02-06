import { NextFunction, Request, RequestHandler, Response } from "express";
import _ from "lodash";
import { pipe } from "lodash/fp";
import authorizeUser from "../../middlewares/auth";
import validateData from "../../middlewares/validation";
import { responseBulider, ResponseResult } from "../res/responseBuilder";
import { AuthHandlerData } from "../token/tokenManager";
import { ValidateHandlerData } from "../validator/inspector";

export interface RHandler {
  authSchema: AuthHandlerData;
  validateSchema?: ValidateHandlerData;
  handlers: Array<
    (
      req: Request,
      res: Response
    ) => (data: ResponseResult) => Promise<ResponseResult>
  >;
}

const makeRequestHandlerArray = (
  handlerObj: RHandler
): Array<RequestHandler> => {
  const handlerFunctions: Array<RequestHandler> = [
    async (req: Request, res: Response, next: NextFunction) => {
      const tempFunc = authorizeUser(handlerObj.authSchema);
      await tempFunc(req, res, next);
    },
    validateData(handlerObj.validateSchema),
    (req: Request, res: Response): void => {
      const functions = [];

      handlerObj.handlers.map((func) => {
        functions.push(
          async (
            responseResult: Promise<ResponseResult>
          ): Promise<ResponseResult> => {
            const data = await responseResult;
            const tempFunc = func(req, res);
            return await tempFunc(data);
          }
        );
      });

      const responseHandler = async (
        responseResult: Promise<ResponseResult>
      ) => {
        const data = await responseResult;
        if (!data.resCode) {
          data.resCode = 500;
          _.set(data, "error.single", "Internal Server Error");
          responseBulider(res)(data);
          return;
        }
        responseBulider(res)(data);
      };

      functions.push(responseHandler);

      const composeFunc = pipe(...functions);
      composeFunc(new Promise((resolve) => resolve({})));
    },
  ];

  return handlerFunctions;
};

const handleRequest = (
  controllerFileName: string,
  methodName: string
): Array<RequestHandler> => {
  const methods = require(`../../controllers/${controllerFileName}`);
  const handlerObj: RHandler = methods[methodName]();

  return makeRequestHandlerArray(handlerObj);
};

export default handleRequest;
