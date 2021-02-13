import { where } from "lodash/fp";
import { queryBuilder } from "../utils/db/database";

const pastOrders = (user_id: number) => {
    return queryBuilder({
        select: ["order_id", "order_date", "cost","order_status"],
        from: "order_table",
        operator:"AND",
        where: [{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_status", comOperator: "!=", value: "deleted" }]
    });
}

const pastOrder = (user_id: number, order_id:number) => {
    return queryBuilder({
        select: null,
        from: "ordered_product",
        join: { "product": "product_id", "order_table": "order_id" },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const deleteFromCart = (user_id: number, order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "deleted" } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const CancelAnOrder = (user_id: number, order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "canceled" } },
        operator:"AND",
        where:[{ columnName: "customer_id", comOperator: "=", value: user_id },{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const newOrders = () => {
    return queryBuilder(({
        select: null,
        from: "order_table",
        where:[{columnName: "order_status", comOperator: "=", value: "new"}]
    }))
}

const newOrder = (order_id: number) => {
    return queryBuilder({
        select: null,
        from: "order_table",
        join: {"customer":"customer_id", "ordered_product":"order_id","product":"product_id"},
        operator:"AND",
        where:[{columnName:"order_id", comOperator: "=", value: order_id}]
    })
}

const rejectAnOrder = (order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "rejected" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

const shipAnOrder = (order_id:number) => {
    return queryBuilder({
        update: { tableName: 'order_table', values: { "order_status": "shipped" } },
        where:[{ columnName: "order_id", comOperator: "=", value: order_id }]
    });
}

export { pastOrders,pastOrder,deleteFromCart,CancelAnOrder, newOrders, newOrder, rejectAnOrder, shipAnOrder };