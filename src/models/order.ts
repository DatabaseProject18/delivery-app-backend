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

const getTotalVolumeForOrder = (order_id:number): Promise<ResponseResult> => {
    return call("supply_chain_management_db.get_total_volume", [order_id]);
};


const orderStatus = (user_id: number, order_id:number): Promise<ResponseResult> => {
    return queryBuilder({
        select: ["order_status"],
        from: "order_table",
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const CreateAnOrder = (data: Object): Promise<ResponseResult> => {
  // const customerId = Object.values(data)[0];
  // const orderDate= Object.values(data)[1];
  // const deliveryDate= Object.values(data)[2];
  // const routeId= Object.values(data)[3];
  // const meetPosition = Object.values(data)[4];
  // const product = Object.values(data)[5];
  // const cost= Object.values(data)[6];
  // const paymentMethod= Object.values(data)[7];
  // const numOfProducts = Object.values(data)[8];
  //console.log({customerId,orderDate,deliveryDate,routeId,meetPosition,cost,paymentMethod,productData})
  //console.log(JSON.stringify( JSON.stringify(data)).replace(/\\/g,""))
  //const n = JSON.stringify(data.toString)
  //return call("insert_new_order", [JSON.stringify(data).toString().replace(/\\/g, "")]);
  return call("insert_new_order", [JSON.stringify( JSON.stringify(data)).replace(/\\/g,"").replace('"{',"{").replace('}"',"}")]);
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
};
