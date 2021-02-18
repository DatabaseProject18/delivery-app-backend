import { call, queryBuilder } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

interface customerData {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  type: string;
  password: string;
  contact_no: string;
  registered_date: string;
}

export const insertCustomer = async (
  data: customerData
): Promise<ResponseResult> => {
  return await call("insert_customer", [
    data.first_name,
    data.last_name,
    data.email,
    data.address,
    data.type,
    data.password,
    data.contact_no,
    data.registered_date,
  ]);
};

export const getAllCustomerTypes = async (): Promise<ResponseResult> => {
  return await queryBuilder({
    select: null,
    from: "customer_type",
  });
};
