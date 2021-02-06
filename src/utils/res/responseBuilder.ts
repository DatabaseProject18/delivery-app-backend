import { Response } from "express";

export interface ResponseResult {
  resCode?: number;
  error?: {
    single: string;
    multiple: Array<string> | { [name: string]: string };
  };
  data?: {
    single: Primitive;
    multiple: Array<any> | { [name: string]: any };
  };
}

type Primitive = string | number | boolean;

export const responseBulider = (res: Response) => (
  result: ResponseResult
): void => {
  const { resCode, ...rest } = result;
  res.status(resCode).send({ ...rest });
};
