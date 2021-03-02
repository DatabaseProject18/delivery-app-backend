import { queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const enableUserAccount = (userId: number): Promise<ResponseResult> => {
  return queryBuilder({
    update: {
      tableName: "user_account",
      values: {
        status: 1,
      },
    },
    where: [
      {
        columnName: "user_id",
        comOperator: "=",
        value: userId,
      },
    ],
  });
};

const disableUserAccount = (userId: number): Promise<ResponseResult> => {
  return queryBuilder({
    update: {
      tableName: "user_account",
      values: {
        status: 0,
      },
    },
    where: [
      {
        columnName: "user_id",
        comOperator: "=",
        value: userId,
      },
    ],
  });
};

export { enableUserAccount, disableUserAccount };
