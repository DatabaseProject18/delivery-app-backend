import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverAssistantId, getDriverAssistantName, getDriverAssistantIds, getDriverAssistantDetails, getDriverAssistantFullDetails} from '../models/driverAssistant';

const driverAssistantName = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantId(+req.params.truck_id);
        },
        (req: Request, res: Response) => async (
            data: ResponseResult
            ): Promise<ResponseResult> => {
            return await getDriverAssistantName(data.data.multiple[0].driver_assistant_id);
          },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
      },
      handlers: [
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantIds();
        },
        (req: Request, res: Response) => async (
          data: ResponseResult
          ): Promise<ResponseResult> => {
          return await getDriverAssistantDetails(data.data.multiple[0].driver_assistant_id);
        },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantFullDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasToken: false,
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