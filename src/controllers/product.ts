import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  SearchProducts,
  SearchFilterProducts,
  getSearchByProductName,
  getSearchByProductNameFilterCategory,
  getAllCategories,
  getSearchResultCount,
  getCategorySearchResultCount,
} from "../models/product";
import config from "config";

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

const searchByProductName = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        offset: Joi.number().required(),
        name: Joi.string().required(),
        category: Joi.number(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        let result, count;
        if (req.query.category) {
          result = await getSearchByProductNameFilterCategory(
            parseInt(req.query.category.toString()),
            parseInt(req.query.offset.toString()),
            req.query.name.toString()
          );
          count = await getCategorySearchResultCount(
            req.query.name.toString(),
            parseInt(req.query.category.toString())
          );
        } else {
          result = await getSearchByProductName(
            parseInt(req.query.offset.toString()),
            req.query.name.toString()
          );
          count = await getSearchResultCount(req.query.name.toString());
        }
        if (result.error) {
          return result;
        }

        if (count.error) {
          return count;
        }

        result.data.single = [
          count.data.multiple[0].count,
          config.get("items_per_page"),
        ];

        return result;
      },
    ],
  };
  return rHandlerData;
};

const allCategories = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getAllCategories();
      },
    ],
  };
  return rHandlerData;
};

export {
  searchProducts,
  searchFilterProducts,
  searchByProductName,
  allCategories,
};
