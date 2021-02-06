import { Response } from "express";

export interface ResponseResult {
  resCode?: number;
  error?: {
    db: string;
    auth: string;
    validate: {
      [name: string]: String;
    };
  };
  data?: {
    db: Array<{ [name: string]: any }>;
  };
}

export const responseBulider = (res: Response) => (
  result: ResponseResult
): void => {
  const { resCode, ...rest } = result;
  res.status(resCode).send({ ...rest });
};
