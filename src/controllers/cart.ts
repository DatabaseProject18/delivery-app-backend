import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { cart, updateCartQuantity,deleteFromCart } from "../models/cart";


const getCart = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType:'customer'
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
      userType:'customer'
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            //const customer_id = 1000; // this should be changed
        // return await updateCartQuantity(+req.body.customer_id ,+req.body.cart_id,req.body.quantity);
        return await updateCartQuantity(+req.body.customer_id ,+req.body.cart_id,req.body.quantity);
      },
    ],
  };
  return rHandlerData;
};


const productDeleteFromCart = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType:'customer'
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

export {getCart, setCartQuntity,productDeleteFromCart}