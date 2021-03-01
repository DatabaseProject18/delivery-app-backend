import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverName, getDriverDetails, getDriverFullDetails,getStoreIDByStoreManagerID} from '../models/driver';

const driverName = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
            data: ResponseResult
            ): Promise<ResponseResult> => {
            return await getDriverName(String( req.query.start_time),String( req.query.end_time));
          },
      ],
    };
    return rHandlerData;
  };

  const driverDetails = (): RHandler => {
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
          return await getDriverDetails(data.data.multiple[0].store_id);
        },
      ],
    };
    return rHandlerData;
  };

  const driverFullDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverFullDetails(+req.params.driver_id);
        },
      ],
    };
    return rHandlerData;
  };

export { driverName, driverDetails, driverFullDetails }
