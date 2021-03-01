import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverAssistantName, getDriverAssistantDetails, getDriverAssistantFullDetails} from '../models/driverAssistant';

const driverAssistantName = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        //hasAccessToken: true,
        //hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantName(req.body.start_time, req.body.end_time);
        },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantDetails();
        },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantFullDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
        hasRefreshToken: true,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantFullDetails(+req.params.driver_assistant_id);
        },
      ],
    };
    return rHandlerData;
  };
  
  

export { driverAssistantName, driverAssistantDetails, driverAssistantFullDetails }
