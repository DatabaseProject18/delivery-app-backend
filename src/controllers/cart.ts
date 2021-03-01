import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  cart,
  updateCartQuantity,
  deleteFromCart,
  addProduct,
  getDetails,
} from "../models/cart";

const getCart = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        //const customer_id = 1;
        //console.log(req.query)
        return await cart(+req.query.customer_id);
      },
    ],
  };
  return rHandlerData;
};

const setCartQuntity = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        //const customer_id = 1000; // this should be changed
        // return await updateCartQuantity(+req.body.customer_id ,+req.body.cart_id,req.body.quantity);
        return await updateCartQuantity(
          +req.body.customer_id,
          +req.body.cart_id,
          req.body.quantity
        );
      },
    ],
  };
  return rHandlerData;
};

const productDeleteFromCart = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        // const customer_id = 1000; // this should be changed
        //console.log(+req.params.order_id)
        //console.log(req.body.cart_id)
        return await deleteFromCart(+req.body.cart_id);
      },
    ],
  };
  return rHandlerData;
};

const newProduct = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    validateSchema: {
      query: {
        product: Joi.number().required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        const result = await getDetails(
          parseInt(req.query.product.toString()),
          parseInt(req["user"]["customer_id"].toString())
        );

        if (!result.error){
          return {
            resCode:400,
            error:{
              single:"Product is already added to the cart. You can change the quantity from cart"
            }
          }
        }

        return await addProduct(
          parseInt(req.query.product.toString()),
          parseInt(req["user"]["customer_id"].toString())
        );
      },
    ],
  };
  return rHandlerData;
};

export { getCart, setCartQuntity, productDeleteFromCart, newProduct };
