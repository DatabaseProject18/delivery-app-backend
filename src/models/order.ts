import { queryBuilder, call } from "../utils/db/database";
import { ResponseResult } from "../utils/res/responseBuilder";

const pastOrders = (user_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    select: ["order_id", "order_date", "delivery_date", "cost", "order_status"],
    from: "order_table",
    operator: "AND",
    where: [
      { columnName: "customer_id", comOperator: "=", value: user_id },
      { columnName: "order_status", comOperator: "!=", value: "deleted" },
    ],
  });
};

const pastOrder = (
  user_id: number,
  order_id: number
): Promise<ResponseResult> => {
  return queryBuilder({
    select: [
      "order_id",
      "order_status",
      "cost",
      "order_date",
      "delivery_date",
      "product_name",
      "item_price",
      "quantity",
      "product_description",
    ],
    from: "ordered_product",
    join: { product: "product_id", order_table: "order_id" },
    operator: "AND",
    where: [
      { columnName: "customer_id", comOperator: "=", value: user_id },
      { columnName: "order_id", comOperator: "=", value: order_id },
    ],
  });
};

const CancelAnOrder = (order_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    update: { tableName: "order_table", values: { order_status: "Canceled" } },
    where: [{ columnName: "order_id", comOperator: "=", value: order_id }],
  });
};

const ConfirmAnOrder = (order_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    update: { tableName: "order_table", values: { order_status: "Delivered" } },
    where: [{ columnName: "order_id", comOperator: "=", value: order_id }],
  });
};

const newOrders = (): Promise<ResponseResult> => {
  return queryBuilder({
    select: null,
    from: "new_order_details",
  });
};

const newOrder = (order_id: number): Promise<ResponseResult> => {
    return queryBuilder({
        select: null,
        from: "new_single_order_details",
        where:[{columnName:"order_id", comOperator: "=", value: order_id}]
    })
}

const rejectAnOrder = (order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "rejected" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const shipAnOrder = (order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "shipped" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const orderStatus = (user_id: number, order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["order_status"],
        from: "order_table",
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const CreateAnOrder = (req: Object): Promise<ResponseResult> => {
  return queryBuilder({
    insert: {
      tableName: "order_table",
      columns: [
        "order_id",
        "order_date",
        "delivery_date",
        "customer_id",
        "route_id",
        "cost",
        "order_status",
      ],
      values: [Object.values(req)],
    },
  });
};

const getOrdersByTown = (town: String): Promise<ResponseResult> => {
  return queryBuilder({
    select: ["order_id"],
    from: "covered_area",
    join: {
      truck_schedule: "truck_route_id",
      scheduled_order: "truck_schedule_id",
    },
    where: [{ columnName: "town", comOperator: "=", value: town }],
    order: { ["date_time"]: "ASC" },
  });
};

const getOrdersCountByStatus = (): Promise<ResponseResult> => {
  return call("get_order_count_by_status");
};

export {
  pastOrders,
  pastOrder,
  CancelAnOrder,
  ConfirmAnOrder,
  orderStatus,
  CreateAnOrder,
  getOrdersByTown,
  newOrders,
  newOrder,
  rejectAnOrder,
  shipAnOrder,
  getOrdersCountByStatus,
};
