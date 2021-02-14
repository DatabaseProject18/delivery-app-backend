import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { SearchProducts, SearchFilterProducts } from "../models/product";

const searchProducts = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await SearchProducts(+req.params.product_id);
        },
      ],
    };
    return rHandlerData;
  };
  
  const searchFilterProducts = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await SearchFilterProducts(+req.params.category_id);
        },
      ],
    };
    return rHandlerData;
  };

  export { searchProducts, searchFilterProducts }