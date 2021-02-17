import { Request, Response } from "express";
import Joi from "joi";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {sheduledTruckTrips,truckTripDetails,truckTripOrderDetails} from "../models/truckTrip";

const getSheduledTruckTrips = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            //console.log(req.query);
            let id;
            if (req.query.type === "driver") {
                id = req.query.driver_id; // this should be changed
            }
            else if (req.query.type === "driver_assistant") {
                 id = req.query.driver_assistant_id; // this should be changed
            }
            return await sheduledTruckTrips(id,String(req.query.type) ,String( req.query.date), String(req.query.isPast));
      },
    ],
  };
  return rHandlerData;
};


const getTruckTripDetails = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            //console.log(req.query.truckTrip_id);
            return await truckTripDetails(+req.params.truckTrip_id);
      },
    ],
  };
  return rHandlerData;
};


const getTruckTripOrderDetails = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
        ): Promise<ResponseResult> => {
            //console.log(req.query.truckTrip_id);
            return await truckTripOrderDetails(+req.params.truckTrip_id);
      },
    ],
  };
  return rHandlerData;
};



export { getSheduledTruckTrips, getTruckTripOrderDetails,getTruckTripDetails}