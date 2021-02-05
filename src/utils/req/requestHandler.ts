import { Request, RequestHandler, Response } from 'express';
import { ResponseResult } from "../res/responseBuilder";
import { AuthHandlerData } from "../token/tokenManager";
import { ValidateHandlerData } from "../validator/inspector";

export interface RHandler {
    authSchema: AuthHandlerData;
    validateSchema?: ValidateHandlerData;
    handlers: Array<(data: ResponseResult) => ResponseResult>;
  }

const handleRequest = (req:Request,res:Response) => (handlerObj:RHandler):Array<RequestHandler> {
    const handlerFunctions = [

    ]
}
