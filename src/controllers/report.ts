import { Request, Response } from "express";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  getYearsIncome,
  getQuarterlyIncome,
  getBasicsOfOrderInQuarter,
  getOrderCountOfProduct,
  getOrderCountOfProductInYear,
  getIncomeBasedOnCitiesRoutes,
  getIncomeBasedOnCitiesRoutesInYear,
  getDriverWorkingHours,
  getDriverWorkingHoursInYear,
  getDriverWorkingHoursInYearInMonth,
  getDriverAssistantWorkingHours,
  getDriverAssistantWorkingHoursInYear,
  getDriverAssistantWorkingHoursInYearInMonth,
  getTruckUsedHours,
  getTruckUsedHoursInYear,
  getTruckUsedHoursInYearInMonth,
  getCustomerOrder,
  getCustomerOrderInYear,
  getCustomerBasicOrderDetails,
} from "../models/report";
import Joi from "joi";

const yearsIncome = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getYearsIncome();
      },
    ],
  };
  return rHandlerData;
};

const quarterlyIncome = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Incorrect query data" })
          .required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getQuarterlyIncome(req.query.year.toString());
      },
    ],
  };
  return rHandlerData;
};

const basicOrderDetailsOfQuarter = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" })
          .required(),
        quarter: Joi.string()
          .length(1)
          .$.regex(/^[1-4]$/)
          .rule({ message: "Invalid quarter" })
          .required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return await getBasicsOfOrderInQuarter(
          req.query.year.toString(),
          req.query.quarter.toString()
        );
      },
    ],
  };
  return rHandlerData;
};

const orderCountOfProduct = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year) {
          return await getOrderCountOfProductInYear(req.query.year.toString());
        } else {
          return await getOrderCountOfProduct();
        }
      },
    ],
  };
  return rHandlerData;
};

const cityRouteIncome = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year) {
          return await getIncomeBasedOnCitiesRoutesInYear(
            req.query.year.toString()
          );
        } else {
          return await getIncomeBasedOnCitiesRoutes();
        }
      },
    ],
  };
  return rHandlerData;
};

const driverWorkingHours = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
        month: Joi.number().min(1).max(12),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year && req.query.month) {
          return await getDriverWorkingHoursInYearInMonth(
            req.query.year.toString(),
            req.query.month.toString()
          );
        } else if (req.query.month) {
          return {
            resCode: 400,
            error: {
              single: "Incorrect filtering request",
            },
          };
        } else if (req.query.year) {
          return await getDriverWorkingHoursInYear(req.query.year.toString());
        } else {
          return await getDriverWorkingHours();
        }
      },
    ],
  };
  return rHandlerData;
};

const driverAssistantWorkingHours = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
        month: Joi.number().min(1).max(12),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year && req.query.month) {
          return await getDriverAssistantWorkingHoursInYearInMonth(
            req.query.year.toString(),
            req.query.month.toString()
          );
        } else if (req.query.month) {
          return {
            resCode: 400,
            error: {
              single: "Incorrect filtering request",
            },
          };
        } else if (req.query.year) {
          return await getDriverAssistantWorkingHoursInYear(
            req.query.year.toString()
          );
        } else {
          return await getDriverAssistantWorkingHours();
        }
      },
    ],
  };
  return rHandlerData;
};

const truckUsedHours = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
        month: Joi.number().min(1).max(12),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year && req.query.month) {
          return await getTruckUsedHoursInYearInMonth(
            req.query.year.toString(),
            req.query.month.toString()
          );
        } else if (req.query.month) {
          return {
            resCode: 400,
            error: {
              single: "Incorrect filtering request",
            },
          };
        } else if (req.query.year) {
          return await getTruckUsedHoursInYear(req.query.year.toString());
        } else {
          return await getTruckUsedHours();
        }
      },
    ],
  };
  return rHandlerData;
};

const customerOrder = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        year: Joi.string()
          .length(4)
          .$.regex(/^2\d{3}$/)
          .rule({ message: "Invalid year" }),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        if (req.query.year) {
          return await getCustomerOrderInYear(req.query.year.toString());
        } else {
          return await getCustomerOrder();
        }
      },
    ],
  };
  return rHandlerData;
};

const customerBasicOrderDetails = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {},
    validateSchema: {
      query: {
        customerId: Joi.number().required(),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return getCustomerBasicOrderDetails(
          parseInt(req.query.customerId.toString())
        );
      },
    ],
  };
  return rHandlerData;
};

export {
  yearsIncome,
  quarterlyIncome,
  basicOrderDetailsOfQuarter,
  orderCountOfProduct,
  cityRouteIncome,
  driverWorkingHours,
  driverAssistantWorkingHours,
  truckUsedHours,
  customerOrder,
  customerBasicOrderDetails,
};
