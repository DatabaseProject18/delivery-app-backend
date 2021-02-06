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
  value: string;
}

interface ValuesExp {
  tableName: string;
  columns: Array<string> | null;
  values: Array<any>;
}

interface QueryData {
  select?: Array<String> | null;
  from?: string;
  operator?: string;
  where?: Array<WhereExp>;
  insert?: ValuesExp;
  update?: object;
  delete?: boolean;
  join?: object;
  order?: object;
  limit?: Array<number>;
}

const connection: Connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "7019$DIL$c@t",
  database: "university",
});

const select = (data: QueryData) => (obj: TransferObj): TransferObj => {
  obj.sql += "SELECT";
  if (data.select) {
    obj.sql += " ?? ";
    obj.data.push(data.select);
  } else if (data.select === null) {
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

    obj.sql += "(??)";
    obj.data.push(data.insert);

    obj.sql += " VALUES ";

    obj.sql += "(";
    const values: any[] = Object.values(data.insert.values);
    columns.map((key, index) => {
      if (index !== values.length - 1) {
        obj.sql += "??,";
      } else {
        obj.sql += "??";
      }
    });
    obj.sql += ")";

    return obj;
  }
};

const update = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.update) {
    obj.sql += "UPDATE";
    for (let i = 0; i < Object.keys(data.update).length; i++) {
      obj.sql += "SET";
      obj.data.push(Object.keys(data.update)[i]);
      obj.data.push(data.join[Object.keys(data.update)[i]]);
    }
  }
  return obj;
};

const order = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.order) {
    obj.sql += "ORDER BY ";
    let tempArray = [];
    for (let [key, value] of Object.entries(data.order)) {
      tempArray.push("?? ??");
      obj.data.push(key);
      obj.data.push(value);
    }
    obj.sql += tempArray.join(", ");
  }
  return obj;
};

const limit = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.limit) {
    obj.sql += "LIMIT ";
    if (obj.data.length === 1) {
      obj.sql += "??";
      obj.data.push(data.limit[0]);
    } else {
      obj.sql += "??, ??";
      obj.data.push(data.limit[0]);
      obj.data.push(data.limit[1]);
    }
  }
  return obj;
};

const deleteTable = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.delete) {
    obj.sql += "DELETE";
  }
  return obj;
};

const join = (data: QueryData) => (obj: TransferObj): TransferObj => {
  if (data.join) {
    obj.sql += "JOIN ";
    for (let i = 0; i < Object.keys(data.join).length; i++) {
      obj.sql += "?? USING(?) ";
      obj.data.push(Object.keys(data.join)[i]);
      obj.data.push(data.join[Object.keys(data.join)[i]]);
    }
  }
  return obj;
};

const resultGenrator = (
  error?: MysqlError,
  result?: Array<{ [name: string]: any }>,
  field?: FieldInfo[]
): ResponseResult => {
  let responseResult: ResponseResult;
  if (error) {
    const errorDetails: ErrorDetail = getErrorDetails(error.code);
    responseResult.resCode = errorDetails.resCode;
    responseResult.error.single = errorDetails.msg;
    return responseResult;
  }
  responseResult.resCode = 200;
  const newResult: Array<{ [name: string]: any }> = result.map((row) =>
    JSON.parse(JSON.stringify(row))
  );
  responseResult.data.multiple = newResult;
  return responseResult;
};

const queryExecutor = (sql: string): ResponseResult => {
  connection.connect(function (error) {
    return resultGenrator(error);
  });

  connection.query(sql, (error, result, field) => {
    return resultGenrator(error, result, field);
  });

  return {};
};

export const queryBuilder = (schema: QueryData): Promise<ResponseResult> => {
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
    queryExecutor
  );
  const responseResult: ResponseResult = composeFunctions({
    sql: "",
    data: [],
  });
  return new Promise((resolve) => {
    resolve(responseResult);
  });
};

export const call = (
  name: string,
  args: Array<any> = []
): Promise<ResponseResult> => {
  connection.connect(function (error) {
    return new Promise((resolve) => resolve(resultGenrator(error)));
  });

  connection.query(`CALL ??(?)`, [name, args], (error, result, field) => {
    const responseResult: ResponseResult = resultGenrator(error, result, field);
    return new Promise((resolve) => {
      resolve(responseResult);
    });
  });

  return new Promise((resolve) => {
    resolve({});
  });
};
