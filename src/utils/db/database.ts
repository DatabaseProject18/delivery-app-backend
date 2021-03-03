import config from "config";
import _, { isArray } from "lodash";
import { pipe } from "lodash/fp";
import mysql, { Connection, FieldInfo, MysqlError } from "mysql";
import { ResponseResult } from "../res/responseBuilder";
import getErrorDetails, { ErrorDetail } from "./DBError";

interface TransferObj {
  sql: string;
  data: Array<any>;
}

interface WhereExp {
  columnName: string;
  comOperator: string;
  value: any;
}

interface ValuesExp {
  tableName: string;
  columns: Array<string> | null;
  values: Array<any>;
}

interface UpdateExp {
  tableName: string;
  values: { [name: string]: any };
}

interface QueryData {
  select?: Array<String> | null;
  from?: string;
  operator?: string;
  where?: Array<WhereExp>;
  insert?: ValuesExp;
  update?: UpdateExp;
  delete?: boolean;
  join?: { [name: string]: string };
  order?: { [name: string]: string };
  limit?: Array<number>;
}

let connection: Connection;

const connect = () => {
  if (!connection || connection.state === "disconnected") {
    connection = mysql.createConnection({
      host: config.get("database.host"),
      user: config.get("database.user"),
      password: config.get("database.password"),
      database: config.get("database.name"),
    });
  }
};

const select = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.select) {
    obj.sql += "SELECT";
    obj.sql += " ?? ";
    obj.data.push(data.select);
  } else if (data.select === null) {
    obj.sql += "SELECT";
    obj.sql += " * ";
  }
  return obj;
};

const from = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.from) {
    obj.sql += "FROM ?? ";
    obj.data.push(data.from);
  }
  return obj;
};

const where = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.where) {
    obj.sql += "WHERE ";
    for (let i = 0; i < data.where.length; i++) {
      obj.sql += `?? ${data.where[i].comOperator} ? `;
      obj.data.push(data.where[i].columnName);
      obj.data.push(data.where[i].value);
      if (i !== data.where.length - 1) {
        obj.sql += `${data.operator} `;
      }
    }
  }
  return obj;
};

const insert = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.insert) {
    obj.sql += "INSERT INTO ??";
    obj.data.push(data.insert.tableName);

    if (data.insert.columns !== null) {
      obj.sql += " (??)";
      obj.data.push(data.insert.columns);
    }

    obj.sql += " VALUES";

    if (typeof data.insert.values[0] !== "object") {
      obj.sql += " (?)";
      obj.data.push(data.insert.values);
    } else {
      obj.sql += " ?";
      obj.data.push(data.insert.values);
    }
  }
  return obj;
};

const update = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.update) {
    obj.sql += "UPDATE ?? SET ";
    obj.data.push(data.update.tableName);

    Object.keys(data.update.values).map((key, index) => {
      if (index !== 0) obj.sql += `,`;

      obj.sql += `?? = ? `;
      obj.data.push(key);
      obj.data.push(data.update.values[key]);
    });
  }
  return obj;
};

const order = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.order) {
    obj.sql += "ORDER BY ";
    let tempArray = [];
    for (let [key, value] of Object.entries(data.order)) {
      tempArray.push(`?? ${value}`);
      obj.data.push(key);
    }
    obj.sql += tempArray.join(", ");
  }
  return obj;
};

const limit = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.limit) {
    obj.sql += " LIMIT ?";
    obj.data.push(data.limit);
  }
  return obj;
};

const deleteTable = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.delete) {
    obj.sql += "DELETE ";
  }
  return obj;
};

const join = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.join) {
    Object.keys(data.join).map((key) => {
      obj.sql += "JOIN ?? USING(??) ";
      obj.data.push(key);
      obj.data.push(data.join[key]);
    });
  }
  return obj;
};

const resultGenrator = (
  error?: MysqlError,
  result?: any,
  field?: FieldInfo[]
): ResponseResult => {
  let responseResult: ResponseResult = {};
  if (error) {
    console.log(error);
    const errorDetails: ErrorDetail = getErrorDetails(error.code);
    responseResult.resCode = errorDetails.resCode;
    _.set(responseResult, "error.single", errorDetails.msg);
    return responseResult;
  }
  responseResult.resCode = 200;
  if (isArray(result)) {
    if (result.length === 0) {
      const errorDetails: ErrorDetail = getErrorDetails("MY_ROW_NOT_FOUND");
      responseResult.resCode = errorDetails.resCode;
      _.set(responseResult, "error.single", errorDetails.msg);
      return responseResult;
    }
    const newResult: Array<{ [name: string]: any }> = result.map((row) =>
      JSON.parse(JSON.stringify(row))
    );
    _.set(responseResult, "data.multiple", newResult);
  } else {
    _.set(responseResult, "data.single", "Success");
  }
  return responseResult;
};

const queryExecutor = (query: TransferObj): Promise<ResponseResult> => {
  return new Promise((resolve) => {
    connect();

    connection.query(query.sql, query.data, (error, result, field) => {
      resolve(resultGenrator(error, result, field));
    });
  });
};

export const queryBuilder = async (
  schema: QueryData
): Promise<ResponseResult> => {
  const composeFunctions = pipe(
    select(schema),
    insert(schema),
    deleteTable(schema),
    update(schema),
    from(schema),
    join(schema),
    where(schema),
    order(schema),
    limit(schema),
    async (obj: TransferObj) => {
      return await queryExecutor(obj);
    }
  );

  const responseResult: Promise<ResponseResult> = composeFunctions({
    sql: "",
    data: [],
  });

  return responseResult;
};

export const call = (
  name: string,
  args: Array<any> = []
): Promise<ResponseResult> => {
  let sql = "CALL ??(";

  args.map((item,index)=>{
    if (index === 0){
      sql = sql + "?";
    }else{
      sql = sql + ",?";
    }
  })

  sql = sql + ")";

  return new Promise((resolve) => {
    connect();

    connection.query(sql, [name, ...args], (error, result, field) => {
      if (result){
        result = result[0];
      }
      resolve(resultGenrator(error, result, field));
    });
  });
};
