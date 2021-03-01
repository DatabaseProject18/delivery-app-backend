import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverName, getDriverDetails, getDriverFullDetails} from '../models/driver';

const driverName = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        //hasAccessToken: true,
        //hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
            data: ResponseResult
            ): Promise<ResponseResult> => {
            return await getDriverName(req.body.start_time,req.body.end_time);
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
          return await getDriverDetails();
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
