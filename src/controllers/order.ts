import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  pastOrders,
  pastOrder,
  CancelAnOrder,
  ConfirmAnOrder,
  orderStatus,
  getOrdersByRouteId,
  CreateAnOrder,
  getOrdersCountByStatus,
} from "../models/order";

const getPastOrders = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await pastOrders(+req.query.customer_id);
      },
    ],
  };
  return rHandlerData;
};

const getPastOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        const customer_id = 1; // this should be changed
        //console.log(req.params.order_id)
        return await pastOrder(customer_id, +req.params.order_id);
      },
    ],
  };
  return rHandlerData;
};

const cancelOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "customer",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        //const customer_id = 1; // this should be changed
        //console.log(+req.params.order_id)
        //console.log(await deleteFromCart(customer_id,+req.params.order_id))
        return await CancelAnOrder(+req.params.order_id);
      },
    ],
  };
  return rHandlerData;
};

const confirmOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      userType: "driver_assistant",
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        const customer_id = 1; // this should be changed
        // console.log(+req.params.order_id)
        //console.log(await deleteFromCart(customer_id,+req.params.order_id))
        return await ConfirmAnOrder(+req.params.order_id);
      },
    ],
  };
  return rHandlerData;
};

const getOrderStatus = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        const customer_id = 1000; // this should be changed
        return await orderStatus(customer_id, +req.params.order_id);
      },
    ],
  };
  return rHandlerData;
};

const ordersByRouteId = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
      //hasRefreshToken: true,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getOrdersByRouteId(req.body.town);
      },
    ],
  };
  return rHandlerData;
};

const createOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        const customer_id = 1000; // this should be changed
        console.log("Order successfully created");
        return await CreateAnOrder(customer_id);
      },
    ],
  };
  return rHandlerData;
};

const orderCountByStatus = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getOrdersCountByStatus();
      },
    ],
  };
  return rHandlerData;
};

export {
  getPastOrders,
  getPastOrder,
  cancelOrder,
  confirmOrder,
  getOrderStatus,
  ordersByRouteId,
  createOrder,
  orderCountByStatus,
};
