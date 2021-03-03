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
  order_id: number
): Promise<ResponseResult> => {
  return queryBuilder({
    select: [
      "order_id",
      "product_id",
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
    where: [
      { columnName: "order_id", comOperator: "=", value: order_id },
    ],
  });
};

const CancelAnOrder = async (order_id: number, orderDetails: Array<{product_id:number,quantity:number}>): Promise<ResponseResult> => {
  
  orderDetails.map(async e  => {
    await call("update_product_stock",[e.product_id,e.quantity]);
  })
  
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
        update: { tableName: 'order_table', values: { "order_status": "Canceled" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const shipAnOrder = (order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "Sent" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const getTrainsForOrder = (order_id:number): Promise<ResponseResult> => {
    return call("supply_chain_management_db.get_trains_for_order", [order_id])
};

const getTotalVolumeForOrder = (order_id:number): Promise<ResponseResult> => {
    return call("supply_chain_management_db.get_total_volume", [order_id]);
};

const getTrainTimeTableForOrder = (train_Id:number): Promise<ResponseResult> => {
    return call("supply_chain_management_db.train_time_table", [train_Id]);
};


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

const getOrdersByRouteId = (route_id: number): Promise<ResponseResult> => {
  return queryBuilder({
    select: null,
    from: "sent_orders",
    where: [{ columnName: "route_id", comOperator: "=", value: route_id }],
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
  getOrdersByRouteId,
  newOrders,
  newOrder,
  rejectAnOrder,
  shipAnOrder,
  getOrdersCountByStatus,
  getTotalVolumeForOrder,
  getTrainsForOrder,
  getTrainTimeTableForOrder,
};
