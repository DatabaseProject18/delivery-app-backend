import Joi from "joi";
import _ from "lodash";

export interface ValidateHandlerData {
  body?: { [name: string]: any };
  query?: { [name: string]: any };
  params?: { [name: string]: any };
}

export type ValidateResult = { [name: string]: string } | null;

export const validate = (
  schema: { [name: string]: any },
  data: { [name: string]: any }
): ValidateResult => {
  const joiObj = Joi.object(schema).options({ abortEarly: false });
  const result = joiObj.validate(data);
  if (result.error) {
    let obj = {};
    result.error.details.map(({ message, path }) => {
      const modifiedMsg = _.replace(
        _.replace(_.trim(message, ']"'), '"', ""),
        "[ref:",
        "equal to the "
      );
      _.set(obj, _.join(path, "."), modifiedMsg);
    });
    return obj;
  }
  return null;
};
