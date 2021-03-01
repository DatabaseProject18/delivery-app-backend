import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const cart = (user_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    select: [
      "cart_id",
      "product_id",
      "product_name",
      "product_description",
      "quantity",
      "unit_price",
      "discount",
      "stock",
    ],
    from: "cart",
    join: { product: "product_id" },
    operator: "AND",
    where: [
      { columnName: "customer_id", comOperator: "=", value: user_id },
      { columnName: "is_delete", comOperator: "=", value: 0 },
    ],
  });
};

const updateCartQuantity = (
  user_id: number,
  cart_id: number,
  quantity: string
): Promise<ResponseResult> => {
  return queryBuilder({
    update: { tableName: "cart", values: { quantity: String(quantity) } },
    operator: "AND",
    where: [
      { columnName: "customer_id", comOperator: "=", value: user_id },
      { columnName: "cart_id", comOperator: "=", value: cart_id },
    ],
  });
};

const deleteFromCart = (cart_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    update: { tableName: "cart", values: { is_delete: String(1) } },
    where: [{ columnName: "cart_id", comOperator: "=", value: cart_id }],
  });
};

const addProduct = (
  productId: number,
  customerId: number
): Promise<ResponseResult> => {
  return queryBuilder({
    insert: {
      tableName: "cart",
      columns: ["product_id", "customer_id"],
      values: [productId, customerId],
    },
  });
};

const getDetails = (
  productId: number,
  customerId: number
): Promise<ResponseResult> => {
  return queryBuilder({
    select: null,
    from: "cart",
    where: [
      {
        columnName: "product_id",
        comOperator: "=",
        value: productId,
      },
      {
        columnName: "customer_id",
        comOperator: "=",
        value: customerId,
      },
      {
        columnName: "is_delete",
        comOperator: "=",
        value: 0,
      },
    ],
    operator: "and",
  });
};

export { cart, updateCartQuantity, deleteFromCart, addProduct, getDetails };
