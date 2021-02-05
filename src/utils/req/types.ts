import { TokenHandlerData } from "../auth/types";
import { ResponseResult } from "../res/types";
import { ValidateHandlerData } from "../validator/types";

export interface RHandler {
  authSchema: TokenHandlerData;
  validateSchema?: ValidateHandlerData;
  handlers: Array<(data: ResponseResult) => ResponseResult>;
}
