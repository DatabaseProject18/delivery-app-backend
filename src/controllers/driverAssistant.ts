import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import { getDriverAssistantName, getDriverAssistantDetails, getDriverAssistantFullDetails, getStoreIDByStoreManagerID} from '../models/driverAssistant';

const driverAssistantName = (): RHandler => {
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
          //console.log(req.query)
          return await getDriverAssistantName(data.data.multiple[0].store_id,String(req.query.start_time), String( req.query.end_time));
        },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantDetails = (): RHandler => {
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
          return await getDriverAssistantDetails(data.data.multiple[0].store_id);
        },
      ],
    };
    return rHandlerData;
  };

  const driverAssistantFullDetails = (): RHandler => {
    const rHandlerData: RHandler = {
      authSchema: {
        hasAccessToken: true,
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
