import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {newOrders, newOrder, rejectAnOrder, shipAnOrder} from "../models/order"

const getNewOrders = (): RHandler => {
    const rHandlerData: RHandler = {
        authSchema: {
            hasToken: false,
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await newOrders();
            },
        ],
    };
    return rHandlerData;
};

const getNewOrder = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasToken: false,
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await newOrder(+req.params.order_id);
            }
        ],
    };
    return rHandlerData;
};

const rejectOrder = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasToken: false,
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await rejectAnOrder(+req.params.order_id);
            }
        ],
    };
    return rHandlerData;
};

const shipOrder = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasToken: false,
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await shipAnOrder(+req.params.order_id);
            }
        ],
    };
    return rHandlerData;
};

export {getNewOrders, getNewOrder, rejectOrder, shipOrder}
