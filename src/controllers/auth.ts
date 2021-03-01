import bcrypt from "bcrypt";
import config from "config";
import { Request, Response } from "express";
import Joi from "joi";
import _ from "lodash";
import { insertCustomer } from "../models/customer";
import { queryBuilder } from "../utils/db/database";
import { RHandler } from "../utils/req/requestHandler";
import { ResponseResult } from "../utils/res/responseBuilder";
import {
  generateAccessToken,
  generateRefreshToken
} from "../utils/token/tokenManager";

export const login = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: false,
      hasRefreshToken: false,
    },
    validateSchema: {
      body: {
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return new Promise(async (resolve) => {
          //Check whether username(email) is in the database
          const result: ResponseResult = await queryBuilder({
            select: null,
            from: "user_account",
            where: [
              {
                columnName: "email",
                comOperator: "=",
                value: req.body.email,
              },
            ],
          });

          if (result.error) {
            return resolve({
              resCode: 401,
              error: {
                single: "Username is incorrect",
              },
            });
          }

          const { user_id, password, status } = result.data.multiple[0];

          //Check whether account is disabled or not
          if (!status) {
            return resolve({
              resCode: 403,
              error: {
                single: "Your Account is disabled. Contact the admin.",
              },
            });
          }

          //Check whether password match with password in databases
          const passwordMatch: boolean = await bcrypt.compare(
            req.body.password,
            password
          );

          if (!passwordMatch) {
            return resolve({
              resCode: 401,
              error: {
                single: "Password is incorrect.",
              },
            });
          }

          //Get data for create access token and refresh token
          const tokenData: ResponseResult = await queryBuilder({
            select: ["first_name", "user_type"],
            from: "user_data",
            where: [
              {
                columnName: "user_id",
                comOperator: "=",
                value: user_id,
              },
            ],
          });

          if (tokenData.error) return resolve(tokenData);

          const { first_name, user_type } = tokenData.data.multiple[0];

          const specificUserID: ResponseResult = await queryBuilder({
            select: [`${user_type}_id`],
            from: `${user_type}`,
            where: [
              {
                columnName: "user_id",
                comOperator: "=",
                value: user_id,
              },
            ],
          });

          if (specificUserID.error) return resolve(specificUserID);

          const allUserTokenData = {
            user_id,
            [`${user_type}_id`]: specificUserID.data.multiple[0][
              `${user_type}_id`
            ],
            first_name,
            user_type,
          };

          //Generate access and refresh token
          const accessToken: string = generateAccessToken(
            allUserTokenData,
            config.get("token_expire_time")
          );

          const refreshToken: string = generateRefreshToken(allUserTokenData);

          //Add refresh token to the database
          const insertionResult = await queryBuilder({
            insert: {
              tableName: "refresh_token",
              columns: null,
              values: [refreshToken],
            },
          });

          if (insertionResult.error) return resolve(insertionResult);

          resolve({
            resCode: 200,
            data: {
              multiple: {
                accessToken,
                refreshToken,
              },
            },
          });
        });
      },
    ],
  };

  return rHandlerData;
};

export const logout = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasAccessToken: true,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        //Remove token from the database
        const result = await queryBuilder({
          select: null,
          from: "refresh_token",
          where: [
            {
              columnName: "token",
              comOperator: "=",
              value: req.body.refreshToken,
            },
          ],
        });

        if (result.error) {
          return new Promise((resolve) => {
            resolve({
              resCode: 403,
              error: {
                single: "Unauthorized Access!",
              },
            });
          });
        }

        return await queryBuilder({
          delete: true,
          from: "refresh_token",
          where: [
            {
              columnName: "token",
              comOperator: "=",
              value: req.body.refreshToken,
            },
          ],
        });
      },
    ],
  };

  return rHandlerData;
};

export const register = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasToken: false,
    },
    validateSchema: {
      body: {
        first_name: Joi.string()
          .min(3)
          .$.regex(/^[A-Za-z]+$/)
          .rule({
            message: "First Name should only contain alphabet characters",
          })
          .required()
          .label("First Name"),
        last_name: Joi.string()
          .min(3)
          .$.regex(/^[A-Za-z]+$/)
          .rule({
            message: "Last Name should only contain alphabet characters",
          })
          .required()
          .label("Last Name"),
        email: Joi.string().email().required().label("Email"),
        address: Joi.string().required().label("Address"),
        type: Joi.string().required().label("Customer Type"),
        password: Joi.string().min(5).required().label("Password"),
        confirm_password: Joi.string()
          .equal(Joi.ref("password"))
          .required()
          .label("Confrim Password"),
        contact_no: Joi.string()
          .$.regex(/^[0-9]+$/)
          .rule({
            message: "Contact Number should only contain numbers",
          })
          .min(9)
          .max(20)
          .required()
          .label("Contact Number"),
        registered_date: Joi.string()
          .$.regex(/^(\d){4}(-(\d){1,2}){2}$/)
          .rule({
            message: "Registered Date should only contain '2000-01-01' pattern",
          })
          .required()
          .label("Registered Date"),
      },
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return new Promise(async (resolve) => {
          //Check whether already email address is in the database
          let result = await queryBuilder({
            select: ["user_id"],
            from: "user_data",
            where: [
              {
                columnName: "email",
                comOperator: "=",
                value: req.body.email,
              },
            ],
          });

          if (result.data) {
            result.resCode = 400;
            delete result.data;
            _.set(
              result,
              "error.single",
              "Email is already resgistered. Please enter a new email address."
            );
            return resolve(result);
          }

          //Encrypt the plain password
          const encryptedPassword: string = await bcrypt.hash(
            req.body.password,
            config.get("solt_times")
          );

          if (!encryptedPassword) {
            resolve({
              resCode: 500,
              error: {
                single: "Internal Server Error",
              },
            });
          }

          req.body.password = encryptedPassword;

          //Add new records to the database
          result = await insertCustomer(
            _.pick(req.body, [
              "first_name",
              "last_name",
              "email",
              "address",
              "type",
              "password",
              "contact_no",
              "registered_date",
            ])
          );

          if (
            result.error &&
            result.error.single === "Duplicate entries are not allowed!"
          ) {
            result.error.single =
              "Contact Number is already resgistered. Please enter a new Contact Number.";
            return resolve(result);
          }

          resolve(result);
        });
      },
    ],
  };

  return rHandlerData;
};

export const renewAccessToken = (): RHandler => {
  const rHandlerData: RHandler = {
    authSchema: {
      hasRefreshToken: true,
    },
    handlers: [
      (req: Request, res: Response) => async (
        data: ResponseResult
      ): Promise<ResponseResult> => {
        return new Promise(async (resolve) => {
          const result = await queryBuilder({
            select: null,
            from: "refresh_token",
            where: [
              {
                columnName: "token",
                comOperator: "=",
                value: req.body.refreshToken,
              },
            ],
          });

          if (result.error) {
            return resolve({
              resCode: 403,
              data: {
                single: "Unauthorized Access!",
              },
            });
          }

          const userData: { [name: string]: any } = req.body.tokenData;

          const accessToken = generateAccessToken(
            userData,
            config.get("token_expire_time")
          );

          resolve({
            resCode: 200,
            data: {
              single: accessToken,
            },
          });
        });
      },
    ],
  };

  return rHandlerData;
};
