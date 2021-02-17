import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverId, getDriverName, getDriverIds, getDriverDetails, getDriverFullDetails} from '../models/driver';

const driverName = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverId(+req.params.truck_id);
        },
        (req: Request, res: Response) => async (
            data: ResponseResult
            ): Promise<ResponseResult> => {
            return await getDriverName(data.data.multiple[0].driver_id);
          },
      ],
    };
    return rHandlerData;
  };

  const driverDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverIds();
        },
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverDetails(data.data.multiple[0].driver_id);
        },
      ],
    };
    return rHandlerData;
  };

  const driverFullDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
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
