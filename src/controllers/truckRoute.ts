import { Request, Response } from "express";
import Joi from "joi";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {getTruckRoutes, getTruckId, createTruckTrip,truckRouteByID,getStoreIDByStoreManagerID, createScheduledOrder} from '../models/truckRoute';


const truckRoutes = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {

        hasAccessToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getStoreIDByStoreManagerID(+req.query.store_manager_id);
        },
        (req: Request, res: Response) => async (
            data: ResponseResult
        ): Promise<ResponseResult> => {
          //console.log(data.data.multiple[0])
            return await getTruckRoutes(data.data.multiple[0].store_id);
          },
      ],
    };
    return rHandlerData;
  };

  const truckId = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
      },
      handlers: [
         (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getStoreIDByStoreManagerID(+req.query.store_manager_id);
        },
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getTruckId(data.data.multiple[0].store_id);
        },
      ],
    };
    return rHandlerData;
  };

  const truckTrip = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
      },
      validateSchema: {
        body: {
          truck_route_id: Joi.number().min(1).required(),
          truck_id: Joi.number().min(1).required(),
          date_time: Joi.date().iso().required(),
          store_manager_id: Joi.number().min(1).required(),
          driver_id: Joi.number().min(1).required(),
          driver_assistant_id: Joi.number().min(1).required(),
        },
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
        ): Promise<ResponseResult> => {
          return await createTruckTrip(req.body)
        },
      ],
    };
  
    return rHandlerData;
};

const scheduledOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      //hasAccessToken: true,
    },
    validateSchema: {
      // body: {
      //   order_id: Joi.number().min(1).required(),
      //   truck_schedule_id: Joi.number().min(1).required(),
      // },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await createScheduledOrder(req.body)
      },
    ],
  };

  return rHandlerData;
};
  
  const getTruckRouteByID = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        userType:'driver_assistant'
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
        ): Promise<ResponseResult> => {
          //console.log("AAAAAAAAAA")
          return await truckRouteByID(+req.params.truck_route_id);
        },
      ],
    };
    return rHandlerData;
  };
  

export {truckRoutes, truckId, truckTrip,getTruckRouteByID, scheduledOrder}
