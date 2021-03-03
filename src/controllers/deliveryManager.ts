import { Request, Response } from "express";
import Joi from "joi";
import {schedule_train} from "../models/train_schedule";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
    newOrders,
    newOrder,
    rejectAnOrder,
    shipAnOrder,
    getTotalVolumeForOrder,
    getTrainsForOrder,
    getTrainTimeTableForOrder,
} from "../models/order";

const getNewOrders = (): RHandler => {
    const rHandlerData: RHandler = {
        authSchema: {
            hasAccessToken: true,
            userType: "delivery_manager"
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
            hasAccessToken: true,
            userType: "delivery_manager"
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
            hasAccessToken: true,
            userType: "delivery_manager"
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
            hasAccessToken: true,
            userType: "delivery_manager"
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

const getTotalVolume = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasAccessToken: true,
            userType: "delivery_manager"
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await getTotalVolumeForOrder(+req.params.order_id);
            }
        ],
    };
    return rHandlerData;
};

const getAllTrainsForOrder = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasAccessToken: true,
            userType: "delivery_manager"
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await getTrainsForOrder(+req.params.order_id);
            }
        ],
    };
    return rHandlerData;
};

const getTrainTimeTableForTrainId = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasAccessToken: true,
            userType: "delivery_manager"
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await getTrainTimeTableForOrder(+req.params.train_id);
            }
        ],
    };
    return rHandlerData;
};

const scheduleTrainTrip = (): RHandler => {
    const rHandlerData: RHandler ={
        authSchema: {
            hasAccessToken: true,
            userType: "delivery_manager"
        },
        handlers: [
            (req: Request, res: Response) => async (
                data: ResponseResult
            ): Promise<ResponseResult> => {
                return await schedule_train(+req.params.order_id, +req.params.train_time_table_id, +req.params.delivery_manager_id);
            }
        ],
    };
    return rHandlerData;
};

export {getNewOrders, getNewOrder, rejectOrder, shipOrder, getTotalVolume, getAllTrainsForOrder, getTrainTimeTableForTrainId, scheduleTrainTrip}
