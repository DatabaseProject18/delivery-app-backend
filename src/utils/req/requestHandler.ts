import { Request, RequestHandler, Response } from "express";
import { pipe } from "lodash/fp";
import authorizeUser from "../../middlewares/auth";
import validateData from "../../middlewares/validation";
import { responseBulider, ResponseResult } from "../res/responseBuilder";
import { AuthHandlerData } from "../token/tokenManager";
import { ValidateHandlerData } from "../validator/inspector";
import { RHandler } from "./requestHandler";

export interface RHandler {
  authSchema: AuthHandlerData;
  validateSchema?: ValidateHandlerData;
  handlers: Array<
    (req: Request, res: Response) => (data: ResponseResult) => ResponseResult
  >;
}

const makeRequestHandlerArray = (
  handlerObj: RHandler
): Array<RequestHandler> => {
  const handlerFunctions: Array<RequestHandler> = [
    authorizeUser(handlerObj.authSchema),
    validateData(handlerObj.validateSchema),
    (req: Request, res: Response): void => {
      const functions = [];

      handlerObj.handlers.map((func, index) => {
        functions.push(func(req, res));
      });

      const responseHandler = (responseResult: ResponseResult) => {
        if (!responseResult.resCode) {
          responseResult.resCode = 500;
          responseResult.error.single = "Internal Server Error";
          responseBulider(res)(responseResult);
          return;
        }
        responseBulider(res)(responseResult);
      };

      functions.push(responseHandler);

      const composeFunc = pipe(...functions);
      composeFunc({});
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
