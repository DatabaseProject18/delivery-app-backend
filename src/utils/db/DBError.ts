export interface ErrorDetail {
  resCode: number;
  msg: string;
}

const errors: { [name: string]: ErrorDetail } = {
  PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR: {
    resCode: 500,
    msg: "Database connection error!",
  },
  ER_ACCESS_DENIED_ERROR: {
    resCode: 401,
    msg: "Unauthorized access!",
  },
  ER_BAD_DB_ERROR: {
    resCode: 404,
    msg: "This is a server side error. Database is not found!",
  },
  ER_PARSE_ERROR: {
    resCode: 500,
    msg: "This is a server side error. Bad request to the databse server!",
  },
  ER_DUP_ENTRY: {
    resCode: 400,
    msg: "Duplicate entries are not allowed!",
  },
  ER_DUP_KEY: {
    resCode: 400,
    msg: "Duplicate entries are not allowed!",
  },
  ER_BAD_NULL: {
    resCode: 400,
    msg: "Data fileds can't be empty!",
  },
  ER_NO_REFERENCED_ROW_2: {
    resCode: 400,
    msg: "Data are not allowed!",
  },
  ER_NONEXISTING_GRANT: {
    resCode: 403,
    msg: "Forbidden. Can't access protected data!",
  },
  ER_TABLEACCESS_DENIED_ERROR: {
    resCode: 403,
    msg: "Forbidden. Can't access protected data!",
  },
  ER_NONEXISTING_TABLE_GRANT: {
    resCode: 403,
    msg: "Forbidden. Can't access protected data!",
  },
  MY_ROW_NOT_FOUND: {
    resCode: 404,
    msg: "Data are not found",
  },
  DEFAULT: {
    resCode: 500,
    msg: "Unknown error is occured.",
  },
};

export default function getErrorDetails(errCode: string): ErrorDetail {
  if (errors[errCode]) return errors[errCode];
  return errors.DEFAULT;
}
