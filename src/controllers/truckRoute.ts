import { Request, Response } from "express";
import Joi from "joi";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {getTruckRouteIds, getTruckRoutes, getTruckId, createTruckTrip} from '../models/truckRoute';


const truckRoutes = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getTruckRouteIds(req.body.store_manager_id);
        },
        (req: Request, res: Response) => async (
            data: ResponseResult
            ): Promise<ResponseResult> => {
            return await getTruckRoutes(data.data.multiple[0].truck_route_id);
          },
      ],
    };
    return rHandlerData;
  };

  const truckId = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getTruckId(req.body.date_time);
        },
      ],
    };
    return rHandlerData;
  };

  const truckTrip = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      validateSchema: {
        body: {
          truck_route_id: Joi.number().min(1).required(),
          truck_id: Joi.number().min(1).required(),
          date_time: Joi.date().required(),
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
  

export {truckRoutes, truckId, truckTrip}